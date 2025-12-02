# Project Structure

This document outlines the professional folder structure of the MS Performance project.

## 📁 Directory Structure

```
ms-performance/
├── app/                    # Next.js app directory
│   ├── home/              # Home page route
│   │   └── page.tsx      # Main home page component
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Root page
│   └── globals.css       # Global styles
│
├── lib/                   # Library and utilities
│   └── constants/        # Application constants
│       ├── index.ts      # Central export file
│       ├── navigation.ts # Navigation links
│       ├── services.ts   # Services data
│       ├── products.ts   # Products data
│       ├── brands.ts     # Brand logos
│       ├── stats.ts      # Statistics data
│       ├── testimonials.ts # Testimonials data
│       ├── blog.ts       # Blog posts data
│       └── footer.ts     # Footer links
│
├── types/                 # TypeScript type definitions
│   └── index.ts          # Shared types and interfaces
│
├── public/                # Static assets
│   ├── images/           # Organized image assets
│   │   ├── services/     # Service-related images
│   │   ├── products/     # Product images
│   │   ├── logos/        # Brand logo images
│   │   ├── blog/         # Blog post images
│   │   └── hero/         # Hero section images
│   └── @ms-logo.png      # Main logo
│
├── components/            # Reusable React components (future)
│
└── [config files]         # Next.js, TypeScript, ESLint configs
```

## 📝 Key Features

### Constants Organization

All application data is organized in the `lib/constants/` directory:

- **Navigation**: Menu links and routing
- **Services**: Service offerings and descriptions
- **Products**: Product catalog with pricing
- **Brands**: Partner brand logos
- **Stats**: Company statistics
- **Testimonials**: Customer testimonials
- **Blog**: Blog post content
- **Footer**: Footer navigation links

### Image Organization

Images are organized by purpose:

- `images/services/` - Service-related images
- `images/products/` - Product images
- `images/logos/` - Brand partner logos
- `images/blog/` - Blog post featured images
- `images/hero/` - Hero section background images

### TypeScript Types

All shared types are defined in `types/index.ts` for type safety and consistency.

## 🚀 Usage

### Importing Constants

```typescript
import {
  navLinks,
  services,
  products,
  // ... other constants
} from "@/lib/constants";
```

### Using Types

```typescript
import type { Service, Product } from "@/types";
```

## 📦 Benefits

1. **Maintainability**: Easy to find and update data
2. **Scalability**: Simple to add new constants or types
3. **Organization**: Clear separation of concerns
4. **Type Safety**: TypeScript types ensure data consistency
5. **Reusability**: Constants can be shared across components
