"use client";

import { useState } from "react";
import { TaxClass, TaxRate } from "@/lib/store/api/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  useGetTaxClassesQuery,
  useCreateTaxClassMutation,
  useUpdateTaxClassMutation,
  useDeleteTaxClassMutation,
  useGetTaxRatesQuery,
  useCreateTaxRateMutation,
  useUpdateTaxRateMutation,
  useDeleteTaxRateMutation,
} from "@/lib/store/api/adminApi";
import { toast } from "sonner";

export default function AdminTaxPage() {
  const [activeTab, setActiveTab] = useState("classes");
  
  // Tax Classes
  const { data: taxClassesData, isLoading: taxClassesLoading, refetch: refetchTaxClasses } = useGetTaxClassesQuery({});
  const [createTaxClass] = useCreateTaxClassMutation();
  const [updateTaxClass] = useUpdateTaxClassMutation();
  const [deleteTaxClass] = useDeleteTaxClassMutation();
  const taxClasses = taxClassesData?.tax_classes || [];
  const [showTaxClassModal, setShowTaxClassModal] = useState(false);
  const [editingTaxClass, setEditingTaxClass] = useState<TaxClass | null>(null);
  const [taxClassFormData, setTaxClassFormData] = useState({
    name: "",
    slug: "",
    description: "",
    is_active: true,
  });

  // Tax Rates
  const { data: taxRatesData, isLoading: taxRatesLoading, refetch: refetchTaxRates } = useGetTaxRatesQuery({});
  const [createTaxRate] = useCreateTaxRateMutation();
  const [updateTaxRate] = useUpdateTaxRateMutation();
  const [deleteTaxRate] = useDeleteTaxRateMutation();
  const taxRates = taxRatesData?.tax_rates || [];
  const [showTaxRateModal, setShowTaxRateModal] = useState(false);
  const [editingTaxRate, setEditingTaxRate] = useState<TaxRate | null>(null);
  const [taxRateFormData, setTaxRateFormData] = useState({
    tax_class_id: null as number | null,
    name: "",
    country_code: "GB",
    state_code: "",
    postcode: "",
    city: "",
    rate: "0.2000",
    priority: 1,
    compound: false,
    shipping: true,
    order: 0,
    is_active: true,
  });

  // Tax Class Handlers
  const handleEditTaxClass = (taxClass: TaxClass) => {
    setEditingTaxClass(taxClass);
    setTaxClassFormData({
      name: taxClass.name,
      slug: taxClass.slug,
      description: taxClass.description || "",
      is_active: taxClass.is_active,
    });
    setShowTaxClassModal(true);
  };

  const handleSubmitTaxClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTaxClass) {
        await updateTaxClass({ id: editingTaxClass.id, ...taxClassFormData }).unwrap();
        toast.success("Tax class updated successfully");
      } else {
        await createTaxClass(taxClassFormData).unwrap();
        toast.success("Tax class created successfully");
      }
      setShowTaxClassModal(false);
      setEditingTaxClass(null);
      setTaxClassFormData({ name: "", slug: "", description: "", is_active: true });
      refetchTaxClasses();
    } catch (error: any) {
      console.error("Failed to save tax class:", error);
      toast.error(error?.data?.message || "Failed to save tax class");
    }
  };

  const handleDeleteTaxClass = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tax class?")) return;
    try {
      await deleteTaxClass(id).unwrap();
      toast.success("Tax class deleted successfully");
      refetchTaxClasses();
    } catch (error: any) {
      console.error("Failed to delete tax class:", error);
      toast.error(error?.data?.message || "Failed to delete tax class");
    }
  };

  // Tax Rate Handlers
  const handleEditTaxRate = (taxRate: TaxRate) => {
    setEditingTaxRate(taxRate);
    setTaxRateFormData({
      tax_class_id: taxRate.tax_class_id || null,
      name: taxRate.name,
      country_code: taxRate.country_code,
      state_code: taxRate.state_code || "",
      postcode: taxRate.postcode || "",
      city: taxRate.city || "",
      rate: taxRate.rate,
      priority: taxRate.priority,
      compound: taxRate.compound,
      shipping: taxRate.shipping,
      order: taxRate.order,
      is_active: taxRate.is_active,
    });
    setShowTaxRateModal(true);
  };

  const handleSubmitTaxRate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = {
        ...taxRateFormData,
        tax_class_id: taxRateFormData.tax_class_id || undefined,
        state_code: taxRateFormData.state_code || undefined,
        postcode: taxRateFormData.postcode || undefined,
        city: taxRateFormData.city || undefined,
      };
      
      if (editingTaxRate) {
        await updateTaxRate({ id: editingTaxRate.id, ...formData }).unwrap();
        toast.success("Tax rate updated successfully");
      } else {
        await createTaxRate(formData).unwrap();
        toast.success("Tax rate created successfully");
      }
      setShowTaxRateModal(false);
      setEditingTaxRate(null);
      setTaxRateFormData({
        tax_class_id: null,
        name: "",
        country_code: "GB",
        state_code: "",
        postcode: "",
        city: "",
        rate: "0.2000",
        priority: 1,
        compound: false,
        shipping: true,
        order: 0,
        is_active: true,
      });
      refetchTaxRates();
    } catch (error: any) {
      console.error("Failed to save tax rate:", error);
      toast.error(error?.data?.message || "Failed to save tax rate");
    }
  };

  const handleDeleteTaxRate = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tax rate?")) return;
    try {
      await deleteTaxRate(id).unwrap();
      toast.success("Tax rate deleted successfully");
      refetchTaxRates();
    } catch (error: any) {
      console.error("Failed to delete tax rate:", error);
      toast.error(error?.data?.message || "Failed to delete tax rate");
    }
  };

  const formatRate = (rate: string) => {
    const numRate = parseFloat(rate);
    return `${(numRate * 100).toFixed(2)}%`;
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h2 className="text-2xl lg:text-3xl font-black mb-2">Tax Settings</h2>
        <p className="text-muted-foreground">
          Manage tax classes and tax rates for your store
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="classes">Tax Classes</TabsTrigger>
          <TabsTrigger value="rates">Tax Rates</TabsTrigger>
        </TabsList>

        {/* Tax Classes Tab */}
        <TabsContent value="classes" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Tax Classes</h3>
              <p className="text-sm text-muted-foreground">
                Organize products into tax classes (Standard, Reduced Rate, Zero Rate, etc.)
              </p>
            </div>
            <Dialog open={showTaxClassModal} onOpenChange={setShowTaxClassModal}>
              <DialogTrigger asChild>
                <Button size="lg" onClick={() => {
                  setEditingTaxClass(null);
                  setTaxClassFormData({ name: "", slug: "", description: "", is_active: true });
                }}>
                  + Add Tax Class
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingTaxClass ? "Edit Tax Class" : "Create Tax Class"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTaxClass
                      ? "Update the tax class details below."
                      : "Add a new tax class to organize your products."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitTaxClass} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={taxClassFormData.name}
                      onChange={(e) => setTaxClassFormData({ ...taxClassFormData, name: e.target.value })}
                      required
                      placeholder="Standard Rate"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={taxClassFormData.slug}
                      onChange={(e) => setTaxClassFormData({ ...taxClassFormData, slug: e.target.value })}
                      required
                      placeholder="standard-rate"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={taxClassFormData.description}
                      onChange={(e) => setTaxClassFormData({ ...taxClassFormData, description: e.target.value })}
                      rows={3}
                      placeholder="Standard UK VAT rate (20%)"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={taxClassFormData.is_active}
                      onCheckedChange={(checked) => setTaxClassFormData({ ...taxClassFormData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowTaxClassModal(false);
                        setEditingTaxClass(null);
                        setTaxClassFormData({ name: "", slug: "", description: "", is_active: true });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingTaxClass ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {taxClassesLoading ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Loading tax classes...</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Tax Class List</CardTitle>
                <CardDescription>
                  {taxClasses.length} tax class{taxClasses.length !== 1 ? "es" : ""} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxClasses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No tax classes found
                        </TableCell>
                      </TableRow>
                    ) : (
                      taxClasses.map((taxClass) => (
                        <TableRow key={taxClass.id}>
                          <TableCell className="font-medium">{taxClass.id}</TableCell>
                          <TableCell>{taxClass.name}</TableCell>
                          <TableCell className="text-muted-foreground">{taxClass.slug}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              taxClass.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {taxClass.is_active ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTaxClass(taxClass)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteTaxClass(taxClass.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tax Rates Tab */}
        <TabsContent value="rates" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Tax Rates</h3>
              <p className="text-sm text-muted-foreground">
                Configure tax rates for different locations and tax classes
              </p>
            </div>
            <Dialog open={showTaxRateModal} onOpenChange={setShowTaxRateModal}>
              <DialogTrigger asChild>
                <Button size="lg" onClick={() => {
                  setEditingTaxRate(null);
                  setTaxRateFormData({
                    tax_class_id: null,
                    name: "",
                    country_code: "GB",
                    state_code: "",
                    postcode: "",
                    city: "",
                    rate: "0.2000",
                    priority: 1,
                    compound: false,
                    shipping: true,
                    order: 0,
                    is_active: true,
                  });
                }}>
                  + Add Tax Rate
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingTaxRate ? "Edit Tax Rate" : "Create Tax Rate"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTaxRate
                      ? "Update the tax rate details below."
                      : "Add a new tax rate for a specific location and tax class."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitTaxRate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tax_class_id">Tax Class</Label>
                      <select
                        id="tax_class_id"
                        value={taxRateFormData.tax_class_id || ""}
                        onChange={(e) => setTaxRateFormData({ ...taxRateFormData, tax_class_id: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Standard Rate (No Class)</option>
                        {taxClasses.map((tc) => (
                          <option key={tc.id} value={tc.id}>{tc.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={taxRateFormData.name}
                        onChange={(e) => setTaxRateFormData({ ...taxRateFormData, name: e.target.value })}
                        required
                        placeholder="UK VAT Standard Rate"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country_code">Country Code *</Label>
                      <Input
                        id="country_code"
                        value={taxRateFormData.country_code}
                        onChange={(e) => setTaxRateFormData({ ...taxRateFormData, country_code: e.target.value.toUpperCase() })}
                        required
                        placeholder="GB"
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rate">Rate * (as decimal, e.g., 0.2000 for 20%)</Label>
                      <Input
                        id="rate"
                        type="number"
                        step="0.0001"
                        min="0"
                        max="1"
                        value={taxRateFormData.rate}
                        onChange={(e) => setTaxRateFormData({ ...taxRateFormData, rate: e.target.value })}
                        required
                        placeholder="0.2000"
                      />
                      {taxRateFormData.rate && (
                        <p className="text-xs text-muted-foreground">
                          {formatRate(taxRateFormData.rate)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state_code">State/Province Code</Label>
                      <Input
                        id="state_code"
                        value={taxRateFormData.state_code}
                        onChange={(e) => setTaxRateFormData({ ...taxRateFormData, state_code: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input
                        id="postcode"
                        value={taxRateFormData.postcode}
                        onChange={(e) => setTaxRateFormData({ ...taxRateFormData, postcode: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={taxRateFormData.city}
                        onChange={(e) => setTaxRateFormData({ ...taxRateFormData, city: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Input
                        id="priority"
                        type="number"
                        value={taxRateFormData.priority}
                        onChange={(e) => setTaxRateFormData({ ...taxRateFormData, priority: parseInt(e.target.value) || 1 })}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="order">Display Order</Label>
                      <Input
                        id="order"
                        type="number"
                        value={taxRateFormData.order}
                        onChange={(e) => setTaxRateFormData({ ...taxRateFormData, order: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="compound"
                        checked={taxRateFormData.compound}
                        onCheckedChange={(checked) => setTaxRateFormData({ ...taxRateFormData, compound: checked })}
                      />
                      <Label htmlFor="compound">Compound Tax (tax on tax)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="shipping"
                        checked={taxRateFormData.shipping}
                        onCheckedChange={(checked) => setTaxRateFormData({ ...taxRateFormData, shipping: checked })}
                      />
                      <Label htmlFor="shipping">Apply to Shipping</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={taxRateFormData.is_active}
                        onCheckedChange={(checked) => setTaxRateFormData({ ...taxRateFormData, is_active: checked })}
                      />
                      <Label htmlFor="is_active">Active</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowTaxRateModal(false);
                        setEditingTaxRate(null);
                        setTaxRateFormData({
                          tax_class_id: null,
                          name: "",
                          country_code: "GB",
                          state_code: "",
                          postcode: "",
                          city: "",
                          rate: "0.2000",
                          priority: 1,
                          compound: false,
                          shipping: true,
                          order: 0,
                          is_active: true,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingTaxRate ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {taxRatesLoading ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Loading tax rates...</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Tax Rate List</CardTitle>
                <CardDescription>
                  {taxRates.length} tax rate{taxRates.length !== 1 ? "s" : ""} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Tax Class</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taxRates.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No tax rates found
                          </TableCell>
                        </TableRow>
                      ) : (
                        taxRates.map((taxRate) => {
                          const taxClass = taxClasses.find(tc => tc.id === taxRate.tax_class_id);
                          return (
                            <TableRow key={taxRate.id}>
                              <TableCell className="font-medium">{taxRate.id}</TableCell>
                              <TableCell>{taxRate.name}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {taxClass ? taxClass.name : "Standard"}
                              </TableCell>
                              <TableCell>{taxRate.country_code}</TableCell>
                              <TableCell className="font-semibold">{formatRate(taxRate.rate)}</TableCell>
                              <TableCell>{taxRate.priority}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  taxRate.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                }`}>
                                  {taxRate.is_active ? "Active" : "Inactive"}
                                </span>
                              </TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditTaxRate(taxRate)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteTaxRate(taxRate.id)}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

