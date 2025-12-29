// VRM (Vehicle Registration Mark) Resolver API
const VRM_API_BASE_URL = "https://backend-2.tuning-company.co.uk";

export interface VRMEngineDetails {
  paths: {
    brand: {
      id: string;
      name: string;
    };
    model: {
      id: string;
      name: string;
    };
    engine: {
      id: string;
      name: string;
    };
    generation: {
      id: string;
      name: string;
    };
  };
  specz: {
    energy?: string;
    method?: string;
    engine_ecu?: string;
    engine_number?: string;
    "Cylinder content"?: number;
    bore_stroke_ratio?: string;
    compression_ratio?: string;
    engine_code?: string;
  };
  options?: string[];
  fullname: string;
  publicid: string;
  brand_svg?: string;
  brand_image?: string;
  read_methods?: any[];
  torque_white: number;
  torque_original: number;
  horsepower_white: number;
  horsepower_original: number;
}

export interface VRMResponse {
  id: string;
  name: string;
  year: number;
  cache: boolean;
  source: number;
  success: boolean;
  engine_path?: {
    brand_name: string;
    model_name: string;
    engine_name: string;
    generation_name: string;
  };
  engine_size?: string;
  engineDetails?: VRMEngineDetails;
}

export interface VRMError {
  error?: string;
  message?: string;
  success?: boolean;
  error_type?: string;
}

export interface Brand {
  id: string;
  name: string;
  url?: string;
  image?: string;
  svg?: string;
  rowid?: string;
  publicidtwo?: string;
  publicid?: string;
}

export interface Model {
  id: string;
  name: string;
  brand_id: string;
  url?: string;
  rowid?: string;
  publicidtwo?: string;
  publicid?: string;
}

export interface Generation {
  id: string;
  name: string;
  model_id: string;
  url?: string;
  start?: string;
  finish?: string;
  rowid?: string;
  publicidtwo?: string;
  publicid?: string;
}

export interface Engine {
  publicid: string;
  name: string;
  energy?: string;
}

/**
 * Resolve vehicle information from VRM (Vehicle Registration Mark)
 * @param reg - Vehicle registration number (e.g., "HY09LDC")
 * @param owner - Owner/domain identifier (e.g., "msperformance.co.uk")
 * @returns Promise with vehicle data or error
 */
export async function resolveVRM(
  reg: string,
  owner: string = "msperformance.co.uk"
): Promise<VRMResponse> {
  try {
    const url = `${VRM_API_BASE_URL}/resolve?reg=${encodeURIComponent(reg)}&owner=${encodeURIComponent(owner)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData: VRMError = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: any = await response.json();

    if (!data.success) {
      // Handle specific error types
      if (data.error_type === "other_car") {
        throw new Error(data.message || "This calculator is not available for this vehicle. Please use the manual selection or try a different vehicle.");
      }
      throw new Error(data.message || "Failed to resolve VRM. Please check the registration number and try again.");
    }

    return data as VRMResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred while resolving VRM");
  }
}

/**
 * Get all vehicle brands
 * @returns Promise with array of brands
 */
export async function getBrands(): Promise<Brand[]> {
  try {
    const url = `${VRM_API_BASE_URL}/getBrands`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Brand[] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred while fetching brands");
  }
}

/**
 * Get models for a specific brand
 * @param brandId - Brand ID
 * @returns Promise with array of models
 */
export async function getModels(brandId: string): Promise<Model[]> {
  try {
    const url = `${VRM_API_BASE_URL}/getModels?brand_id=${encodeURIComponent(brandId)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Model[] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred while fetching models");
  }
}

/**
 * Get generations for a specific model
 * @param modelId - Model ID
 * @returns Promise with array of generations
 */
export async function getGenerations(modelId: string): Promise<Generation[]> {
  try {
    const url = `${VRM_API_BASE_URL}/getGenerations?model_id=${encodeURIComponent(modelId)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Generation[] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred while fetching generations");
  }
}

/**
 * Get engines for a specific generation
 * @param generationId - Generation ID
 * @returns Promise with array of engines
 */
export async function getEngines(generationId: string): Promise<Engine[]> {
  try {
    const url = `${VRM_API_BASE_URL}/getEngines?generation_id=${encodeURIComponent(generationId)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Engine[] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred while fetching engines");
  }
}

/**
 * Get engine details using engine_id
 * @param engineId - Engine ID (publicid from engine object)
 * @returns Promise with vehicle data or error
 */
export async function getEngineDetails(engineId: string): Promise<VRMResponse> {
  try {
    const url = `${VRM_API_BASE_URL}/getEngineDetails/?engine_id=${encodeURIComponent(engineId)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData: VRMError = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: any = await response.json();

    // Check if response indicates failure
    if (!data.success) {
      // Handle specific error types
      if (data.error_type === "other_car") {
        throw new Error(data.message || "This calculator is not available for this vehicle. Please use the manual selection or try a different vehicle.");
      }
      throw new Error(data.message || "Failed to get engine details. Please try again.");
    }

    // Transform the response to match VRMResponse structure
    const vrmResponse: VRMResponse = {
      id: data.engineDetails?.publicid || engineId,
      name: data.name || "",
      year: 0,
      cache: false,
      source: data.source || 0,
      success: data.success,
      engineDetails: data.engineDetails,
    };

    return vrmResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred while getting engine details");
  }
}

/**
 * @deprecated Use getEngineDetails instead
 * Resolve vehicle information using engine publicid
 */
export async function resolveByEngineId(
  publicid: string,
  owner: string = "msperformance.co.uk"
): Promise<VRMResponse> {
  return getEngineDetails(publicid);
}

