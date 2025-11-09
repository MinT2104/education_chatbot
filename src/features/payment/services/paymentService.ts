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
};

