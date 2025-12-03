"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  PackageOpen,
  PoundSterling,
  ShoppingBag,
  Users,
} from "lucide-react";

import {
  useGetProductsQuery,
  useGetUsersQuery,
  useGetLowStockProductsQuery,
  useGetSalesDataQuery,
  useGetOrdersQuery,
  type Product,
  type Sale,
} from "@/lib/store/api/adminApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DashboardOrder {
  id: number;
  order_number?: string | null;
  total_amount: number | string;
  order_status?: string;
  payment_status?: string;
  created_at: string;
}

export default function DashboardPage() {
  // Calculate date range for sales data (last 30 days)
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Fetch all data using RTK Query
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductsQuery({ page: 1, per_page: 100 });

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useGetUsersQuery({ page: 1, per_page: 100 });

  const {
    data: lowStockData,
    isLoading: lowStockLoading,
    error: lowStockError,
  } = useGetLowStockProductsQuery(10);

  const {
    data: salesData,
    isLoading: salesLoading,
    error: salesError,
  } = useGetSalesDataQuery({
    start_date: startDate,
    end_date: endDate,
  });

  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
  } = useGetOrdersQuery({ page: 1, per_page: 5 });

  // Compute loading state
  const loading =
    productsLoading ||
    usersLoading ||
    lowStockLoading ||
    salesLoading ||
    ordersLoading;

  // Compute stats from fetched data
  const stats = useMemo(() => {
    const products = productsData?.products || [];
    const users = usersData?.users || [];
    const lowStockProducts = lowStockData?.products || [];
    const sales = salesData?.sales || [];
    const orders = ordersData?.orders || [];

    return {
      totalProducts: products.length,
      totalUsers: users.length,
      totalSales: sales.length,
      totalRevenue: salesData?.total_revenue || 0,
      lowStockProducts: lowStockProducts.length,
      recentOrders: orders.slice(0, 5),
      lowStockList: lowStockProducts,
      sales: sales,
    };
  }, [productsData, usersData, lowStockData, salesData, ordersData]);

  const salesTrend = useMemo(() => {
    const grouped = new Map<
      string,
      { revenue: number; orders: number; label: string }
    >();

    stats.sales.forEach((sale) => {
      const date = new Date(sale.created_at);
      const key = date.toISOString().split("T")[0];
      const label = date.toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
      });
      const revenue = Number.parseFloat(sale.total_amount || "0");
      const existing = grouped.get(key) || { revenue: 0, orders: 0, label };
      grouped.set(key, {
        revenue: existing.revenue + (Number.isFinite(revenue) ? revenue : 0),
        orders: existing.orders + 1,
        label,
      });
    });

    return Array.from(grouped.entries())
      .sort(
        ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
      )
      .map(([, value]) => ({
        date: value.label,
        revenue: Number(value.revenue.toFixed(2)),
        orders: value.orders,
      }));
  }, [stats.sales]);

  const averageOrderValue =
    stats.totalSales > 0 ? stats.totalRevenue / stats.totalSales : 0;
  const fulfillmentRate = stats.recentOrders.length
    ? Math.round(
        (stats.recentOrders.filter(
          (order) => order.order_status === "delivered"
        ).length /
          stats.recentOrders.length) *
          100
      )
    : 0;
  const lowStockPercentage =
    stats.totalProducts > 0
      ? Math.min(100, (stats.lowStockProducts / stats.totalProducts) * 100)
      : 0;

  const formatCurrency = (value: number) =>
    `£${value.toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const statusClasses: Record<string, string> = {
    delivered: "bg-green-500/15 text-green-700",
    pending: "bg-amber-500/15 text-amber-700",
    processing: "bg-blue-500/15 text-blue-700",
    shipped: "bg-purple-500/15 text-purple-700",
    cancelled: "bg-red-500/15 text-red-700",
  };

  const paymentClasses: Record<string, string> = {
    paid: "bg-green-500/15 text-green-700",
    refunded: "bg-orange-500/15 text-orange-700",
    failed: "bg-red-500/15 text-red-700",
    pending: "bg-slate-500/15 text-slate-700",
  };

  const statCards = [
    {
      title: "Revenue (30d)",
      value: formatCurrency(stats.totalRevenue),
      icon: PoundSterling,
      accent: "from-indigo-500/15 to-indigo-500/5",
      hint: "Rolling last 30 days",
      link: "/admin/analytics",
    },
    {
      title: "Orders",
      value: stats.totalSales,
      icon: ShoppingBag,
      accent: "from-emerald-500/15 to-emerald-500/5",
      hint: "Completed sales",
      link: "/admin/orders",
    },
    {
      title: "Products live",
      value: stats.totalProducts,
      icon: PackageOpen,
      accent: "from-sky-500/15 to-sky-500/5",
      hint: "Active catalog",
      link: "/admin/products",
    },
    {
      title: "Customers",
      value: stats.totalUsers,
      icon: Users,
      accent: "from-amber-500/15 to-amber-500/5",
      hint: "Registered users",
      link: "/admin/users",
    },
  ];

  const chartPrimary = "#4338ca";
  const chartSecondary = "#16a34a";

  // Handle errors
  if (
    productsError ||
    usersError ||
    lowStockError ||
    salesError ||
    ordersError
  ) {
    console.error("Dashboard data fetch errors:", {
      productsError,
      usersError,
      lowStockError,
      salesError,
      ordersError,
    });
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] space-y-8 bg-slate-50/60 p-4 lg:p-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Inventory, and customer activity at a glance.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              View analytics
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/products/new">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              New product
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.title} href={stat.link}>
                  <Card className="group h-full cursor-pointer border-border/70 bg-white/90 shadow-sm transition-shadow hover:shadow-lg">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </CardTitle>
                        <div className="text-2xl font-black tracking-tight">
                          {stat.value}
                        </div>
                      </div>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${stat.accent}`}>
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{stat.hint}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-foreground/80">
                        <ArrowUpRight className="h-3 w-3" />
                        Open
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="border-border/70 bg-white/90 shadow-sm xl:col-span-2">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Orders performance</CardTitle>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 font-medium text-indigo-700">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    Revenue
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 font-medium text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Orders
                  </span>
                </div>
              </CardHeader>
              <CardContent className="h-[320px] pt-0">
                {salesTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesTrend} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revenueArea" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor={chartPrimary} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={chartPrimary} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="ordersArea" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor={chartSecondary} stopOpacity={0.35} />
                          <stop offset="95%" stopColor={chartSecondary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <RechartsTooltip
                        contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))" }}
                        formatter={(value: number, name) =>
                          name === "revenue" ? formatCurrency(value) : value
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke={chartPrimary}
                        strokeWidth={2}
                        fill="url(#revenueArea)"
                      />
                      <Area
                        type="monotone"
                        dataKey="orders"
                        name="Orders"
                        stroke={chartSecondary}
                        strokeWidth={2}
                        fill="url(#ordersArea)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No sales data in the selected period.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Operations pulse</CardTitle>
                <CardDescription>Snapshot of current health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Average order value</p>
                    <p className="text-xs text-muted-foreground">Across the last 30 days</p>
                  </div>
                  <span className="text-lg font-bold">{formatCurrency(averageOrderValue)}</span>
                </div>
                <div className="space-y-2 rounded-lg border bg-muted/50 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Fulfilment rate</p>
                      <p className="text-xs text-muted-foreground">
                        Delivered vs. recent orders
                      </p>
                    </div>
                    <span className="text-lg font-bold">{fulfillmentRate}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${fulfillmentRate}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2 rounded-lg border bg-muted/50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <div>
                        <p className="text-sm font-semibold">Inventory risk</p>
                        <p className="text-xs text-muted-foreground">
                          {stats.lowStockProducts} low stock items
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-amber-700">
                      {Math.round(lowStockPercentage)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-amber-500"
                      style={{ width: `${lowStockPercentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="border-border/70 bg-white/90 shadow-sm xl:col-span-2">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Recent orders</CardTitle>
                  <CardDescription>Latest customer activity</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin/orders">
                    View all
                    <ArrowUpRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.recentOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                            No recent orders
                          </TableCell>
                        </TableRow>
                      ) : (
                        stats.recentOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              {order.order_number || `Order #${order.id}`}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${statusClasses[order.order_status || ""] || "bg-slate-500/15 text-slate-700"}`}
                              >
                                {order.order_status || "pending"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${paymentClasses[order.payment_status || ""] || "bg-slate-500/15 text-slate-700"}`}
                              >
                                {order.payment_status || "pending"}
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(Number(order.total_amount || 0))}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-white/90 shadow-sm">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Low stock alerts</CardTitle>
                  <CardDescription>Products nearing threshold</CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/products">
                    Manage inventory
                    <ArrowUpRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.lowStockList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No products are low on stock.</p>
                ) : (
                  stats.lowStockList.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{product.product_name}</p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {product.sku || "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            product.quantity <= (product.stock_threshold || 5)
                              ? "bg-red-500/15 text-red-700"
                              : "bg-amber-500/15 text-amber-700"
                          }`}
                        >
                          {product.quantity} left
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/70 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Stay on top of the back-office flow</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              <ActionTile
                title="Create discount"
                description="Launch a limited-time offer"
                href="/admin/discounts"
              />
              <ActionTile
                title="Organize categories"
                description="Keep the catalog tidy"
                href="/admin/categories"
              />
              <ActionTile
                title="Invite a teammate"
                description="Manage admin users and roles"
                href="/admin/users"
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-full">
            <CardContent className="space-y-4 p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="h-[320px]">
        <CardHeader>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-4 w-24" />
        </CardContent>
      </Card>
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardContent className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ActionTile({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="group block rounded-lg border bg-muted/40 p-4 transition-colors hover:bg-muted">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
    </Link>
  );
}
