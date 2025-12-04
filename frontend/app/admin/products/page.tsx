"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/lib/store/api/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");


  // RTK Query hooks
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery({ page, per_page: perPage, order_by: orderBy, order });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = productsData?.products || [];


  const handleDelete = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await deleteProduct(productId).unwrap();
      toast.success("Product deleted successfully");
      // Cache will automatically invalidate and refetch
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.product_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black mb-2">
            Products
          </h2>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button size="lg">
            + Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>Filter and sort your products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-10"
              />
            </div>
            <Select value={orderBy} onValueChange={setOrderBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Sort by ID</SelectItem>
                <SelectItem value="product_name">Sort by Name</SelectItem>
                <SelectItem value="price">Sort by Price</SelectItem>
                <SelectItem value="quantity">Sort by Quantity</SelectItem>
                <SelectItem value="created_at">Sort by Date</SelectItem>
              </SelectContent>
            </Select>
            <Select value={order} onValueChange={(v) => setOrder(v as "asc" | "desc")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading products...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-2">
              <p className="text-destructive font-semibold">
                Error loading products
              </p>
              <p className="text-sm text-muted-foreground">
                {(error as any)?.data?.message || (error as any)?.message || 'An unknown error occurred'}
              </p>
              <Button variant="link" onClick={() => refetch()}>Try again</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
            <CardDescription>
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.id}</TableCell>
                      <TableCell>{product.product_name}</TableCell>
                      <TableCell>£{product.price}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.is_active
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isDeleting}
                            >
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
