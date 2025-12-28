"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { navLinks } from "@/lib/constants";
import { useGetProductQuery, useGetProductImagesQuery } from "@/lib/store/api/productsApi";
import ProductReviews from "@/components/products/ProductReviews";
import { Navbar } from "@/components/Navbar";
import { addToCart } from "@/lib/utils/cart";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = typeof params?.id === 'string' ? parseInt(params.id, 10) : 0;

  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("Description");
  const [quantity, setQuantity] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    setIsAuthenticated(!!token);
  }, []);

  const { data: product, isLoading, error } = useGetProductQuery(productId, {
    skip: !productId || isNaN(productId),
  });

  const { data: imagesData } = useGetProductImagesQuery(productId, {
    skip: !productId || isNaN(productId),
  });

  const images = imagesData?.images || [];
  const sortedImages = images.length > 0
    ? [...images].sort((a, b) => a.sort_order - b.sort_order)
    : [];

  const productImages = useMemo(() => {
    if (sortedImages.length > 0) {
      return sortedImages.map(img => img.image_url);
    }
    return product?.image_url ? [product.image_url] : ["/images/products/product1.png"];
  }, [sortedImages, product?.image_url]);

  const currentImage = productImages[selectedImage] || productImages[0];

  const price = product ? parseFloat(product.price) : 0;
  const salePrice = product?.sale_price ? parseFloat(product.sale_price) : null;
  const displayPrice = salePrice || price;
  const oldPrice = salePrice ? price : null;

  const discount = salePrice && price > salePrice
    ? Math.round(((price - salePrice) / price) * 100)
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product || isNaN(productId)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-sm mb-4">Looking for ID: {params?.id}</p>
          <Link href="/products" className="text-[#1d70ff] hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        <div className="bg-white overflow-hidden">
          <Navbar ctaText="Become A Dealer" />

          <main className="space-y-12">
            <section className="relative overflow-hidden bg-[#030814] text-white h-[200px] sm:h-[250px] md:h-[300px]">
              <Image
                src="/images/hero/slider1.jpg"
                alt="Product Detail"
                width={1600}
                height={300}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative h-full flex items-center px-4 sm:px-6 md:px-8 lg:px-12">
                <h1 className="text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl animate-heading">Product Detail</h1>
              </div>
            </section>

            <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
              <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
                <div className="space-y-4">
                  <div className="flex justify-end">

                  </div>

                  <div className="relative bg-white rounded-[12px] overflow-hidden shadow-sm">
                    <div className="relative aspect-square">
                      <Image
                        src={currentImage}
                        alt={product.product_name}
                        width={600}
                        height={600}
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                    {productImages.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : productImages.length - 1))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0c1b33]">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setSelectedImage((prev) => (prev < productImages.length - 1 ? prev + 1 : 0))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0c1b33]">
                            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>

                  {productImages.length > 1 && (
                    <div className="flex gap-3">
                      {productImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative flex-1 aspect-square rounded-[8px] overflow-hidden border-2 transition ${selectedImage === index ? "border-[#1d70ff]" : "border-gray-200"
                            }`}
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            width={100}
                            height={100}
                            className="w-full h-full object-contain p-2"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <h1 className="text-2xl font-black text-[#0c1b33] sm:text-3xl lg:text-4xl animate-heading">
                    {product.product_name}
                  </h1>

                  <div className="flex items-baseline gap-2 sm:gap-3">
                    {oldPrice && (
                      <span className="text-lg text-[#9aa6bd] line-through sm:text-xl">
                        £{oldPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-3xl font-black text-[#0c1b33] sm:text-4xl">
                      £{displayPrice.toFixed(2)}
                    </span>
                    {discount && (
                      <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <span className="text-xs text-[#5c6c86] sm:text-sm">
                      {product.quantity} In Stock
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span key={idx} className="text-lg text-yellow-400">★</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {product.description && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-[#0c1b33]">Short Description</h3>
                      <p className="text-sm leading-relaxed text-[#5c6c86] line-clamp-3">
                        {product.description}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-[#0c1b33]">Secure Payment</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 items-center justify-center rounded-[8px] border border-gray-200 bg-white px-6 text-sm font-semibold text-[#5c6c86]">
                        Stripe
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-semibold text-[#0c1b33]">Quantity:</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                        <span className="text-base font-semibold text-[#0c1b33] min-w-[2rem] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => {
                          if (!product) return;
                          addToCart({
                            id: product.id,
                            name: product.product_name,
                            price: displayPrice,
                            quantity: quantity,
                            image: currentImage,
                          });
                          toast.success("Item added to cart!");
                        }}
                        className="block rounded-[12px] bg-[#1d70ff] px-6 py-4 text-center text-base font-semibold text-white hover:bg-[#1a5fdd] transition"
                      >
                        Add To Cart
                      </button>
                      <button
                        onClick={() => {
                          if (!product) return;
                          addToCart({
                            id: product.id,
                            name: product.product_name,
                            price: displayPrice,
                            quantity: quantity,
                            image: currentImage,
                          });
                          router.push("/checkout");
                        }}
                        className="rounded-[12px] border-2 border-[#1d70ff] bg-white px-6 py-4 text-base font-semibold text-[#1d70ff] hover:bg-[#1d70ff]/5 transition"
                      >
                        Checkout Now
                      </button>
                      <Link href="#" className="text-sm text-[#1d70ff] hover:underline text-center">
                        Delivery T&C
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="px-4 py-6 sm:px-8 md:py-10 lg:px-12">
              <div className="max-w-4xl mx-auto">
                <div className="border-b border-gray-200">
                  <div className="flex gap-8 justify-center">
                    {["Description", "Specification", "Reviews"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-base font-semibold transition ${activeTab === tab
                          ? "border-b-2 border-[#1d70ff] text-[#1d70ff]"
                          : "text-[#5c6c86] hover:text-[#0c1b33]"
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  {activeTab === "Description" && (
                    <div className="space-y-6 text-sm leading-relaxed text-[#5c6c86]">
                      {product.description ? (
                        <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }} />
                      ) : (
                        <p>No description available for this product.</p>
                      )}

                      {/* Variants Section */}
                      {product.product_type === "variable" && product.variants && product.variants.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-gray-200">
                          <h3 className="text-lg font-bold text-[#0c1b33] mb-4">Product Variants</h3>
                          <div className="space-y-4">
                            {product.variants.map((variant) => {
                              const variantPrice = variant.price ? parseFloat(variant.price) : price;
                              const variantSalePrice = variant.sale_price ? parseFloat(variant.sale_price) : null;
                              const displayVariantPrice = variantSalePrice || variantPrice;
                              const oldVariantPrice = variantSalePrice ? variantPrice : null;

                              return (
                                <div
                                  key={variant.id}
                                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-[#1d70ff] transition"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-[#0c1b33] mb-2">
                                        {variant.name || `Variant #${variant.id}`}
                                      </h4>
                                      <div className="space-y-1 text-sm text-[#5c6c86]">
                                        {variant.sku && (
                                          <div>
                                            <span className="font-medium">SKU:</span> {variant.sku}
                                          </div>
                                        )}
                                        <div className="flex items-center gap-4">
                                          <span>
                                            <span className="font-medium">Stock:</span> {variant.quantity} ({variant.stock_status.replace('_', ' ')})
                                          </span>
                                          {variant.weight && (
                                            <span>
                                              <span className="font-medium">Weight:</span> {variant.weight} kg
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                      <div className="flex items-baseline gap-2">
                                        {oldVariantPrice && (
                                          <span className="text-sm text-[#9aa6bd] line-through">
                                            £{oldVariantPrice.toFixed(2)}
                                          </span>
                                        )}
                                        <span className="text-lg font-bold text-[#0c1b33]">
                                          £{displayVariantPrice.toFixed(2)}
                                        </span>
                                      </div>
                                      {variant.is_active ? (
                                        <span className="text-xs text-green-600 font-medium">Available</span>
                                      ) : (
                                        <span className="text-xs text-red-600 font-medium">Unavailable</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {product.product_type === "variable" && (!product.variants || product.variants.length === 0) && (
                        <div className="mt-8 pt-8 border-t border-gray-200">
                          <h3 className="text-lg font-bold text-[#0c1b33] mb-4">Product Variants</h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-[#5c6c86]">
                              This is a variable product, but no variants are currently available.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "Specification" && (
                    <div className="space-y-4 text-sm leading-relaxed text-[#5c6c86]">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <span className="font-semibold text-[#0c1b33]">SKU:</span>
                          <span className="ml-2">{product.sku || "N/A"}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#0c1b33]">Category:</span>
                          <span className="ml-2">{product.category_name || "N/A"}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#0c1b33]">Weight:</span>
                          <span className="ml-2">{product.weight || "N/A"}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#0c1b33]">Stock:</span>
                          <span className="ml-2">{product.quantity}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "Reviews" && product && (
                    <div className="max-w-3xl mx-auto">
                      <ProductReviews
                        productId={product.id}
                        productName={product.product_name}
                        isAuthenticated={isAuthenticated}
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>


          </main>
        </div>
      </div>
    </div>
  );
}
