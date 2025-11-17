import apiClient from "../../../core/api/axios";

export interface SubscriptionResponse {
  plan: string;
  subscription: {
    id: string;
    plan: string;
    status: string;
    startDate?: string;
    nextBillingDate?: string;
  } | null;
}

export interface CreateSubscriptionResponse {
  success: boolean;
  subscriptionId: string;
  approvalUrl: string;
  subscription: {
    id: string;
    plan: string;
    status: string;
  };
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

export interface RazorpayPlanInfo {
  name?: string;
  description?: string;
}

export interface RazorpayOrderResponse {
  success: boolean;
  razorpay_key: string;
  plan: {
    code: string;
    amount: number;
    currency: string;
    description: string;
  };
  order: RazorpayOrder;
  subscription?: {
    id: string;
    status: string;
  };
}

export interface RazorpayVerifyPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayVerifyResponse {
  success: boolean;
  message: string;
  plan?: string;
  subscription?: {
    id: string;
    status: string;
    next_billing_date?: string;
  };
}

export interface PaymentError {
  error: string;
  message: string;
}

export interface SubscriptionHistoryItem {
  orderId: string;
  user: {
    name: string;
    email: string;
  };
  plan: string;
  amount: {
    value: number;
    currency: string;
  };
  status: string;
  renews: {
    date: string;
    type: string;
    seats: number;
  };
  accountStatus: string;
  actions: string[];
  subscriptionId: string;
  
  createdAt: string;
  startDate: string;
  nextBillingDate: string;
}

export interface SubscriptionsHistoryResponse {
  total: number;
  subscriptions: SubscriptionHistoryItem[];
}

export const paymentService = {
  /**
   * Create a subscription for a plan
   * @param plan - 'free' or 'go'
   */
  async createSubscription(plan: "free" | "go"): Promise<CreateSubscriptionResponse> {
    const response = await apiClient.post("/payment/subscribe", { plan });
    return response.data;
  },

  /**
   * Create Razorpay order for a plan
   */
  async createRazorpayOrder(plan: "go"): Promise<RazorpayOrderResponse> {
    const response = await apiClient.post("/payment/razorpay/order", { plan });
    return response.data;
  },

  /**
   * Verify Razorpay payment signature
   */
  async verifyRazorpayPayment(
    payload: RazorpayVerifyPayload
  ): Promise<RazorpayVerifyResponse> {
    const response = await apiClient.post("/payment/razorpay/verify", payload);
    return response.data;
  },

  /**
   * Get current subscription status
   */
  async getSubscription(): Promise<SubscriptionResponse> {
    const response = await apiClient.get("/payment/subscription");
    return response.data;
  },

  /**
   * Cancel current subscription
   */
  async cancelSubscription(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post("/payment/cancel");
    return response.data;
  },

  /**
   * Get all subscriptions history for the current user
   */
  async getSubscriptionsHistory(): Promise<SubscriptionsHistoryResponse> {
    const response = await apiClient.get("/payment/subscriptions");
    return response.data;
  },
};

