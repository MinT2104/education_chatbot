import { Plan } from "../types/plan";

/**
 * Mock plans data for development and testing
 * Use this when backend endpoint is not ready yet
 */
export const mockPlans: Plan[] = [
  {
    id: "plan-free-001",
    code: "free",
    name: "Free",
    description: "Intelligence for everyday tasks",
    priceGovernment: 0,
    pricePrivate: 0,
    currency: "INR",
    billingPeriod: "month",
    isActive: true,
    displayOrder: 0,
    limitGovernment: 50,
    limitPrivate: 25,
    features: [
      {
        id: "f1",
        text: "Access to GPT-5",
        enabled: true,
      },
      {
        id: "f2",
        text: "Limited file uploads",
        enabled: true,
      },
      {
        id: "f3",
        text: "Limited and slower image generation",
        enabled: true,
      },
      {
        id: "f4",
        text: "Limited memory and context",
        enabled: true,
      },
      {
        id: "f5",
        text: "Limited deep research",
        enabled: true,
      },
    ],
  },
  {
    id: "plan-go-001",
    code: "go",
    name: "Go",
    description: "More access to popular features",
    priceGovernment: 299,
    pricePrivate: 399,
    currency: "INR",
    billingPeriod: "month",
    badge: "NEW",
    isActive: true,
    displayOrder: 1,
    features: [
      {
        id: "g1",
        text: "Expanded Access to GPT-5",
        enabled: true,
      },
      {
        id: "g2",
        text: "Expanded messaging and uploads",
        enabled: true,
      },
      {
        id: "g3",
        text: "Expanded and faster image creation",
        enabled: true,
      },
      {
        id: "g4",
        text: "Longer memory and context",
        enabled: true,
      },
      {
        id: "g5",
        text: "Limited deep research",
        enabled: true,
      },
      {
        id: "g6",
        text: "Projects, tasks, custom GPTs",
        enabled: true,
      },
    ],
  },
  {
    id: "plan-premium-001",
    code: "premium",
    name: "Premium",
    description: "Unlimited access to all features",
    priceGovernment: 599,
    pricePrivate: 799,
    currency: "INR",
    billingPeriod: "month",
    badge: "POPULAR",
    isActive: false, // Not active yet
    displayOrder: 2,
    features: [
      {
        id: "p1",
        text: "Unlimited Access to GPT-5",
        enabled: true,
      },
      {
        id: "p2",
        text: "Unlimited messaging and uploads",
        enabled: true,
      },
      {
        id: "p3",
        text: "Unlimited and fastest image creation",
        enabled: true,
      },
      {
        id: "p4",
        text: "Extended memory and context",
        enabled: true,
      },
      {
        id: "p5",
        text: "Unlimited deep research",
        enabled: true,
      },
      {
        id: "p6",
        text: "Advanced projects, tasks, custom GPTs",
        enabled: true,
      },
      {
        id: "p7",
        text: "Priority support",
        enabled: true,
      },
      {
        id: "p8",
        text: "API access",
        enabled: true,
      },
    ],
  },
];

/**
 * Use mock plans for development
 * Set to true to use mock data instead of API
 */
export const USE_MOCK_PLANS = false;

