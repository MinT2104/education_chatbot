export interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayPrefillOptions {
  name?: string;
  email?: string;
  contact?: string;
}

export interface RazorpayThemeOptions {
  color?: string;
}

export interface RazorpayModalOptions {
  ondismiss?: () => void;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  order_id?: string;
  handler: (response: RazorpayHandlerResponse) => void | Promise<void>;
  prefill?: RazorpayPrefillOptions;
  theme?: RazorpayThemeOptions;
  modal?: RazorpayModalOptions;
}

export interface RazorpayInstance {
  open(): void;
  close(): void;
}

export interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

export {};

