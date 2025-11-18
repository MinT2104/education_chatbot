export interface PlanFeature {
  id: string;
  text: string;
  enabled: boolean;
}

export interface Plan {
  id: string;
  code: string; // 'free' | 'go' | custom
  name: string;
  description: string;
  priceGovernment: number; // INR
  pricePrivate: number; // INR
  currency: string; // 'INR'
  billingPeriod: string; // 'month' | 'year'
  features: PlanFeature[];
  badge?: string; // e.g., 'NEW', 'POPULAR'
  isActive: boolean;
  displayOrder: number;
  limitGovernment?: number; // messages/day for free plans
  limitPrivate?: number; // messages/day for free plans
  createdAt?: string;
  updatedAt?: string;
  isMock?: boolean; // Flag when plan data is mocked (no backend)
}

export interface CreatePlanInput {
  code: string;
  name: string;
  description: string;
  priceGovernment: number;
  pricePrivate: number;
  currency?: string;
  billingPeriod?: string;
  features: Omit<PlanFeature, 'id'>[];
  badge?: string;
  isActive?: boolean;
  displayOrder?: number;
  limitGovernment?: number;
  limitPrivate?: number;
}

export interface UpdatePlanInput extends Partial<CreatePlanInput> {
  id: string;
}
