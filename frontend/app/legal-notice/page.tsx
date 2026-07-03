"use client";

import Image from "next/image";
import { Navbar } from "@/components/Navbar";

const sections = [
  {
    title: "Dynamometer Testing Acknowledgement",
    body: `By engaging our services for vehicle testing, you acknowledge and agree to our dynamometer (dyno) testing policy. You understand the inherent risks involved with vehicle testing, which may potentially lead to vehicle damage or affect its performance. By proceeding, you release MS PERFORMANCE from any liability and waive any claims against MS PERFORMANCE regarding the testing conducted on your vehicle. Please be aware that MS PERFORMANCE does not extend any warranties, either expressed or implied, for the testing equipment used.`,
  },
  {
    title: "Diesel Particulate Filter (DPF) & Catalytic Converter (CAT) Modification Advisory",
    body: `We provide DPF solutions exclusively for vehicles operated off-road. Removing a DPF is not illegal for off-road use, but please be aware that it is an offense under the Road Vehicles (Construction and Use) Regulations to use a modified vehicle on public roads that fails to meet the original emissions standards. DPF removal typically leads to non-compliance with these standards and is likely to cause a failure during the MOT test due to the mandatory inspection of the exhaust system. Non-compliance with Regulation 61a can incur significant fines.`,
  },
  {
    title: "AdBlue System Modification Notice",
    body: `Our AdBlue deletion service is intended solely for off-road vehicle use. Utilizing this service on public roads can result in legal action. Our HGV and Agricultural AdBlue service is only for vehicles destined for export outside the European Union. You are responsible for reporting any such modifications to the appropriate authorities.`,
  },
  {
    title: "Custom Tune Policy",
    body: `All custom tunes are final, and no refunds will be issued once the service is provided. This policy is due to the extensive time and resources invested in the development of these tunes. We commit to providing full support to ensure proper function of the custom tunes.`,
  },
  {
    title: "Exhaust Modification Warning for Pop & Bang Tunes",
    body: `The Pop & Bang modification is designed for vehicles equipped with an upgraded exhaust system, including a decat or metallic sports cat. MS PERFORMANCE bears no liability for any damage that may result from the use of the Pop & Bang tune.`,
  },
  {
    title: "General Notice Regarding Off-Road Exhaust Services",
    body: `Please be advised that certain exhaust modification services offered by MS PERFORMANCE, including but not limited to DPF removal and AdBlue deletion, are strictly for off-road use and do not comply with UK road regulations. Operating a vehicle with these modifications on public roads is illegal in the UK and may result in legal penalties.`,
  },
];

export default function LegalNoticePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-[#030814] text-white">
          <Image
            src="/images/services/our-service.png"
            alt="Legal Notice"
            width={1600}
            height={400}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
          <div className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Legal Notice
              </h1>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 md:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl space-y-8">
            <p className="text-lg font-bold text-[#0c1b33]">Legal Notice</p>

            {sections.map((section) => (
              <div key={section.title} className="space-y-3">
                <h2 className="text-xl font-bold text-[#0c1b33]">{section.title}</h2>
                <p className="text-[#5c6c86] leading-relaxed">{section.body}</p>
              </div>
            ))}

            <p className="border-t border-gray-200 pt-6 text-[#5c6c86] leading-relaxed font-medium">
              By entrusting your vehicle keys to us, you are confirming your understanding and
              acceptance of our policy terms.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
