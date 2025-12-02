"use client";

import { useState } from "react";
import { ProductVariant } from "@/lib/api/admin";
import ImageUpload from "./ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

interface ProductVariantsProps {
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
}

export default function ProductVariants({ variants, onVariantsChange }: ProductVariantsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ProductVariant>>({
    sku: "",
    name: "",
    price: "",
    sale_price: "",
    quantity: 0,
    stock_status: "in_stock",
    manage_stock: true,
    stock_threshold: null,
    weight: "",
    length: "",
    width: "",
    height: "",
    image_url: "",
    is_active: true,
  });

  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now(),
      product_id: 0,
      sku: formData.sku || null,
      name: formData.name || null,
      price: formData.price || null,
      sale_price: formData.sale_price || null,
      quantity: formData.quantity || 0,
      stock_status: formData.stock_status || "in_stock",
      manage_stock: formData.manage_stock ?? true,
      stock_threshold: formData.stock_threshold || null,
      weight: formData.weight || null,
      length: formData.length || null,
      width: formData.width || null,
      height: formData.height || null,
      image_url: formData.image_url || null,
      is_active: formData.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onVariantsChange([...variants, newVariant]);
    resetForm();
  };

  const handleUpdateVariant = () => {
    if (editingIndex === null) return;
    const newVariants = [...variants];
    newVariants[editingIndex] = {
      ...newVariants[editingIndex],
      ...formData,
    };
    onVariantsChange(newVariants);
    resetForm();
  };

  const handleDeleteVariant = (index: number) => {
    if (confirm("Are you sure you want to delete this variant?")) {
      const newVariants = variants.filter((_, i) => i !== index);
      onVariantsChange(newVariants);
    }
  };

  const handleEditVariant = (index: number) => {
    setEditingIndex(index);
    setFormData(variants[index]);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      sku: "",
      name: "",
      price: "",
      sale_price: "",
      quantity: 0,
      stock_status: "in_stock",
      manage_stock: true,
      stock_threshold: null,
      weight: "",
      length: "",
      width: "",
      height: "",
      image_url: "",
      is_active: true,
    });
    setShowAddForm(false);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Product Variants</h3>
          <p className="text-sm text-muted-foreground">
            {variants.length} variant{variants.length !== 1 ? "s" : ""} configured
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          variant={showAddForm ? "outline" : "default"}
        >
          {showAddForm ? "Cancel" : "+ Add Variant"}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingIndex !== null ? "Edit Variant" : "Add New Variant"}</CardTitle>
            <CardDescription>
              Configure variant-specific pricing, stock, and dimensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="variant-name">Variant Name</Label>
                <Input
                  id="variant-name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Small - Red"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant-sku">SKU</Label>
                <Input
                  id="variant-sku"
                  value={formData.sku || ""}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant-price">Price</Label>
                <Input
                  id="variant-price"
                  type="number"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant-sale-price">Sale Price</Label>
                <Input
                  id="variant-sale-price"
                  type="number"
                  step="0.01"
                  value={formData.sale_price || ""}
                  onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant-quantity">Quantity</Label>
                <Input
                  id="variant-quantity"
                  type="number"
                  value={formData.quantity || 0}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant-stock-status">Stock Status</Label>
                <Select
                  value={formData.stock_status || "in_stock"}
                  onValueChange={(value) => setFormData({ ...formData, stock_status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="on_backorder">On Backorder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="variant-image">Variant Image</Label>
                <ImageUpload
                  folder="products/variants"
                  onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                  onUploadError={(error) => alert(error)}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                type="button"
                onClick={editingIndex !== null ? handleUpdateVariant : handleAddVariant}
              >
                {editingIndex !== null ? "Update" : "Add"} Variant
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {variants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Variants List</CardTitle>
            <CardDescription>
              Manage your product variants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{variant.name || "Unnamed"}</TableCell>
                    <TableCell className="text-muted-foreground">{variant.sku || "-"}</TableCell>
                    <TableCell>
                      {variant.sale_price ? (
                        <>
                          <span className="line-through text-muted-foreground">£{variant.price}</span>
                          <span className="ml-2 text-destructive">£{variant.sale_price}</span>
                        </>
                      ) : (
                        `£${variant.price || "0"}`
                      )}
                    </TableCell>
                    <TableCell>{variant.quantity}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditVariant(index)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteVariant(index)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
