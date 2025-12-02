export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  title: string;
  description: string;
  image: string;
}

export interface Product {
  title: string;
  price: string;
  oldPrice: string | null;
  rating: number;
  discount: string | null;
  image: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
}

export interface BlogPost {
  title: string;
  summary: string;
  image: string;
}

export interface FooterLink {
  title: string;
  links: string[];
}

