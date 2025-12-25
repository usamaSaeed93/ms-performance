"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { useTheme } from "@/lib/contexts/theme-context";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type PeriodPreset = "7d" | "30d" | "90d" | "6m" | "1y" | "custom";

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const [salesData, setSalesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>("30d");
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [bucket, setBucket] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");

  // Update dates when period preset changes
  useEffect(() => {
    if (periodPreset !== "custom") {
      const end = new Date();
      const start = new Date();
      
      switch (periodPreset) {
        case "7d":
          start.setDate(end.getDate() - 7);
          setBucket("daily");
          break;
        case "30d":
          start.setDate(end.getDate() - 30);
          setBucket("daily");
          break;
        case "90d":
          start.setDate(end.getDate() - 90);
          setBucket("weekly");
          break;
        case "6m":
          start.setMonth(end.getMonth() - 6);
          setBucket("monthly");
          break;
        case "1y":
          start.setFullYear(end.getFullYear() - 1);
          setBucket("monthly");
          break;
      }
      
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
    }
  }, [periodPreset]);

  // Fetch data when dates or bucket changes
  useEffect(() => {
    if (startDate && endDate) {
      fetchSalesData();
    }
  }, [startDate, endDate, bucket]);

  const fetchSalesData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApi.getSalesData({
        start_date: startDate,
        end_date: endDate,
        buckets: bucket,
        include_sales_items: true,
      });
      // Handle FastAPI response format: { success, message, data }
      const data = response.data || response;
      setSalesData(data);
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || "Failed to fetch sales data.");
      console.error("Sales data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = salesData?.bucketed_sales || [];
  const totalRevenue = salesData?.total_revenue || 0;
  const totalSales = salesData?.sales?.length || 0;

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h2 className="text-2xl lg:text-3xl font-black mb-2">
          Analytics
        </h2>
        <p className="text-muted-foreground">
          View sales and revenue analytics
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Select time period and view options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Period Preset Selection */}
            <div className="space-y-2">
              <Label>Time Period</Label>
              <Select 
                value={periodPreset} 
                onValueChange={(v) => {
                  setPeriodPreset(v as PeriodPreset);
                  if (v !== "custom") {
                    // Dates will be updated by useEffect
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Date Range (only show when custom is selected) */}
            {periodPreset === "custom" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Bucket Size Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bucket">Group By</Label>
                <Select value={bucket} onValueChange={(v) => setBucket(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {periodPreset === "7d" || periodPreset === "30d" 
                    ? "Recommended: Daily" 
                    : periodPreset === "90d"
                    ? "Recommended: Weekly"
                    : "Recommended: Monthly"}
                </p>
              </div>
              <div className="flex items-end">
                <Button onClick={fetchSalesData} className="w-full">
                  Refresh Data
                </Button>
              </div>
            </div>

            {/* Current Period Display */}
            <div className="text-sm text-muted-foreground">
              Showing data from <strong>{startDate}</strong> to <strong>{endDate}</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading analytics...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
                <CardDescription>Revenue for selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">£{totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Sales</CardTitle>
                <CardDescription>Number of orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">{totalSales}</div>
              </CardContent>
            </Card>
          </div>

          {chartData.length > 0 ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Over Time</CardTitle>
                  <CardDescription>
                    Revenue trends grouped by {bucket} periods ({chartData.length} data points)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="period" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => `£${parseFloat(value).toFixed(2)}`}
                        labelStyle={{ color: '#000' }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#1d70ff"
                        strokeWidth={2}
                        name="Revenue (£)"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sales Volume</CardTitle>
                  <CardDescription>
                    Number of orders grouped by {bucket} periods ({chartData.length} data points)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="period" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => `${value} orders`}
                        labelStyle={{ color: '#000' }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="count" 
                        fill="#1d70ff" 
                        name="Sales Count"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  No sales data available for the selected period.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
