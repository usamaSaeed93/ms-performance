"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; // Define base URL locally

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export default function ContactMessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/ecommerce/v1/contact-messages`);
            if (response.ok) {
                const data = await response.json();
                // API returns { status_code, success, message, data: [...messages] }
                setMessages(data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };

    const truncateMessage = (text: string, maxLength: number = 50) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">Contact Messages</h1>
            {loading ? (
                <p>Loading messages...</p>
            ) : (
                <div className="rounded-md border">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Phone</th>
                                <th className="p-4 font-medium">Message</th>
                                <th className="p-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center">No messages found.</td>
                                </tr>
                            ) : (
                                messages.map((msg) => (
                                    <tr key={msg.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">{new Date(msg.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 font-medium">{msg.name}</td>
                                        <td className="p-4">{msg.email}</td>
                                        <td className="p-4">{msg.phone || "-"}</td>
                                        <td className="p-4 max-w-xs">
                                            <span className="block truncate" title={msg.message}>
                                                {truncateMessage(msg.message)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => setSelectedMessage(msg)}
                                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedMessage(null)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold">{selectedMessage.name}</h2>
                                    <p className="text-gray-600">{selectedMessage.email}</p>
                                    {selectedMessage.phone && (
                                        <p className="text-gray-600">Phone: {selectedMessage.phone}</p>
                                    )}
                                    {selectedMessage.address && (
                                        <p className="text-gray-600">Address: {selectedMessage.address}</p>
                                    )}
                                    <p className="text-gray-400 text-sm mt-1">
                                        {new Date(selectedMessage.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[50vh]">
                            <h3 className="font-medium text-gray-700 mb-2">Message:</h3>
                            <p className="whitespace-pre-wrap text-gray-800">{selectedMessage.message}</p>
                        </div>
                        <div className="p-4 border-t bg-gray-50">
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
