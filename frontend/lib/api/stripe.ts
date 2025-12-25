const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface CreatePaymentIntentRequest {
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  shipping_cost: number;
  country_code?: string;
  state_code?: string;
  postcode?: string;
  city?: string;
  shipping_address?: string;
}

export interface CreatePaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
}

export async function createPaymentIntent(
  data: CreatePaymentIntentRequest,
  token: string
): Promise<CreatePaymentIntentResponse> {
  const response = await fetch(`${API_URL}/ecommerce/v1/stripe/create_payment_intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to create payment intent' }));
    const errorMessage = errorData.message || errorData.detail || 'Failed to create payment intent';
    console.error('Payment intent creation failed:', {
      status: response.status,
      error: errorData,
    });
    throw new Error(errorMessage);
  }

  const result = await response.json();
  // Handle FastAPI response format: { success, message, data }
  if (result.data !== undefined) {
    return result.data;
  }
  return result;
}

