"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { isCustomerAuthenticated, getCustomerToken } from "@/lib/utils/auth";
import { toast } from "sonner";
import Image from "next/image";

interface Order {
  id: number;
  user_id: number;
  total_amount: string;
  order_number: string | null;
  order_status: string;
  payment_status: string;
  payment_method: string | null;
  shipping_address: string | null;
  shipping_cost: string | null;
  tax: string | null;
  subtotal?: string;
  shipping_tax?: string;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  price_per_unit: string;
  tax_rate: string | null;
  tax_amount: string;
  line_total: string;
  product_name: string | null;
}

interface OrderDetail extends Order {
  items: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isCustomerAuthenticated()) {
      router.push("/login?redirect=/orders");
      return;
    }

    fetchOrders();
  }, [page, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = getCustomerToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(
        `${API_URL}/ecommerce/v1/get_orders?page=${page}&per_page=10&order_by=created_at&order=desc`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          // Token expired or invalid
          router.push("/login?redirect=/orders");
          return;
        }
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      const responseData = data.data || data;
      const ordersData = responseData.orders || [];
      
      setOrders(ordersData);
      setTotal(responseData.total || 0);
      setTotalPages(responseData.total_pages || 1);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-green-100 text-green-800",
      paid: "bg-green-100 text-green-800",
      unpaid: "bg-yellow-100 text-yellow-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: string | null | undefined) => {
    if (!amount) return "£0.00";
    const num = parseFloat(amount);
    return `£${num.toFixed(2)}`;
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      setLoadingDetails(true);
      const token = getCustomerToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(
        `${API_URL}/ecommerce/v1/get_order?order_id=${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      const orderData = data.data?.order || data.order;
      setSelectedOrder(orderData);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      toast.error("Failed to load order details. Please try again.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewDetails = (orderId: number) => {
    fetchOrderDetails(orderId);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-8">
        <div className="bg-white overflow-hidden">
          <Navbar ctaText="Become A Dealer" />

          <main className="space-y-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#030814] text-white h-[360px]">
              <Image
                src="/images/hero/slider1.jpg"
                alt="My Orders"
                width={1600}
                height={200}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative h-full flex items-center px-4 sm:px-6 md:px-8 lg:px-12">
                <h1 className="text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl animate-heading">
                  My Orders
                </h1>
              </div>
            </section>

            {/* Orders Content */}
            <section className="px-4 py-6 sm:px-8 md:py-10 lg:px-12">
              <div className="max-w-6xl mx-auto">
                {loading && orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d70ff]"></div>
                    <p className="mt-4 text-gray-600">Loading your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
                    <p className="text-gray-600 mb-6">
                      You haven't placed any orders yet. Start shopping to see your orders here!
                    </p>
                    <button
                      onClick={() => router.push("/products")}
                      className="rounded-[12px] bg-[#1d70ff] px-6 py-3 text-white font-semibold hover:bg-[#1a5fdd] transition"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white border border-gray-200 rounded-[12px] p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold">
                                {order.order_number || `Order #${order.id}`}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  order.order_status
                                )}`}
                              >
                                {order.order_status.charAt(0).toUpperCase() +
                                  order.order_status.slice(1)}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  order.payment_status
                                )}`}
                              >
                                {order.payment_status.charAt(0).toUpperCase() +
                                  order.payment_status.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Placed on {formatDate(order.created_at)}
                            </p>
                            {order.payment_method && (
                              <p className="text-sm text-gray-600 mt-1">
                                Payment Method: {order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#1d70ff]">
                              {formatCurrency(order.total_amount)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Total Amount</p>
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="border-t pt-4 mt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-semibold text-gray-700 mb-1">Order Summary</p>
                              <div className="space-y-1 text-gray-600">
                                {order.subtotal && (
                                  <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>{formatCurrency(order.subtotal)}</span>
                                  </div>
                                )}
                                {order.tax && (
                                  <div className="flex justify-between">
                                    <span>Tax:</span>
                                    <span>{formatCurrency(order.tax)}</span>
                                  </div>
                                )}
                                {order.shipping_cost && (
                                  <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span>{formatCurrency(order.shipping_cost)}</span>
                                  </div>
                                )}
                                {order.shipping_tax && parseFloat(order.shipping_tax) > 0 && (
                                  <div className="flex justify-between">
                                    <span>Shipping Tax:</span>
                                    <span>{formatCurrency(order.shipping_tax)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between font-bold pt-2 border-t">
                                  <span>Total:</span>
                                  <span>{formatCurrency(order.total_amount)}</span>
                                </div>
                              </div>
                            </div>
                            {order.shipping_address && (
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">Shipping Address</p>
                                <p className="text-gray-600 whitespace-pre-line">
                                  {order.shipping_address}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-4 pt-4 border-t">
                          <button
                            onClick={() => handleViewDetails(order.id)}
                            className="rounded-[12px] border-2 border-[#1d70ff] px-4 py-2 text-[#1d70ff] font-semibold hover:bg-[#1d70ff]/5 transition text-sm"
                          >
                            View Details
                          </button>
                          {order.order_status === "delivered" && (
                            <button
                              onClick={() => {
                                toast.info("Review feature coming soon!");
                              }}
                              className="rounded-[12px] bg-[#1d70ff] px-4 py-2 text-white font-semibold hover:bg-[#1a5fdd] transition text-sm"
                            >
                              Leave Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-6">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1 || loading}
                          className="rounded-[12px] border-2 border-gray-300 px-4 py-2 text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="px-4 py-2 text-gray-700">
                          Page {page} of {totalPages} ({total} total)
                        </span>
                        <button
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages || loading}
                          className="rounded-[12px] border-2 border-gray-300 px-4 py-2 text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-[20px] max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {selectedOrder.order_number || `Order #${selectedOrder.id}`}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {loadingDetails ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d70ff]"></div>
                  <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
              ) : (
                <>
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${getStatusColor(selectedOrder.order_status)}`}>
                        {selectedOrder.order_status.charAt(0).toUpperCase() + selectedOrder.order_status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${getStatusColor(selectedOrder.payment_status)}`}>
                        {selectedOrder.payment_status.charAt(0).toUpperCase() + selectedOrder.payment_status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold">{formatDate(selectedOrder.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-semibold">{selectedOrder.payment_method ? selectedOrder.payment_method.charAt(0).toUpperCase() + selectedOrder.payment_method.slice(1) : 'N/A'}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  {selectedOrder.items && selectedOrder.items.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-4">Order Items</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Quantity</th>
                              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Price</th>
                              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Tax</th>
                              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {selectedOrder.items.map((item) => (
                              <tr key={item.id}>
                                <td className="px-4 py-3">
                                  <p className="font-semibold">{item.product_name || `Product #${item.product_id}`}</p>
                                </td>
                                <td className="px-4 py-3 text-center">{item.quantity}</td>
                                <td className="px-4 py-3 text-right">{formatCurrency(item.price_per_unit)}</td>
                                <td className="px-4 py-3 text-right">{formatCurrency(item.tax_amount)}</td>
                                <td className="px-4 py-3 text-right font-semibold">{formatCurrency(item.line_total)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="border-t pt-4">
                    <div className="max-w-md ml-auto space-y-2">
                      {selectedOrder.subtotal && (
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(selectedOrder.subtotal)}</span>
                        </div>
                      )}
                      {selectedOrder.tax && (
                        <div className="flex justify-between text-sm">
                          <span>Tax:</span>
                          <span>{formatCurrency(selectedOrder.tax)}</span>
                        </div>
                      )}
                      {selectedOrder.shipping_cost && (
                        <div className="flex justify-between text-sm">
                          <span>Shipping:</span>
                          <span>{formatCurrency(selectedOrder.shipping_cost)}</span>
                        </div>
                      )}
                      {selectedOrder.shipping_tax && parseFloat(selectedOrder.shipping_tax) > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Shipping Tax:</span>
                          <span>{formatCurrency(selectedOrder.shipping_tax)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>{formatCurrency(selectedOrder.total_amount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {selectedOrder.shipping_address && (
                    <div>
                      <h3 className="text-lg font-bold mb-2">Shipping Address</h3>
                      <p className="text-gray-600 whitespace-pre-line">{selectedOrder.shipping_address}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

