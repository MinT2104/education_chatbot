import apiClient from "../../../core/api/axios";
import { Plan, CreatePlanInput, UpdatePlanInput } from "../types/plan";
import { mockPlans, USE_MOCK_PLANS } from "../data/mockPlans";

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

  // ========== Plan Management (Admin) ==========

  /**
   * Get all plans
   */
  async getAllPlans(): Promise<Plan[]> {
    // Use mock data if enabled (for development/testing)
    if (USE_MOCK_PLANS) {
      console.log("Using mock plans data");
      return Promise.resolve(mockPlans.map((p) => ({ ...p, isMock: true })));
    }

    try {
      const response = await apiClient.get("/payment/plans");
      const responseData = response.data;
      
      // Handle different response formats
      if (Array.isArray(responseData)) {
        // Direct array response: Plan[]
        return responseData;
      } else if (responseData && typeof responseData === 'object') {
        // Handle { success: true, plans: { free: [...], premium: [...] } }
        if (responseData.plans && typeof responseData.plans === 'object' && !Array.isArray(responseData.plans)) {
          // Transform object structure to Plan[]
          const plansObj = responseData.plans;
          const planArray: Plan[] = [];
          
          // Convert each plan type to Plan object
          Object.keys(plansObj).forEach((planCode, index) => {
            const features = plansObj[planCode];
            
            // Create Plan object from features
            if (Array.isArray(features)) {
              const plan: Plan = {
                id: `plan-${planCode}-${Date.now()}`,
                code: planCode,
                name: planCode.charAt(0).toUpperCase() + planCode.slice(1),
                description: `${planCode} plan features`,
                priceGovernment: planCode === 'free' ? 0 : 299,
                pricePrivate: planCode === 'free' ? 0 : 399,
                currency: 'INR',
                billingPeriod: 'month',
                isActive: true,
                displayOrder: index,
                features: features.map((f: any, idx: number) => ({
                  id: `${planCode}-f${idx}`,
                  text: typeof f === 'string' ? f : f.text || f.name || '',
                  enabled: typeof f === 'object' ? f.enabled !== false : true,
                })),
              };
              
              // Add badge for specific plans
              if (planCode === 'go' || planCode === 'premium') {
                plan.badge = 'NEW';
              }
              
              planArray.push(plan);
            }
          });
          
          return planArray;
        }
        
        // Try other common response formats
        if (Array.isArray(responseData.plans)) {
          return responseData.plans;
        }
        if (Array.isArray(responseData.data)) {
          return responseData.data;
        }
      }
      return [];
    } catch (error: any) {
      // If endpoint doesn't exist yet, fallback to mock data
      if (error?.response?.status === 404) {
        console.warn("Plans endpoint not implemented yet, using mock data");
        return mockPlans.map((p) => ({ ...p, isMock: true }));
      }
      throw error;
    }
  },

  /**
   * Get plan by ID
   */
  async getPlanById(planId: string): Promise<Plan> {
    const response = await apiClient.get(`/payment/plans/${planId}`);
    return response.data;
  },

  /**
   * Create new plan (admin only)
   */
  async createPlan(data: CreatePlanInput): Promise<Plan> {
    const response = await apiClient.post("/payment/plans", data);
    return response.data;
  },

  /**
   * Update plan (admin only)
   */
  async updatePlan(data: UpdatePlanInput): Promise<Plan> {
    const { id, ...updateData } = data;
    const response = await apiClient.put(`/payment/plans/${id}`, updateData);
    return response.data;
  },

  /**
   * Delete plan (admin only)
   */
  async deletePlan(planId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/payment/plans/${planId}`);
    return response.data;
  },
};
