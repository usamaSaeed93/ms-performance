"use client";

import { useEffect, useState } from "react";
import { adminApi, Sale } from "@/lib/api/admin";
import Link from "next/link";
import { useTheme } from "@/lib/contexts/theme-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalSales: number;
  totalRevenue: number;
  lowStockProducts: number;
  recentOrders: any[];
}

export default function DashboardPage() {
  const { theme } = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalSales: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [products, users, lowStock, salesData, orders] = await Promise.all([
        adminApi.getProducts({ page: 1, per_page: 100 }),
        adminApi.getUsers({ page: 1, per_page: 100 }),
        adminApi.getLowStockProducts(10),
        adminApi.getSalesData({
          start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          end_date: new Date().toISOString().split("T")[0],
        }).catch(() => ({ total_revenue: 0, sales: [] })),
        adminApi.getOrders({ page: 1, per_page: 5 }).catch(() => ({ orders: [] })),
      ]);

      setStats({
        totalProducts: products.products?.length || 0,
        totalUsers: users.users?.length || 0,
        totalSales: salesData.sales?.length || 0,
        totalRevenue: salesData.total_revenue || 0,
        lowStockProducts: lowStock.products?.length || 0,
        recentOrders: orders.orders?.slice(0, 5) || [],
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      color: "from-[#12a7ff] to-[#0f8fd6]",
      link: "/admin/products",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "from-[#12a7ff] to-[#0f8fd6]",
      link: "/admin/users",
    },
    {
      title: "Total Revenue (30d)",
      value: `£${stats.totalRevenue.toFixed(2)}`,
      icon: "💰",
      color: "from-green-500 to-emerald-600",
      link: "/admin/analytics",
    },
    {
      title: "Low Stock Alerts",
      value: stats.lowStockProducts,
      icon: "⚠️",
      color: "from-orange-500 to-red-500",
      link: "/admin/products",
    },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
      <div>
        <h2 className="text-2xl lg:text-3xl font-black mb-2">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground">
          Welcome to the admin dashboard
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Link key={stat.title} href={stat.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-black">{stat.value}</div>
                      <div className="text-4xl opacity-80">{stat.icon}</div>
                    </div>
                    <div className={`mt-4 h-1 bg-gradient-to-r ${stat.color} rounded-full`} />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div>
                          <p className="text-sm font-semibold">
                            {order.order_number || `Order #${order.id}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            £{order.total_amount} • {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.order_status === "delivered"
                              ? "bg-green-500/20 text-green-400"
                              : order.order_status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent orders</p>
                  )}
                </div>
                <Link href="/admin/orders" className="mt-4 block">
                  <Button variant="link" className="w-full">
                    View All Orders →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/admin/products/new">
                    <Card className="hover:bg-accent transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <p className="text-sm font-semibold">➕ Add New Product</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Create a new product in your catalog
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/admin/categories">
                    <Card className="hover:bg-accent transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <p className="text-sm font-semibold">🏷️ Manage Categories</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Organize your product categories
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/admin/analytics">
                    <Card className="hover:bg-accent transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <p className="text-sm font-semibold">📈 View Analytics</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Check sales and revenue reports
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
