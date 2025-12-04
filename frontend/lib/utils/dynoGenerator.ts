/**
 * Mathematically accurate dyno data generator based on real engine physics
 * 
 * Core formula: HP = (Torque * RPM) / 5252
 * This ensures HP and Torque curves always cross at exactly 5252 RPM
 */

export type EngineType = "na" | "turbo" | "diesel";

export interface DynoDataPoint {
  rpm: number;
  torque: number;
  hp: number;
}

export interface DynoGeneratorParams {
  peakTorque: number; // Peak torque value (in same units as output)
  peakHP: number; // Peak horsepower value
  peakTorqueRPM: number; // RPM at which peak torque occurs
  peakHPRPM: number; // RPM at which peak HP occurs
  redline: number; // Maximum RPM
  engineType: EngineType;
  minRPM?: number; // Starting RPM (default: 800)
  rpmStep?: number; // Step size for RPM points (default: 100)
}

/**
 * Generate realistic torque curve based on engine type
 * Torque is the "driver" - HP is calculated from it
 */
function generateTorqueCurve(
  rpm: number,
  peakTorque: number,
  peakTorqueRPM: number,
  redline: number,
  engineType: EngineType
): number {
  // Normalize RPM for calculations (0-1 range)
  const normalizedRPM = rpm / redline;
  const normalizedPeakRPM = peakTorqueRPM / redline;
  
  let torqueRatio = 0; // 0-1 multiplier for peak torque

  switch (engineType) {
    case "turbo": {
      // Turbo: Logistic rise → plateau → exponential decline
      const spoolStart = 0.15; // ~15% of redline (typical turbo spool start)
      const spoolEnd = normalizedPeakRPM;
      
      if (rpm < redline * spoolStart) {
        // Below turbo spool - low torque, rapid rise as turbo spools
        const spoolProgress = rpm / (redline * spoolStart);
        // Exponential rise as turbo spools
        torqueRatio = 0.25 + 0.45 * (1 - Math.exp(-spoolProgress * 3));
      } else if (normalizedRPM <= normalizedPeakRPM) {
        // Peak torque zone - slight increase to peak
        const riseProgress = (normalizedRPM - spoolStart) / (normalizedPeakRPM - spoolStart);
        torqueRatio = 0.70 + 0.30 * riseProgress;
      } else if (normalizedRPM <= 0.75) {
        // Plateau after peak - hold torque relatively well
        const plateauProgress = (normalizedRPM - normalizedPeakRPM) / (0.75 - normalizedPeakRPM);
        torqueRatio = 1.0 - 0.15 * plateauProgress; // Gradual 15% drop
      } else {
        // High RPM falloff - exponential decline
        const falloffProgress = (normalizedRPM - 0.75) / (1.0 - 0.75);
        torqueRatio = 0.85 * Math.exp(-falloffProgress * 2.5);
      }
      break;
    }

    case "diesel": {
      // Diesel: Very early peak → rapid decline
      const peakEarlyRPM = Math.min(normalizedPeakRPM, 0.30); // Peak usually 1500-2500 RPM
      
      if (normalizedRPM <= peakEarlyRPM) {
        // Rise to peak
        torqueRatio = 0.40 + 0.60 * (normalizedRPM / peakEarlyRPM);
      } else if (normalizedRPM <= 0.50) {
        // Rapid decline after peak
        const declineProgress = (normalizedRPM - peakEarlyRPM) / (0.50 - peakEarlyRPM);
        torqueRatio = 1.0 - 0.40 * Math.pow(declineProgress, 1.5);
      } else {
        // Steep falloff at high RPM
        const falloffProgress = (normalizedRPM - 0.50) / (1.0 - 0.50);
        torqueRatio = 0.60 * Math.exp(-falloffProgress * 3);
      }
      break;
    }

    case "na":
    default: {
      // Naturally Aspirated: Smooth parabola-like rise → mild decline
      if (normalizedRPM <= normalizedPeakRPM) {
        // Smooth rise to peak (parabolic)
        const riseProgress = normalizedRPM / normalizedPeakRPM;
        torqueRatio = 0.30 + 0.70 * (1 - Math.pow(1 - riseProgress, 2));
      } else {
        // Mild decline after peak
        const declineProgress = (normalizedRPM - normalizedPeakRPM) / (1.0 - normalizedPeakRPM);
        torqueRatio = 1.0 - 0.50 * Math.pow(declineProgress, 1.2);
      }
      break;
    }
  }

  // Ensure torque never goes negative
  return Math.max(0, peakTorque * torqueRatio);
}

/**
 * Calculate horsepower from torque using the fundamental equation
 * HP = (Torque * RPM) / 5252
 */
function calculateHP(torque: number, rpm: number): number {
  if (rpm === 0) return 0;
  return (torque * rpm) / 5252;
}

/**
 * Generate mathematically accurate dyno data
 * 
 * @param params - Engine parameters and peak values
 * @returns Array of dyno data points with rpm, torque, and hp
 */
export function generateDynoData(params: DynoGeneratorParams): DynoDataPoint[] {
  const {
    peakTorque,
    peakHP,
    peakTorqueRPM,
    peakHPRPM,
    redline,
    engineType,
    minRPM = 800,
    rpmStep = 100,
  } = params;

  const dataPoints: DynoDataPoint[] = [];
  const rpmArray: number[] = [];
  const torqueArray: number[] = [];

  // Generate base torque curve from minimum RPM to redline
  for (let rpm = minRPM; rpm <= redline; rpm += rpmStep) {
    // Generate base torque curve (not yet scaled to peak)
    const baseTorque = generateTorqueCurve(rpm, 1.0, peakTorqueRPM, redline, engineType);
    rpmArray.push(rpm);
    torqueArray.push(baseTorque);
  }

  // Find indices for peak torque and peak HP RPM
  const peakTorqueIndex = rpmArray.findIndex(
    (rpm) => Math.abs(rpm - peakTorqueRPM) < rpmStep
  );
  const peakHPIndex = rpmArray.findIndex(
    (rpm) => Math.abs(rpm - peakHPRPM) < rpmStep
  );

  // Calculate required torque at peak HP RPM to achieve target peak HP
  // HP = (Torque * RPM) / 5252, so Torque = (HP * 5252) / RPM
  const requiredTorqueAtPeakHP = (peakHP * 5252) / peakHPRPM;

  // Scale torque curve to match peak torque requirement first
  let peakTorqueScale = 1;
  if (peakTorqueIndex !== -1 && torqueArray[peakTorqueIndex] > 0) {
    peakTorqueScale = peakTorque / torqueArray[peakTorqueIndex];
    torqueArray.forEach((torque, idx) => {
      torqueArray[idx] = torque * peakTorqueScale;
    });
  }

  // Check if scaled torque at peak HP RPM matches requirement
  // If not, adjust with a blend factor to match both peaks
  if (peakHPIndex !== -1 && torqueArray[peakHPIndex] > 0) {
    const actualTorqueAtPeakHP = torqueArray[peakHPIndex];
    const torqueRatio = requiredTorqueAtPeakHP / actualTorqueAtPeakHP;
    
    // If ratio is close to 1, we're good. Otherwise, apply a blend
    // to balance between peak torque and peak HP accuracy
    if (Math.abs(torqueRatio - 1.0) > 0.1) {
      // Blend adjustment: adjust all points proportionally
      // but preserve the curve shape
      const blendFactor = 0.7; // Prefer preserving peak torque shape
      const adjustmentFactor = 1.0 + (torqueRatio - 1.0) * blendFactor;
      
      torqueArray.forEach((torque, idx) => {
        // Apply less adjustment at peak torque, more elsewhere
        const distanceFromPeakTorque = Math.abs(idx - peakTorqueIndex) / rpmArray.length;
        const localAdjustment = 1.0 + (adjustmentFactor - 1.0) * (1 - distanceFromPeakTorque * 0.5);
        torqueArray[idx] = torque * localAdjustment;
      });
    }
  }

  const scaledTorqueArray = torqueArray;

  // Generate final data points with HP calculated from torque
  for (let i = 0; i < rpmArray.length; i++) {
    const rpm = rpmArray[i];
    const torque = Math.max(0, scaledTorqueArray[i]);
    const hp = calculateHP(torque, rpm);

    dataPoints.push({
      rpm,
      torque: Math.round(torque * 100) / 100, // Round to 2 decimal places
      hp: Math.round(hp * 100) / 100,
    });
  }

  return dataPoints;
}

/**
 * Detect engine type from fuel type or other indicators
 */
export function detectEngineType(
  fuelType?: string,
  engineName?: string
): EngineType {
  const fuel = (fuelType || "").toLowerCase();
  const engine = (engineName || "").toLowerCase();

  if (fuel.includes("diesel") || engine.includes("diesel") || engine.includes("tdi")) {
    return "diesel";
  }

  if (
    fuel.includes("petrol") ||
    fuel.includes("gasoline") ||
    engine.includes("turbo") ||
    engine.includes("tfsi") ||
    engine.includes("tsi") ||
    engine.includes("tdi")
  ) {
    // Check if turbo
    if (
      engine.includes("turbo") ||
      engine.includes("tfsi") ||
      engine.includes("tsi") ||
      engine.includes("t") ||
      engine.includes("supercharg")
    ) {
      return "turbo";
    }
    return "na";
  }

  // Default to turbo (most common for modern cars)
  return "turbo";
}

/**
 * Estimate engine parameters from available data
 */
export function estimateEngineParams(
  peakTorque: number,
  peakHP: number,
  engineType: EngineType,
  redline?: number
): {
  peakTorqueRPM: number;
  peakHPRPM: number;
  redline: number;
} {
  // Estimate redline if not provided
  const estimatedRedline = redline || 6500;

  // Typical peak RPM ranges by engine type
  let typicalPeakTorqueRPM: number;
  let typicalPeakHPRPM: number;

  switch (engineType) {
    case "diesel":
      typicalPeakTorqueRPM = 2000;
      typicalPeakHPRPM = 3500;
      break;
    case "turbo":
      typicalPeakTorqueRPM = 2500;
      typicalPeakHPRPM = 5500;
      break;
    case "na":
    default:
      typicalPeakTorqueRPM = 4000;
      typicalPeakHPRPM = 6000;
      break;
  }

  // Adjust based on peak HP RPM (if HP peaks very high, torque likely peaks lower)
  if (peakHPRPM && peakHPRPM > 0) {
    typicalPeakHPRPM = Math.min(peakHPRPM, estimatedRedline * 0.9);
    // Torque typically peaks before HP
    typicalPeakTorqueRPM = Math.max(1500, typicalPeakHPRPM * 0.5);
  }

  return {
    peakTorqueRPM: typicalPeakTorqueRPM,
    peakHPRPM: typicalPeakHPRPM,
    redline: estimatedRedline,
  };
}

