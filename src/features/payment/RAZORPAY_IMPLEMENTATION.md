# Razorpay Payment Integration - Implementation Guide

## Overview

This document explains the Razorpay payment integration implementation in the frontend, following the backend API guide.

## Architecture

```
User clicks "Pay with Razorpay"
         ↓
1. Create Order (POST /api/payment/razorpay/order) with retry logic
         ↓
2. Open Razorpay Checkout Modal
         ↓
3. User completes payment
         ↓
4. Verify Payment (POST /api/payment/razorpay/verify)
         ↓
5. Subscription activated → User upgraded to "go" plan
         ↓
6. Refresh user state and subscription
```

## Implementation Details

### 1. Service Layer (`paymentService.ts`)

#### Key Interfaces

```typescript
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
```

#### API Methods

- `createRazorpayOrder(plan: "go")`: Creates a Razorpay order
- `verifyRazorpayPayment(payload)`: Verifies payment signature
- `getSubscription()`: Gets current subscription status
- `cancelSubscription()`: Cancels active subscription

### 2. Payment Page Component (`PaymentPage.tsx`)

#### Key Features

1. **Script Loading**: Dynamically loads Razorpay checkout script
2. **Retry Logic**: Automatically retries failed order creation (up to 3 times with exponential backoff)
3. **Error Handling**: Comprehensive error handling with user-friendly messages
4. **State Management**: Manages payment processing states for both PayPal and Razorpay
5. **User Feedback**: Clear toast notifications for all states

#### Error Handling

The implementation handles all backend error codes:

| Error Code | User Message | Action |
|-----------|--------------|--------|
| `AUTHENTICATION_REQUIRED` | Please login to continue | Redirect handled automatically |
| `UNSUPPORTED_PLAN` | This plan is not available | Show error |
| `RAZORPAY_NOT_CONFIGURED` | Payment system temporarily unavailable | Show error + retry |
| `ORDER_CREATION_FAILED` | Failed to create order | Auto-retry (3 attempts) |
| `INVALID_SIGNATURE` | Payment verification failed | Show error + contact support |
| `SUBSCRIPTION_NOT_FOUND` | Subscription not found | Show error + retry |
| `VERIFICATION_FAILED` | Payment verification failed | Show error + contact support |
| `MISSING_PAYMENT_DETAILS` | Missing payment details | Show error |

#### Retry Logic

```typescript
const createOrderWithRetry = async (maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await paymentService.createRazorpayOrder("go");
      if (result && result.success) {
        return result;
      }
    } catch (error) {
      if (i < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 3s
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      } else {
        throw error;
      }
    }
  }
  return null;
};
```

#### Payment Flow

```typescript
const handleRazorpayCheckout = async () => {
  // Step 1: Load Razorpay script
  const scriptLoaded = await ensureRazorpayScriptLoaded();
  
  // Step 2: Create order with retry
  const orderData = await createOrderWithRetry();
  
  // Step 3: Open Razorpay modal
  const rzp = new window.Razorpay({
    key: orderData.razorpay_key,
    order_id: orderData.order.id,
    amount: orderData.order.amount,
    currency: orderData.order.currency,
    name: "Education Bot",
    description: orderData.plan.description,
    
    // Step 4: Payment success handler
    handler: async (response) => {
      // Verify payment on backend
      const verifyResult = await paymentService.verifyRazorpayPayment(response);
      
      if (verifyResult.success) {
        // Success! Update UI and refresh user state
        toast.success("Payment successful!");
        await Promise.all([
          loadSubscription(),
          dispatch(getMe())
        ]);
      }
    },
    
    // Prefill user info
    prefill: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      contact: currentUser?.phone || "",
    },
    
    // Theme
    theme: { color: "#3399cc" },
    
    // Modal dismiss handler
    modal: {
      ondismiss: () => {
        toast.info("Payment cancelled");
      }
    }
  });
  
  rzp.open();
};
```

### 3. TypeScript Definitions (`razorpay.d.ts`)

Provides type safety for Razorpay integration:

```typescript
interface Window {
  Razorpay?: RazorpayConstructor;
}

interface RazorpayOptions {
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
```

## Security Features

1. ✅ **No secret keys exposed**: Only public key is sent to frontend
2. ✅ **Signature verification**: Backend validates all payment signatures
3. ✅ **HTTPS required**: Production must use HTTPS
4. ✅ **JWT authentication**: All API calls require valid JWT token
5. ✅ **Idempotency**: Order IDs prevent duplicate charges
6. ✅ **Audit logging**: All transactions logged on backend

## Testing

### Test Mode Setup

1. Backend must be in test mode (using test keys)
2. Use Razorpay test cards:
   - **Visa**: 4111 1111 1111 1111
   - **Mastercard**: 5555 5555 5555 4444
   - **CVV**: Any 3 digits (e.g., 123)
   - **Expiry**: Any future date (e.g., 12/25)
   - **OTP**: 1234

### Test Scenarios

#### ✅ Successful Payment
1. Click "Pay with Razorpay"
2. Modal opens with order details
3. Enter test card details
4. Complete payment
5. Verify success toast
6. Check plan upgraded to "Go"

#### ✅ Payment Cancellation
1. Click "Pay with Razorpay"
2. Modal opens
3. Close modal
4. Verify "Payment cancelled" toast
5. Check plan remains unchanged

#### ✅ Network Error Recovery
1. Disconnect network
2. Click "Pay with Razorpay"
3. Verify error message
4. Reconnect network
5. Retry payment
6. Verify success

#### ✅ Order Creation Retry
1. Backend returns 500 error
2. Frontend retries automatically
3. Success on retry attempt
4. Payment completes normally

## User Experience

### Loading States

- ✅ "Opening Razorpay..." - While initializing modal
- ✅ "Processing Payment..." - While verifying payment
- ✅ Button disabled during processing
- ✅ Spinner animation for visual feedback

### Success States

- ✅ "Payment successful! Your subscription is now active."
- ✅ "Welcome to the Go Plan! 🎉"
- ✅ Plan card updates to show "Cancel subscription" button
- ✅ Next billing date displayed

### Error States

- ✅ Specific error messages based on error code
- ✅ Instructions to contact support (with payment ID)
- ✅ Retry suggestions where appropriate
- ✅ Network error detection and messaging

## Webhook Support

The backend also handles Razorpay webhooks for redundancy:

- **Endpoint**: `POST /api/payment/razorpay/webhook`
- **Purpose**: Backup activation if frontend verify call fails
- **Events**: payment.captured, payment.failed, order.expired

Frontend doesn't need to handle webhooks - they provide automatic backup activation.

## Maintenance

### Monitoring

Monitor these metrics:
- Order creation success rate
- Payment verification success rate
- Modal abandonment rate
- Retry attempt counts
- Error code frequencies

### Common Issues

**Issue**: "Failed to load Razorpay checkout script"
- **Cause**: Network error or CDN down
- **Solution**: Check internet connection, retry

**Issue**: "Payment verification failed"
- **Cause**: Invalid signature or backend error
- **Solution**: Contact support with payment ID

**Issue**: "Order creation failed after multiple attempts"
- **Cause**: Backend unavailable or configuration error
- **Solution**: Check backend logs, verify Razorpay keys configured

## Future Enhancements

1. **Payment History**: Show past payments in user profile
2. **Subscription Management**: Allow plan changes (upgrade/downgrade)
3. **Invoice Generation**: Automatic invoice emails
4. **Discount Codes**: Apply promo codes at checkout
5. **Multiple Plans**: Support for different plan tiers
6. **Recurring Billing**: Automatic renewals with saved cards

## Support

For issues or questions:
1. Check browser console for detailed error logs
2. Verify JWT token is valid
3. Ensure backend is running and configured
4. Check backend logs for detailed error messages
5. Contact backend team with:
   - Error code
   - Order ID (if available)
   - Payment ID (if available)
   - Timestamp
   - User email

---

**Last Updated**: November 17, 2025
**Version**: 1.0.0
**Backend API Version**: 1.0.0

