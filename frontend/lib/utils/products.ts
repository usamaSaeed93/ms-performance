import { products } from "@/lib/constants";

export function generateAllProducts(count: number = 12) {
  return Array.from({ length: count }, (_, i) => {
    const baseProduct = products[i % products.length];
    return {
      ...baseProduct,
      id: i + 1, // Generate unique IDs starting from 1
      brand: i % 3 === 0 ? "MS" : i % 3 === 1 ? "ANE" : "MS",
    };
  });
}

export function getProductById(id: number) {
  const allProducts = generateAllProducts();
  return allProducts.find((p) => p.id === id);
}

