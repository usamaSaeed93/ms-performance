import type { ServicePageContent } from "@/lib/types/servicePageContent";

/** Maps URL slug → database `Service.title` for lookup. */
export const SERVICE_SLUG_TO_TITLE: Record<string, string> = {
  "ecu-remapping": "ECU Remapping",
  "dyno-tests": "Dyno Tests",
  "custom-exhausts": "Custom Exhausts",
  "dpf-egr-services": "DPF & EGR Services",
  "intake-upgrades": "Intake Upgrades",
  servicing: "Servicing",
  "number-plates": "Number Plates",
  "adblue-solutions": "Adblue Solutions",
  "performance-tuning": "Performance Tuning",
  "ecu-diagnostics": "ECU Diagnostics",
  "stage-upgrades": "Stage Upgrades",
};

/** Full frontend defaults for every service page, keyed by slug. */
export const SERVICE_PAGE_CONTENT_DEFAULTS: Record<string, ServicePageContent> = {
  "ecu-remapping": {
    hero: {
      eyebrow: "Feel the Need for Speed",
      title: "ECU Remapping",
      subtitle:
        "Unlock your vehicle's hidden potential with bespoke ECU calibration — more power, better response, and improved fuel economy, all verified on our state-of-the-art dyno.",
      badges: ["+15–30% Power", "Dyno Verified", "2–4 Hour Turnaround"],
    },
    intro: {
      eyebrow: "What We Do",
      title: "Car ECU Remapping:\nUnleashing True Power",
      paragraphs: [
        "Your car's ECU leaves the factory programmed for a compromise — balancing performance, emissions, and fuel economy across dozens of markets. At MSPerformance, we go further. We read your original ECU map, analyse every parameter, and write a completely bespoke calibration tailored specifically to your engine and your goals.",
        "Whether you want more outright power, sharper throttle response, or greater efficiency on longer drives, our custom remaps deliver measurable, repeatable results — all validated live on our AWD rolling road before you leave the workshop.",
      ],
      bullets: [
        "15–30% increase in power & torque",
        "Sharper throttle response & improved driveability",
        "Better fuel efficiency, especially on diesel engines",
        "Smoother, more progressive power delivery",
        "Bespoke calibration — no generic off-the-shelf maps",
      ],
    },
    gallery: {
      eyebrow: "Our Workshop",
      title: "See Us in Action",
      subtitle:
        "From deep-dive diagnostics to live dyno runs, every remap at MSPerformance is backed by real data and decades of hands-on expertise.",
      labels: ["Live Dyno Testing", "ECU Diagnostics", "Engine Bay Inspection"],
    },
    why: {
      eyebrow: "Why MSPerformance",
      title: "Choose MSPerformance",
      paragraph:
        "With years of hands-on experience and thousands of successful remaps under our belt, MSPerformance has become the trusted name for ECU tuning in the region. We never use generic maps. Every remap is custom-crafted for your specific vehicle, tested live on our dyno, and backed by our satisfaction guarantee — giving you complete confidence in every single gain.",
      stats: [
        { value: "30%", label: "Avg. Power Gain" },
        { value: "1,000+", label: "Remaps Completed" },
        { value: "20+", label: "Years Experience" },
        { value: "5★", label: "Customer Rating" },
      ],
    },
    benefits: {
      eyebrow: "The Benefits",
      title: "Key Benefits of the Service",
      paragraph:
        "Unlock the potential of your car with our service's key benefits, including enhanced horsepower and performance through software customization.",
      bullets: [
        "Precise Workmanship, Exceeding Customer Expectations",
        "100% Committed to Excellence in Every Project",
        "Extensive Selection of Premium Performance Upgrades",
      ],
      features: [
        {
          title: "Increase Safety",
          desc: "Dedicated to auto repair done right the first time",
        },
        {
          title: "Time-Saving",
          desc: "Our remappers install the perfect remap for your car in minutes",
        },
      ],
      includedTitle: "What's Included in Every Remap",
      included: [
        "Pre-remap health check & fault code scan",
        "Custom ECU map written for your specific car",
        "Live dyno run — before & after data",
        "Fuel, boost & ignition calibration",
        "Throttle response & rev limiter optimisation",
        "Post-remap road test & verification",
        "Certificate of calibration provided",
        "Aftercare support & follow-up included",
      ],
    },
    faq: {
      eyebrow: "FAQs",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "What is remapping?",
          answer:
            "Car remapping involves modifying a vehicle to enhance its performance, including boosting speed, improving functionality, and enhancing the overall driving experience. This process exclusively applies to existing car models and demands the expertise of professionals to ensure error-free execution.",
        },
        {
          question: "Is remapping safe for the vehicles?",
          answer:
            "Car remapping, performed by MSPerformance, involves enhancing and optimizing the engine power of a vehicle while adhering to safe limits. Our remapping service takes into account the high tolerance level of your vehicle and considers any applicable warranty claims. A thorough remapping procedure ensures that the engine control unit (ECU) does not approach component failure, making it completely safe for your car. It is crucial to choose a reputable company with skilled remapping experts who can flawlessly execute the job. We commence our car remapping process by thoroughly understanding your vehicle, ensuring improvements are made without any mechanical or component failures.",
        },
        {
          question: "Do you provide a warranty?",
          answer:
            "While undergoing vehicle remapping with MSPerformance, you can rest assured that your car will not encounter any mechanical or engine-related problems when properly maintained. However, we understand the importance of customer satisfaction, which is why we provide a 30-day money-back guarantee if the remapping results do not meet your desired outcomes or expectations.",
        },
        {
          question: "What about insurance?",
          answer:
            "Prior to making any modifications to your vehicle, we strongly recommend that clients inform their insurance company to avoid potential complications when filing insurance claims. Many insurance providers do not penalize customers for modifying their cars and transforming them into more fuel-efficient models. Additionally, we offer a conformity certificate if requested by the vehicle owner, ensuring compliance with any applicable regulations or requirements.",
        },
        {
          question: "Do you keep a copy of the original files?",
          answer:
            "At MSPerformance, we prioritize the security of our customers' original car files. We ensure their preservation by storing them in a secure archive, allowing you the option to restore your vehicle to its original configuration if the need arises in the future. This service provides you with peace of mind, knowing that your car's original settings can be reinstated whenever required, guaranteeing flexibility and preserving the integrity of your vehicle.",
        },
      ],
    },
  },

  "dyno-tests": {
    hero: {
      eyebrow: "Precision Performance Measurement",
      title: "Dyno Tests",
      subtitle:
        "Stop guessing. Start measuring. Our AWD rolling road delivers hard power and torque data so every tuning decision is backed by real evidence.",
      badges: ["AWD Capable", "Live Data Logging", "~1 Hr Power Run"],
    },
    intro: {
      eyebrow: "Accurate Power Analysis",
      title: "Accurate Power &\nTorque Analysis",
      paragraphs: [
        "Our cutting-edge AWD Rolling Road provides the ultimate environment for tuning and power testing. Whether you are validating a new modification or fine-tuning for the track, our dyno ensures you get precise, repeatable data in a fully controlled setting.",
        "We simulate real-world driving conditions — including full boost runs, load sweeps, and coast-down testing — so every number we hand you is a true reflection of what your car is actually doing on the road, not a theoretical estimate.",
      ],
      bullets: [
        "Precise horsepower & torque readings at the wheels",
        "Air-fuel ratio & boost pressure monitoring",
        "Safe, controlled high-speed simulation",
        "Before & after comparison graphs provided",
        "Suitable for FWD, RWD & AWD vehicles",
      ],
    },
    gallery: {
      eyebrow: "Our Dyno Suite",
      title: "Inside Our Test Cell",
      subtitle:
        "Every run is monitored by our experts in real time — from strapping and safety checks to full boost pulls and data analysis.",
      labels: ["Car on Dyno", "Data Logging", "Power Run"],
    },
    why: {
      eyebrow: "Why Dyno?",
      title: "The Dyno Advantage",
      paragraph:
        "Stop guessing and start measuring. Our dyno testing reveals the true health and performance of your engine. It's the only way to accurately quantify gains from modifications and ensure that your air-fuel ratios, boost levels, and ignition timing are perfectly calibrated for both reliability and maximum power output.",
      stats: [
        { value: "4WD", label: "Rolling Road" },
        { value: "100+", label: "Data Channels" },
        { value: "±1%", label: "Accuracy" },
        { value: "5★", label: "Customer Rating" },
      ],
    },
    benefits: {
      eyebrow: "The Benefits",
      title: "Key Benefits of Dyno Testing",
      paragraph:
        "Beyond just bragging rights for horsepower, dyno testing is a critical diagnostic tool. It allows us to load the engine in a fully controlled environment to detect issues that might only appear under stress, ensuring your car is performing its absolute best at all times.",
      bullets: [],
      features: [
        {
          title: "Verify Your Gains",
          desc: "Prove the effectiveness of your modifications with hard, unambiguous data. Know exactly what each upgrade delivered — in numbers.",
        },
        {
          title: "Engine Safety Monitoring",
          desc: "We monitor air-fuel ratio, exhaust gas temps, knock, and boost in real time during every run — protecting your engine at every RPM.",
        },
        {
          title: "Saves Time on the Road",
          desc: "Controlled dyno tuning is faster and safer than road tuning. We can run dozens of calibration passes in the time it would take to do one road session.",
        },
      ],
      includedTitle: "What's Included in a Dyno Session",
      included: [
        "Pre-session vehicle health check",
        "Professional strapping & setup",
        "Multiple power runs for repeatable data",
        "Live air-fuel ratio & boost monitoring",
        "Exhaust gas temperature tracking",
        "Full power & torque graph printout",
        "Expert debrief & tuning recommendations",
        "Video recording of your power run",
      ],
    },
    faq: {
      eyebrow: "FAQs",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "Why should I dyno test my car?",
          answer:
            "Dyno testing provides accurate performance data, including horsepower and torque curves. It safely simulates road conditions to tune your engine for maximum efficiency and power without the risks of public roads. It's essential for verifying the results of any performance upgrades.",
        },
        {
          question: "Is dyno testing safe for my vehicle?",
          answer:
            "Yes, our AWD dyno cells are equipped with state-of-the-art cooling and safety systems. Our technicians are highly trained to monitor your vehicle's parameters throughout the test to ensure it remains within safe operating limits.",
        },
        {
          question: "What kind of vehicles can you test?",
          answer:
            "We can test Front-Wheel Drive (FWD), Rear-Wheel Drive (RWD), and All-Wheel Drive (AWD) vehicles. Our dyno can handle high-performance cars, 4x4s, and even specialised motorsport vehicles.",
        },
        {
          question: "How long does a dyno session take?",
          answer:
            "A standard power run typically takes about an hour, including setup and strapping. Full custom tuning sessions can take longer, ranging from 2–4 hours or more depending on the complexity of the work.",
        },
      ],
    },
  },

  "custom-exhausts": {
    hero: {
      eyebrow: "Sound & Performance Redefined",
      title: "Custom Exhausts",
      subtitle:
        "Hand-crafted exhaust systems built to your exact specifications — from cat-back to full manifold systems — delivering the sound, power, and aesthetics your car deserves.",
      badges: ["Bespoke Fabrication", "TIG Welded", "Lifetime Warranty on Piping"],
    },
    intro: {
      eyebrow: "What We Build",
      title: "Tailored Tones &\nOptimised Flow",
      paragraphs: [
        "A custom exhaust is one of the most rewarding upgrades for any car enthusiast. At MSPerformance, our TIG welding specialists hand-craft every system from scratch, using mandrel bends to maintain constant internal diameter — eliminating restriction and squeezing every last bit of flow from your engine.",
        "Whether you want a whisper-quiet daily driver setup or a race-inspired bark that turns heads, we design and fabricate the perfect exhaust for your car, your driving style, and your budget.",
      ],
      bullets: [
        "Cat-back, downpipe-back & manifold-back systems",
        "Valved exhaust systems for sound control",
        "304 & 316 stainless, mild steel, or titanium",
        "Mandrel bent pipes for unrestricted flow",
        "Polished or ceramic-coated tip finishes",
      ],
    },
    gallery: {
      eyebrow: "Craftsmanship",
      title: "Master Craftsmanship",
      subtitle:
        "We believe an exhaust is a piece of art. See how our fabricators turn raw materials into precision performance hardware.",
      labels: ["Fabrication & Welding", "System Fitment", "Finished Result"],
    },
    why: {
      eyebrow: "Why MSPerformance",
      title: "Built for Drivers Who Care",
      paragraph:
        "Every exhaust that leaves our workshop is a product of genuine passion and technical precision. We don't bolt on off-the-shelf parts. We build custom systems designed around your car's specific geometry, engine output, and performance targets — then test the result to ensure it meets our exacting standards before handing back the keys.",
      stats: [
        { value: "100%", label: "Bespoke Builds" },
        { value: "500+", label: "Systems Built" },
        { value: "TIG", label: "Precision Welding" },
        { value: "5★", label: "Customer Rating" },
      ],
    },
    benefits: {
      eyebrow: "The Benefits",
      title: "Key Advantages of a Custom System",
      paragraph:
        "Unlike universal aftermarket exhausts that need adapters and compromises, a custom-built system fits perfectly, flows optimally, and looks exactly as intended. The improvements go beyond sound alone.",
      bullets: [],
      features: [
        {
          title: "Power Gains You Can Feel",
          desc: "Reduced back pressure means your engine breathes more freely, translating into measurable horsepower and torque gains across the rev range.",
        },
        {
          title: "Stunning Aesthetic Appeal",
          desc: "Precision TIG welds, polished tips, and clean routing make your exhaust a visual highlight of the car — not just a functional component.",
        },
        {
          title: "Lifetime Warranty on Piping",
          desc: "We stand behind our work. Every custom exhaust system comes with a lifetime warranty on the pipework and welds — built to last.",
        },
      ],
      includedTitle: "What's Included in Every Build",
      included: [
        "Free consultation & design quote",
        "Custom fabrication to your specifications",
        "Mandrel-bent pipework for optimal flow",
        "Professional TIG welding throughout",
        "Professional fitting & alignment",
        "Sound testing & tuning",
        "Polished or ceramic-coated tips",
        "Lifetime warranty on all piping",
      ],
    },
    faq: {
      eyebrow: "FAQs",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "Is professional installation necessary for a custom exhaust system?",
          answer:
            "Yes, professional installation is highly recommended. A properly fitted exhaust system requires precise welding, correct alignment, and secure mounting to prevent rattles, leaks, and potential damage. Our technicians ensure perfect fitment and optimal performance from your new exhaust system.",
        },
        {
          question: "Are valved (catalytic controlled) exhaust systems worth it?",
          answer:
            "Absolutely. Valved systems let you switch between an aggressive performance sound and a quieter everyday mode — perfect for vehicles that double as daily drivers and weekend track cars. We can design and fit a bespoke valved system to suit your exact requirements.",
        },
        {
          question: "What are the benefits of installing a custom exhaust system?",
          answer:
            "Custom exhausts offer improved gas flow for better engine performance and efficiency, a more aggressive or refined sound profile, reduced weight compared to stock systems, and enhanced aesthetics with polished or ceramic-coated tips.",
        },
        {
          question: "What materials do you use for custom exhausts?",
          answer:
            "We work with stainless steel (304 & 316 grade), mild steel, and titanium depending on your budget and goals. Stainless is our most popular choice for its balance of durability, heat resistance, and appearance. Titanium is reserved for motorsport builds where weight saving is paramount.",
        },
        {
          question: "Do you keep a copy of the original ECU files?",
          answer:
            "Yes, we always back up your vehicle's original ECU data before any remapping work. This ensures we can restore factory settings at any time, providing complete peace of mind.",
        },
        {
          question: "Will a custom exhaust affect my insurance?",
          answer:
            "We recommend informing your insurer about any exhaust modifications. Many specialist insurers cater specifically to modified vehicles and offer competitive premiums. We can provide full documentation of any work carried out.",
        },
        {
          question: "Can you work with my existing downpipe or manifold?",
          answer:
            "In most cases, yes. We assess the existing components first and advise whether they can be retained or whether a replacement would yield better results. Sometimes pairing a new cat-back system with an upgraded downpipe offers significantly better gains.",
        },
        {
          question: "How long does a custom exhaust build take?",
          answer:
            "A typical cat-back system takes one day. More complex manifold-back or full custom builds may require 2–3 days, especially if bespoke fabrication is involved. We will always give you a clear timeline before work begins.",
        },
      ],
    },
  },

  "dpf-egr-services": {
    hero: {
      eyebrow: "Professional DPF Cleaning Services",
      title: "DPF Cleaning & Diagnostics",
      subtitle:
        "A blocked Diesel Particulate Filter (DPF) can lead to reduced engine power, poor fuel economy, warning lights, and your vehicle entering limp mode. We provide professional diagnostics, cleaning, and regeneration services to restore your vehicle's performance.",
      badges: ["DPF Diagnostics", "DPF Cleaning", "DPF Regeneration"],
    },
    intro: {
      eyebrow: "Professional Diagnostics",
      title: "Accurate Diagnosis,\nEffective Solutions",
      paragraphs: [
        "Using advanced diagnostic equipment, our experienced technicians accurately identify the cause of DPF faults before recommending the most effective solution for your vehicle.",
        "If you're experiencing any symptoms of a blocked DPF, it's important to have your vehicle inspected before the problem becomes more expensive to repair. We help you avoid the cost of unnecessary DPF replacement.",
      ],
      bullets: [
        "Accurate identification of root causes",
        "Advanced diagnostic equipment",
        "Experienced technicians",
        "Cost-effective alternatives to replacement",
        "Honest advice and recommendations",
      ],
    },
    gallery: {
      eyebrow: "Our Process",
      title: "Expert Diagnosis in Action",
      subtitle:
        "Don't just replace parts. Understand the problem. Our technicians use precise diagnostics to identify exactly what's wrong and apply a targeted, lasting fix.",
      labels: ["Diagnostics Scan", "DPF Inspection", "System Restoration"],
    },
    why: {
      eyebrow: "Why MSPerformance",
      title: "Fix It Right, First Time",
      paragraph:
        "A blocked DPF is often a symptom, not the root cause. We go beyond clearing fault codes — we investigate why the issue occurred, whether it's a faulty temperature sensor, a failing injector, a turbo boost leak, or simply the wrong driving cycle. Treating the cause means the problem doesn't come back two months later.",
      stats: [
        { value: "Experts", label: "Experienced DPF specialists" },
        { value: "Advanced", label: "Dealer-level diagnostics" },
        { value: "Honest", label: "Transparent pricing" },
        { value: "Savings", label: "Cost-effective alternatives" },
        { value: "Fast", label: "Quick turnaround" },
        { value: "Quality", label: "Workmanship guaranteed" },
      ],
    },
    benefits: {
      eyebrow: "Our Services",
      title: "Our DPF Services Include",
      paragraph:
        "Whether your vehicle has a blocked DPF, warning light or reduced performance, MS Performance can diagnose the problem and recommend the right solution.",
      bullets: [],
      features: [
        {
          title: "DPF Diagnostics",
          desc: "We carry out a full diagnostic inspection to identify blocked filters, faulty sensors, regeneration issues and underlying engine faults.",
        },
        {
          title: "DPF Cleaning",
          desc: "Our professional cleaning process removes soot and ash build-up, restoring airflow and improving engine efficiency.",
        },
        {
          title: "Forced DPF Regeneration",
          desc: "Where appropriate, we perform a controlled regeneration to safely burn away accumulated soot and return the filter to normal operation.",
        },
        {
          title: "DPF Repairs & Replacement",
          desc: "If your DPF is beyond cleaning, we offer expert repair and replacement services using quality components.",
        },
      ],
      includedTitle: "Common Signs of a Blocked DPF",
      included: [
        "DPF warning light illuminated",
        "Vehicle in limp mode",
        "Loss of engine power",
        "Poor fuel economy",
        "Excessive exhaust smoke",
        "Failed DPF regeneration",
        "Engine management light",
      ],
    },
    faq: {
      eyebrow: "FAQs",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "What are DPF and EGR?",
          answer:
            "DPF (Diesel Particulate Filter) captures soot from diesel exhaust to reduce particulate emissions, while EGR (Exhaust Gas Recirculation) recirculates exhaust gases back into the intake to lower NOx output. Both are critical for modern diesel emissions compliance but can clog or fail over time, severely impacting performance.",
        },
        {
          question: "How do I know if my DPF is blocked?",
          answer:
            "Common symptoms include a warning light on the dashboard, noticeable power loss or limp mode, increased fuel consumption, more frequent regeneration cycles, and excessive smoke from the exhaust. If any of these appear, get the car checked immediately — ignoring a blocked DPF can lead to expensive engine damage.",
        },
        {
          question: "What is DPF cleaning?",
          answer:
            "DPF cleaning involves removing the accumulated ash and soot from the filter to restore it to near-new efficiency. Using forced regeneration or chemical cleaning, this is a cost-effective alternative to full DPF replacement, which can cost several thousand pounds.",
        },
        {
          question: "Is it legal to remove the DPF?",
          answer:
            "In the UK, driving a vehicle that has had its DPF removed is illegal and will result in an MOT failure. We only offer cleaning, maintenance, and fault rectification solutions to keep your vehicle road-legal. DPF removal is strictly for closed-circuit motorsport or off-road use.",
        },
      ],
    },
  },

  "intake-upgrades": {
    hero: {
      eyebrow: "Maximum Forced Induction",
      title: "Intake Upgrades",
      subtitle:
        "From hybrid turbos for spirited road driving to full frame turbo conversions for track day domination — we supply, fit, and custom-tune the complete forced induction package.",
      badges: ["Hybrid Turbos", "Full Frame Kits", "Dyno Calibrated"],
    },
    intro: {
      eyebrow: "What We Offer",
      title: "Unleash Massive,\nReliable Power",
      paragraphs: [
        "The turbocharger is the most impactful single component upgrade you can make to a forced-induction engine. At MSPerformance, we treat every turbo upgrade as a complete system project — not just bolting on a bigger unit and hoping for the best.",
        "We evaluate your engine's existing limitations, design a supporting modification package, source the ideal turbo for your goals, carry out the full installation, and verify every gain on our AWD rolling road with a bespoke ECU calibration.",
      ],
      bullets: [
        "Hybrid turbos for street & road use",
        "Full frame turbo conversions for maximum power",
        "Intercooler, fueling & exhaust upgrades included",
        "Custom ECU remap tailored to new turbo specs",
        "Dyno-verified before, during & after",
      ],
    },
    gallery: {
      eyebrow: "Integrated Solutions",
      title: "A Complete System Overhaul",
      subtitle:
        "A turbo upgrade isn't just one part — it's an ecosystem. We consider every component in the chain to ensure maximum power with total reliability.",
      labels: ["Turbo Installation", "Intercooler & Pipework", "Dyno Calibration"],
    },
    why: {
      eyebrow: "Why MSPerformance",
      title: "Integrated Solutions, Maximum Results",
      paragraph:
        "A turbo upgrade done half-heartedly is a recipe for blown seals, cracked pistons, and expensive repair bills. We take a systematic approach — evaluating cooling, fueling, exhaust flow, and software before recommending a single component. Our in-house dyno ensures the final calibration is precisely dialled for your engine's new capabilities.",
      stats: [
        { value: "50+", label: "Bhp Min. Gain" },
        { value: "2×", label: "Power Possible" },
        { value: "100%", label: "Dyno Verified" },
        { value: "5★", label: "Customer Rating" },
      ],
    },
    benefits: {
      eyebrow: "The Benefits",
      title: "Experience the Difference",
      paragraph:
        "The transformation a quality turbo upgrade brings is unlike any other modification. Done correctly, it reshapes the entire power character of your car — broader torque, stronger mid-range pull, and a top-end that keeps building long after stock power fades.",
      bullets: [],
      features: [
        {
          title: "Power on Demand",
          desc: "Stronger torque across the RPM range transforms overtaking and everyday driving. Enjoy effortless pull from low revs up to the redline.",
        },
        {
          title: "Reliability First",
          desc: "Every supporting modification is calculated to protect your engine. We don't build power at the expense of longevity — both can coexist.",
        },
        {
          title: "Expert Fitting & Calibration",
          desc: "Supply-and-fit plus a bespoke ECU remap dialled on our dyno. Every turbo upgrade is a complete, finished package — not just a parts drop.",
        },
      ],
      includedTitle: "What's Included in a Turbo Package",
      included: [
        "Initial consultation & power target assessment",
        "Turbo selection & sourcing",
        "Professional turbo installation",
        "Intercooler upgrade & pipework",
        "Fuel system evaluation & upgrade if required",
        "High-flow exhaust & downpipe recommendation",
        "Bespoke ECU remap for new setup",
        "Full dyno session — before & after",
      ],
    },
    faq: {
      eyebrow: "FAQs",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "What is a hybrid turbo?",
          answer:
            "A hybrid turbo uses the original housing but with upgraded internals — a larger compressor wheel, improved turbine, ceramic ball bearings, and better seals — to flow significantly more air without requiring custom fabrication to fit. It's the ideal first upgrade for most road cars.",
        },
        {
          question: "Do I need other modifications alongside a turbo upgrade?",
          answer:
            "Yes. Installing a larger turbo typically requires supporting modifications including a larger front-mounted intercooler, a high-flow exhaust system, upgraded fuel injectors, a higher-capacity fuel pump, and — most critically — a custom ECU remap to safely manage the increased airflow and boost pressure.",
        },
        {
          question: "Will I experience more turbo lag?",
          answer:
            "Larger turbos can induce additional spool lag, but modern turbo technology and skilled calibration significantly minimise this. We balance peak power delivery with everyday drivability, ensuring responsive power from low RPM rather than just a top-end surge.",
        },
        {
          question: "How much power can I realistically expect?",
          answer:
            "This varies significantly by vehicle platform and turbo choice. A hybrid upgrade might yield 50–150 bhp, while a full frame turbo conversion with supporting modifications could double your engine output. During consultation, we'll advise on the realistic ceiling for your specific vehicle.",
        },
      ],
    },
  },

  servicing: {
    hero: {
      eyebrow: "Keeping Your Car at Its Best",
      title: "Servicing",
      subtitle:
        "Comprehensive vehicle servicing by qualified technicians using OEM-quality parts and the latest diagnostic equipment — keeping your car safe, efficient, and reliable.",
      badges: ["Interim Service", "Full Service", "Major Service"],
    },
    intro: {
      eyebrow: "What We Offer",
      title: "Full & Interim\nServicing",
      paragraphs: [
        "Regular servicing is the single most important thing you can do to protect your vehicle's value and ensure safe, reliable motoring. At MSPerformance, we follow manufacturer schedules precisely, using the correct grade oils and OEM-quality parts — then stamp and record your service history so your vehicle's value is fully maintained.",
        "Every service includes a comprehensive digital health check with a detailed report. You'll know exactly what condition every system on your car is in before you leave — no surprises, no hidden upsells.",
      ],
      bullets: [
        "Engine oil & filter to manufacturer specification",
        "Air, fuel & cabin filter inspection/replacement",
        "Brakes, tyres & lighting inspection",
        "Battery, alternator & charging system test",
        "Full coolant, brake & steering fluid check",
      ],
    },
    gallery: {
      eyebrow: "Our Workshop",
      title: "Professional Care at Every Step",
      subtitle:
        "From the moment your car arrives to the final road test, every stage of the service is carried out with the same attention to detail.",
      labels: ["Workshop Bay", "Diagnostic Check", "Quality Inspection"],
    },
    why: {
      eyebrow: "Why MSPerformance",
      title: "Expertise You Can Trust",
      paragraph:
        "Our fully trained technicians use state-of-the-art diagnostic equipment covering all makes and models. Every service includes a detailed health check report so you leave knowing exactly what condition your vehicle is in — and what, if anything, needs attention in the coming months.",
      stats: [
        { value: "All", label: "Makes & Models" },
        { value: "OEM+", label: "Quality Parts" },
        { value: "Same", label: "Day Turnaround" },
        { value: "5★", label: "Customer Rating" },
      ],
    },
    benefits: {
      eyebrow: "Service Packages",
      title: "Choose Your Service Level",
      paragraph:
        "We offer three service tiers to suit different vehicles, mileages, and budgets. Not sure which is right for you? Our team will advise based on your car's age, history, and driving habits.",
      bullets: [],
      features: [
        {
          title: "Interim Service",
          desc: "Oil & filter change plus a 25-point vehicle health check. Ideal every 6 months or 6,000 miles to maintain reliability between full services.",
        },
        {
          title: "Full Service",
          desc: "Complete manufacturer schedule — engine oil, all filters, spark plugs, fluids, and a full multi-point inspection with digital health check report.",
        },
        {
          title: "Major Service",
          desc: "Everything in a full service, plus timing belt inspection, spark plugs, brake fluid flush, and an extended diagnostic session for peace of mind.",
        },
      ],
      includedTitle: "What Every Service Includes",
      included: [
        "Engine oil & filter to manufacturer spec",
        "Air & cabin filter inspection/replacement",
        "Spark plug check & replacement (petrol)",
        "Brake pad & disc measurement & report",
        "Tyre condition, pressure & tread depth",
        "Battery & charging system health test",
        "All fluid levels checked & topped up",
        "Digital health check report provided",
      ],
    },
    faq: {
      eyebrow: "FAQs",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "What is included in a full service?",
          answer:
            "A full service covers engine oil and filter change, air filter, fuel filter, spark plugs (petrol), cabin filter, brake fluid check, tyre condition and pressure, battery health check, and a comprehensive visual inspection of all major systems.",
        },
        {
          question: "How often should I service my vehicle?",
          answer:
            "Most manufacturers recommend an annual service or every 10,000–12,000 miles, whichever comes first. If you drive in demanding conditions — short trips, heavy loads, or track days — more frequent intervals are advisable.",
        },
        {
          question: "Do you use genuine parts?",
          answer:
            "We use OEM-quality or better parts from reputable suppliers. Where a manufacturer-specific part is required for warranty purposes, we can source genuine items. All parts used are detailed on your service receipt.",
        },
        {
          question: "Will a service affect my vehicle warranty?",
          answer:
            "No. Under UK consumer law you are free to have your vehicle serviced by any competent independent garage without voiding the manufacturer's warranty, provided the correct parts and service intervals are followed and a detailed record is kept.",
        },
      ],
    },
  },

  "number-plates": {
    hero: {
      eyebrow: "Road-Legal & Show Plates",
      title: "Number Plates",
      subtitle:
        "Standard, 3D gel, and 4D acrylic number plates made to order. Road-legal and show styles available — all produced to current DVLA regulations.",
      badges: ["Standard Plates", "3D Gel Plates", "4D Acrylic Plates"],
    },
    intro: {
      eyebrow: "Our Products",
      title: "Plates That Make\nan Impression",
      paragraphs: [
        "Whether you need a straightforward replacement set or want to make a statement with premium 3D gel or 4D acrylic lettering, we have you covered. All road-legal plates are produced in accordance with current DVLA standards using the correct BS AU 145e compliant materials.",
        "Show plates are clearly marked for display use only. All road-legal plates are produced with proof of entitlement verification to ensure full legal compliance — protecting both you and us.",
      ],
      bullets: [
        "Standard flat road-legal plates (same day)",
        "3D gel raised characters — striking look, road-legal",
        "4D acrylic laser-cut characters for maximum impact",
        "Custom show plates in any background colour",
        "Motorcycle, trailer & front-only plates available",
      ],
    },
    gallery: {
      eyebrow: "Every Style, Every Finish",
      title: "Our Plate Range",
      subtitle:
        "From the classic flat plate to eye-catching 4D raised characters, we produce plates that complement your vehicle and reflect your style — without compromising on legality.",
      labels: ["Standard Plates", "3D Gel Plates", "4D Acrylic Plates"],
    },
    why: {
      eyebrow: "Why MSPerformance",
      title: "Quality You Can Trust",
      paragraph:
        "We produce every plate in-house using premium materials from approved DVLA-registered suppliers. Whether it's a simple pair of replacement plates or a bespoke 4D show set, the same attention to detail applies. All road-legal plates are verified against the DVLA database — giving you complete peace of mind.",
      stats: [
        { value: "3", label: "Plate Styles" },
        { value: "Same", label: "Day Standard Plates" },
        { value: "DVLA", label: "Registered Supplier" },
        { value: "5★", label: "Customer Rating" },
      ],
    },
    benefits: {
      eyebrow: "The Options",
      title: "Which Plate is Right for You?",
      paragraph:
        "Not sure which style suits your car? Here's a quick guide to our three main plate types — all available in road-legal or show plate variants.",
      bullets: [],
      features: [
        {
          title: "Standard Flat Plates",
          desc: "Classic reflective plates with the correct DVLA-approved Charles Wright font, ready on the same day. The clean, no-fuss choice for any vehicle.",
        },
        {
          title: "3D Gel Raised Plates",
          desc: "UV-stable gel domes give each character a striking raised, glossy finish. Road-legal and available in any standard registration. Adds real visual presence.",
        },
        {
          title: "4D Acrylic Plates",
          desc: "Laser-cut solid acrylic characters bonded for maximum depth and shadow effect. The premium choice for show cars and enthusiasts who want to stand out.",
        },
      ],
      includedTitle: "What to Bring for Road-Legal Plates",
      included: [
        "V5C logbook, new keeper slip, or insurance certificate",
        "Valid photographic ID (driving licence or passport)",
        "Your registration number (obviously!)",
        "Choice of plate style (standard, 3D, or 4D)",
        "Optional: border, badge, or flag preference",
      ],
      includedNote:
        "UK law requires the following to produce road-legal plates. Show plates can be produced without documentation.",
    },
    faq: {
      eyebrow: "FAQs",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "Are your number plates road-legal?",
          answer:
            "Yes. All standard number plates we produce meet current UK DVLA regulations — correct font (Charles Wright), reflective background, and BS AU 145e compliance. Show plates are marked accordingly and supplied for display purposes only.",
        },
        {
          question: "Can I get a custom shaped or 4D plate?",
          answer:
            "Absolutely. We offer gel (3D) and acrylic (4D) raised-letter plates in a variety of styles. These remain road-legal as long as the characters and spacing conform to DVLA standards.",
        },
        {
          question: "What do I need to bring to order road-legal plates?",
          answer:
            "UK law requires proof of entitlement (V5C logbook, new keeper slip, or insurance certificate) and valid photographic ID (driving licence or passport). Without these we can only produce show plates.",
        },
        {
          question: "How quickly can I get my plates?",
          answer:
            "Standard plates are usually ready the same day or next working day. Custom 3D/4D plates typically take 2–3 working days. We'll confirm the turnaround time when you place your order.",
        },
      ],
    },
  },

  "adblue-solutions": {
    hero: {
      eyebrow: "SCR & AdBlue Specialists",
      title: "AdBlue Solutions",
      subtitle:
        "Refills, fault diagnosis, injector replacement, and system resets for all diesel vehicles with Selective Catalytic Reduction technology — fast and competitively priced.",
      badges: ["AdBlue Refill", "SCR Diagnosis", "Component Repair"],
    },
    intro: {
      eyebrow: "What We Do",
      title: "Diagnose, Fix\n& Reset",
      paragraphs: [
        "AdBlue and SCR faults are among the most common warning lights on modern Euro 5 and Euro 6 diesel vehicles. Left unresolved, they can leave you stranded — many cars will refuse to restart once the tank empties or a sensor fault is detected.",
        "Our technicians carry specialist diagnostic tools to identify the exact cause, refill the fluid correctly to manufacturer spec, replace any faulty components, and clear all fault codes — getting you back on the road without delay and without dealership prices.",
      ],
      bullets: [
        "AdBlue tank refill to manufacturer specification",
        "Full SCR & NOx sensor diagnostic scan",
        "AdBlue injector inspection, cleaning & replacement",
        "SCR pump & module testing and replacement",
        "All fault codes cleared & system reset",
      ],
    },
    gallery: {
      eyebrow: "Our Process",
      title: "Dealer-Level Diagnostics",
      subtitle:
        "We use the same OBD and manufacturer-specific tools as main dealers to get the full picture — from tank level sensors to NOx catalytic efficiency — before recommending any repair.",
      labels: ["SCR Diagnostics", "Injector Testing", "System Reset"],
    },
    why: {
      eyebrow: "Why MSPerformance",
      title: "Fast, Accurate, Affordable",
      paragraph:
        "Main dealers charge premium rates for AdBlue work. We use the same diagnostic equipment and quality replacement parts at a fraction of the price — typically fixing AdBlue issues the same day. Whether it's a simple refill or a complete injector replacement, we handle it with speed and precision.",
      stats: [
        { value: "15min", label: "Refill Turnaround" },
        { value: "Same", label: "Day Diagnosis" },
        { value: "All", label: "Euro 5 & 6 Diesels" },
        { value: "5★", label: "Customer Rating" },
      ],
    },
    benefits: {
      eyebrow: "What We Offer",
      title: "Our AdBlue & SCR Services",
      paragraph:
        "From a routine top-up to a full SCR system overhaul, we cover every aspect of AdBlue and emission system maintenance. All work is carried out by trained technicians using specialist diagnostic equipment.",
      bullets: [],
      features: [
        {
          title: "AdBlue Refill",
          desc: "Correct-grade aqueous urea solution filled to the manufacturer specification, followed by a full system reset and confirmation that the warning light has cleared.",
        },
        {
          title: "Full SCR Fault Diagnosis",
          desc: "Complete OBD and manufacturer-specific scan covering AdBlue level sensors, NOx sensors, SCR catalyst efficiency, injector health, and pump operation.",
        },
        {
          title: "Component Repair & Replacement",
          desc: "Injector, pump, NOx sensor, and SCR module replacement using quality parts. All work is carried out to manufacturer specifications and verified post-repair.",
        },
      ],
      includedTitle: "What's Included in Every Visit",
      included: [
        "AdBlue system fault code scan",
        "NOx sensor & SCR catalyst test",
        "AdBlue tank level sensor check",
        "Injector spray pattern inspection",
        "Pump pressure & flow rate verification",
        "Correct-grade AdBlue refill if required",
        "All fault codes cleared & confirmed",
        "Post-repair verification drive",
      ],
    },
    faq: {
      eyebrow: "FAQs",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "What is AdBlue and why does my car need it?",
          answer:
            "AdBlue is a non-toxic aqueous urea solution injected into the exhaust stream of diesel vehicles equipped with Selective Catalytic Reduction (SCR) systems. It converts harmful nitrogen oxides (NOx) into harmless nitrogen and water, allowing modern diesels to comply with strict Euro 5 and Euro 6 emissions standards.",
        },
        {
          question: "What happens if I run out of AdBlue?",
          answer:
            "Most vehicles will issue a series of dashboard warnings well before the tank empties. Once fully depleted, Euro 6 vehicles are legally required to prevent engine restart until the tank is refilled. This makes prompt top-up essential — don't wait for the final warning.",
        },
        {
          question: "Can the AdBlue system be deleted?",
          answer:
            "We provide delete solutions strictly for off-road, closed-circuit motorsport, or export destinations where local regulations permit. Driving a vehicle with the AdBlue system disabled on UK public roads is illegal and will result in an MOT failure. We always discuss legal obligations fully with customers before undertaking any such work.",
        },
        {
          question: "How long does an AdBlue refill take?",
          answer:
            "A standard refill with system reset takes around 15–20 minutes. Fault diagnosis or component replacement (injector, pump, NOx sensor) will take longer — we'll advise on timing when you call or book online.",
        },
      ],
    },
  },

  "performance-tuning": {
    hero: {
      eyebrow: "Total Vehicle Optimization",
      title: "Performance Tuning",
      subtitle: "",
      badges: [],
    },
    intro: {
      eyebrow: "",
      title: "Beyond Just Horsepower",
      paragraphs: [
        "Real performance isn't just about a peak dyno number; it's about how the car drives, stops, and handles. Our performance tuning services cover the entire vehicle. From upgrading brakes and suspension to fine-tuning throttle maps for perfect response, we build complete driver's cars.",
      ],
      bullets: [],
    },
    gallery: {
      eyebrow: "",
      title: "",
      subtitle: "",
      labels: [],
    },
    why: {
      eyebrow: "",
      title: "A Holistic Approach",
      paragraph:
        "We don't believe in \"one size fits all\". We take the time to understand your driving style and goals. Whether you want a track day weapon or a comfortable fast road cruiser, we tailor every aspect of the tune to suit you.",
      stats: [],
    },
    benefits: {
      eyebrow: "",
      title: "Unlock Potential",
      paragraph: "Experience a car that feels tighter, sharper, and more alive.",
      bullets: [
        "Sharper Throttle Response",
        "Improved Handling & Braking",
        "Optimized Power Delivery",
      ],
      features: [
        {
          title: "Reliability Focus",
          desc: "We keep safety margins intact for daily driveability.",
        },
      ],
      includedTitle: "",
      included: [],
    },
    faq: {
      eyebrow: "",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "How is this different from ECU remapping?",
          answer:
            "Performance tuning is a broader term that encompasses ECU remapping, but also includes hardware modifications, suspension setups, and handling improvements. It's a holistic approach to making your car faster and better to drive.",
        },
        {
          question: "Will tuning reduce engine life?",
          answer:
            "If done correctly and maintained properly, no. We ensure all modifications remain within safe tolerances. However, pushing an engine to its absolute limit will naturally increase wear, so we advise regular maintenance for high-performance builds.",
        },
        {
          question: "Can I improve fuel economy?",
          answer:
            "Yes, 'Eco-tuning' is a form of performance tuning where we optimize the engine for efficiency rather than outright power. This can yield significant savings, especially for high-mileage drivers.",
        },
        {
          question: "Is it reversible?",
          answer:
            "Most software changes are fully reversible. Hardware changes can also be reversed, though labor costs would apply.",
        },
      ],
    },
  },

  "ecu-diagnostics": {
    hero: {
      eyebrow: "Pinpoint Accuracy",
      title: "ECU Diagnostics",
      subtitle: "",
      badges: [],
    },
    intro: {
      eyebrow: "",
      title: "Stop Guessing, Start Fixing",
      paragraphs: [
        "Modern cars are computers on wheels. When a problem arises, you need more than just a spanner; you need advanced diagnostic capability. We use state-of-the-art diagnostic tools to talk to your car's ECU, TCM, BCM, and other modules to identify faults quickly and accurately.",
      ],
      bullets: [],
    },
    gallery: {
      eyebrow: "",
      title: "",
      subtitle: "",
      labels: [],
    },
    why: {
      eyebrow: "",
      title: "Advanced Troubleshooting",
      paragraph:
        "We don't just read codes; we interpret live data. By analyzing sensor outputs in real-time, we can catch intermittent faults and issues that haven't yet triggered a warning light. This preventative approach saves you money on major repairs down the line.",
      stats: [],
    },
    benefits: {
      eyebrow: "",
      title: "Diagnostic Services",
      paragraph: "Comprehensive scanning for all vehicle makes and models.",
      bullets: [
        "Full System Scans",
        "Live Data Logging",
        "Module Coding & Programming",
      ],
      features: [
        {
          title: "Clear Reports",
          desc: "We explain the jargon so you know exactly what is wrong.",
        },
      ],
      includedTitle: "",
      included: [],
    },
    faq: {
      eyebrow: "",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "What does ECU diagnostics do?",
          answer:
            "ECU diagnostics involve using specialized computers to communicate with your car's On-Board Diagnostics (OBD) system. This allows us to read fault codes, view live sensor data, and check the health of various electronic modules to pinpoint issues.",
        },
        {
          question: "Why is my engine warning light on?",
          answer:
            "The 'Check Engine' light can trigger for hundreds of reasons, from a loose gas cap to a failing catalytic converter. Our diagnostics service will read the specific error code to tell you exactly what is wrong, avoiding guesswork.",
        },
        {
          question: "Can you reset airbag or ABS lights?",
          answer:
            "Yes, we can diagnose and reset warning lights for Airbags, ABS, Traction Control, and more—provided the underlying fault has been rectified. We prioritize safety and will ensure the system is functioning correctly.",
        },
        {
          question: "Do you offer dealer-level coding?",
          answer:
            "For many makes, yes. We can perform coding and adaptation for new modules, unlock hidden features, and update software versions, offering a dealer-level service at a fraction of the cost.",
        },
      ],
    },
  },

  "stage-upgrades": {
    hero: {
      eyebrow: "Structured Performance",
      title: "Stage Upgrades",
      subtitle: "",
      badges: [],
    },
    intro: {
      eyebrow: "",
      title: "The Path to Power",
      paragraphs: [
        "Tuning should be a journey, not a gamble. Our structured Stage packages (Stage 1, 2, and 3) provide a proven roadmap for upgrading your vehicle. We combine the best hardware with our bespoke software to deliver reliable performance enhancements at every level.",
      ],
      bullets: [],
    },
    gallery: {
      eyebrow: "",
      title: "",
      subtitle: "",
      labels: [],
    },
    why: {
      eyebrow: "",
      title: "Tested Combinations",
      paragraph:
        "We have done the research so you don't have to. We know which intercoolers fit best, which exhausts drone the least, and which turbos spool the fastest. Our packages remove the trial-and-error from modifying your car.",
      stats: [],
    },
    benefits: {
      eyebrow: "",
      title: "Clear Upgrade Path",
      paragraph: "Start with a remap and grow your build over time.",
      bullets: [
        "Proven Power Figures",
        "Balanced Hardware & Software",
        "Cost-Effective Bundles",
      ],
      features: [
        {
          title: "Best Value",
          desc: "Packages often save you money compared to buying parts individually.",
        },
      ],
      includedTitle: "",
      included: [],
    },
    faq: {
      eyebrow: "",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "What is Stage 1?",
          answer:
            "Stage 1 is the entry-level upgrade, usually consisting of just an ECU Remap (software update). It requires no hardware changes and optimizes the stock components for better power and efficiency.",
        },
        {
          question: "What is Stage 2?",
          answer:
            "Stage 2 adds hardware modifications to the Stage 1 map. This typically includes a freer-flowing exhaust (downpipe/cat-back) and an intake system upgrade (intercooler/induction kit) to handle the increased heat and airflow.",
        },
        {
          question: "What is Stage 3?",
          answer:
            "Stage 3 is a serious upgrade involving changing the turbocharger itself, along with injectors, fuel pumps, and often engine internal strengthening. This transforms the car's performance capabilities entirely.",
        },
        {
          question: "Are these packages reliable?",
          answer:
            "Yes, our compiled packages are tested to work harmoniously. We select components that complement each other and tune the ECU to ensure safe operation at these higher power levels.",
        },
      ],
    },
  },
};
