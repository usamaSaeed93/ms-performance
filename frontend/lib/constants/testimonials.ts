export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  image: string;
  rating: number; // 1-5 stars
  date: string; // Format: "Month Day, Year" e.g., "October 5, 2023"
  source?: "google" | "facebook" | "trustpilot";
}

export const testimonials: Testimonial[] = [
  {
    quote: "Amazing service! MS Performance transformed my Audi RS3 with a Stage 1 remap. They paid attention to every detail and delivered ahead of schedule. The car now feels incredible - smooth power delivery with savage acceleration. The only minor issue was a small glitch in the initial map, but they fixed it immediately. I appreciate their dedication!",
    name: "Daniel Thompson",
    role: "Audi RS3 Owner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    date: "October 5, 2023",
    source: "google",
  },
  {
    quote: "Their ECU tuning work was stunning! My BMW M4 received a custom remap and dyno testing. The power gains are impressive and the car drives beautifully. However, their response time to emails could be improved. Despite this, I would still highly recommend them for professional car tuning services.",
    name: "Olivia Bennett",
    role: "BMW M4 Owner",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    rating: 4,
    date: "September 20, 2023",
    source: "google",
  },
  {
    quote: "Flawless execution from start to finish! MS Performance did a complete Stage 2 upgrade on my Golf R including ECU remap, exhaust system, and turbo upgrade. Their innovative approach to tuning helped unlock serious performance. They even provided excellent post-tuning support and follow-up dyno sessions, which was a great bonus.",
    name: "James Wilson",
    role: "Golf R Owner",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    date: "August 8, 2023",
    source: "google",
  },
  {
    quote: "Huge thanks to the MS Performance team. Stage 1 on my RS3 is silky smooth yet savage when you need it. The remap transformed the car completely - better throttle response, more power throughout the rev range, and the pops and bangs on downshift are incredible. Professional service from start to finish!",
    name: "Lewis Jennings",
    role: "Audi RS3 Owner",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    date: "July 15, 2023",
    source: "google",
  },
  {
    quote: "They dialed in my G82 M4 on the dyno and shared every log file with me. Honest data, honest gains - exactly what you want from a tuner. The car made 580hp after their Stage 2 remap, and it drives like a dream. Transparent, professional, and results that speak for themselves.",
    name: "Maria Stevens",
    role: "BMW M4 Owner",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    date: "June 22, 2023",
    source: "google",
  },
  {
    quote: "Remote tune arrived overnight. Car feels OEM+ smooth but with serious power gains. My Mercedes C63 now pulls much harder and the fuel economy actually improved - win win! The team explained everything clearly and were available for questions throughout. Top quality service!",
    name: "Samir Patel",
    role: "Mercedes C63 Owner",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    date: "May 10, 2023",
    source: "google",
  },
  {
    quote: "ECU remap on my Focus ST exceeded expectations. The car is now producing 320hp and drives beautifully. The custom exhaust they fitted sounds incredible too. Professional installation, dyno tested, and the team really knows their stuff. Highly recommended!",
    name: "Ryan Mitchell",
    role: "Ford Focus ST Owner",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    date: "November 12, 2023",
    source: "google",
  },
  {
    quote: "DPF and EGR delete done perfectly on my van. The performance improvement is night and day, and fuel consumption has dropped significantly. The team was professional, clean work, and no issues at all. Will definitely be back for more tuning work!",
    name: "David Cooper",
    role: "Commercial Van Owner",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    date: "October 28, 2023",
    source: "google",
  },
];

