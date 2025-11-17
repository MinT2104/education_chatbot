# Razorpay Payment Testing Checklist

## Pre-Testing Setup

- [ ] Backend server is running
- [ ] Razorpay test keys configured in backend
- [ ] User logged in with "Free" plan
- [ ] Browser DevTools console open
- [ ] Network tab open for monitoring

## Test 1: Successful Payment Flow ✅

**Steps:**
1. [ ] Navigate to `/payment` page
2. [ ] Verify "Pay with Razorpay" button is visible and enabled
3. [ ] Click "Pay with Razorpay"
4. [ ] Verify loading state: "Opening Razorpay..."
5. [ ] Modal opens within 2-3 seconds
6. [ ] Verify modal shows:
   - [ ] Plan name: "Education Bot"
   - [ ] Plan description: "Education Bot Go Plan"
   - [ ] Correct amount (₹299 or ₹399 based on category)
   - [ ] User name pre-filled
   - [ ] User email pre-filled
7. [ ] Enter test card: `4111 1111 1111 1111`
8. [ ] Enter CVV: `123`
9. [ ] Enter Expiry: `12/25`
10. [ ] Click "Pay" button
11. [ ] Enter OTP: `1234` (if prompted)
12. [ ] Wait for verification

**Expected Results:**
- [ ] Toast notification: "Payment successful! Your subscription is now active."
- [ ] Toast notification: "Welcome to the Go Plan! 🎉" (appears after 0.5s)
- [ ] Plan card updates to show "Cancel subscription" button
- [ ] Current plan indicator shows "Your current plan"
- [ ] Next billing date displayed (if available)
- [ ] No errors in console
- [ ] User plan in Redux store updated to "go"

**Console Logs to Verify:**
```
✓ Order created successfully
✓ Razorpay modal opened
✓ Payment completed
✓ Verification successful
```

---

## Test 2: Payment Cancellation ❌

**Steps:**
1. [ ] Navigate to `/payment` page
2. [ ] Click "Pay with Razorpay"
3. [ ] Wait for modal to open
4. [ ] Click the X button (top-right) or press Escape

**Expected Results:**
- [ ] Modal closes immediately
- [ ] Toast notification: "Payment cancelled. Your subscription was not activated."
- [ ] Button returns to enabled state
- [ ] User remains on "Free" plan
- [ ] No charge made
- [ ] No errors in console

**Console Logs to Verify:**
```
Payment cancelled by user
```

---

## Test 3: Network Error Handling 🌐

**Steps:**
1. [ ] Open DevTools → Network tab
2. [ ] Set throttling to "Offline"
3. [ ] Click "Pay with Razorpay"
4. [ ] Wait for error

**Expected Results:**
- [ ] Toast notification: "Network error. Please check your connection and try again."
- [ ] Button returns to enabled state
- [ ] Error logged to console with details

**Then:**
5. [ ] Set throttling back to "Online" or "No throttling"
6. [ ] Click "Pay with Razorpay" again
7. [ ] Verify payment proceeds normally

---

## Test 4: Retry Logic (Automatic) 🔄

**Preparation:**
- Requires backend to simulate 500 error for first attempt
- Or use browser breakpoint to delay response

**Steps:**
1. [ ] Backend configured to fail first order creation
2. [ ] Click "Pay with Razorpay"
3. [ ] Observe automatic retry

**Expected Results:**
- [ ] First attempt fails (logged in console)
- [ ] Wait 1 second
- [ ] Second attempt succeeds
- [ ] Modal opens normally
- [ ] No user intervention required
- [ ] No error toast shown (automatic recovery)

**Console Logs to Verify:**
```
Order creation attempt 1 failed: [error details]
Order creation attempt 2 succeeded
```

---

## Test 5: Script Loading ⚙️

**Steps:**
1. [ ] Open new incognito window
2. [ ] Navigate to payment page
3. [ ] Observe network requests

**Expected Results:**
- [ ] Razorpay script loaded from CDN
- [ ] Script loads successfully (200 status)
- [ ] Script cached for subsequent loads
- [ ] No CORS errors

**Then:**
4. [ ] Block CDN in network settings
5. [ ] Click "Pay with Razorpay"

**Expected Results:**
- [ ] Error toast: "Failed to initiate payment. Please try again."
- [ ] Button returns to enabled state

---

## Test 6: Multiple Click Prevention 🚫

**Steps:**
1. [ ] Click "Pay with Razorpay"
2. [ ] Immediately click again (before modal opens)
3. [ ] Click third time

**Expected Results:**
- [ ] Only one modal opens
- [ ] Button disabled during processing
- [ ] No duplicate orders created
- [ ] No errors in console

---

## Test 7: Error Code Handling 🔴

### 7.1 Authentication Required
**Preparation:** Log out user

**Expected:**
- [ ] Redirected to login page (handled by axios interceptor)
- [ ] Or toast: "Please login to continue."

### 7.2 Unsupported Plan
**Preparation:** Backend rejects plan

**Expected:**
- [ ] Toast: "This plan is not available."

### 7.3 Razorpay Not Configured
**Preparation:** Backend keys missing

**Expected:**
- [ ] Toast: "Payment system is temporarily unavailable. Please try again later."

### 7.4 Invalid Signature
**Preparation:** Tamper with signature (backend test)

**Expected:**
- [ ] Toast: "Payment verification failed. Please contact support with your payment ID."
- [ ] Payment ID shown in error message

---

## Test 8: Subscription Cancellation 🛑

**Prerequisites:**
- [ ] User must have active "Go" plan

**Steps:**
1. [ ] Navigate to `/payment` page
2. [ ] Verify "Cancel subscription" button visible
3. [ ] Verify "Next billing: [date]" displayed
4. [ ] Click "Cancel subscription"
5. [ ] Confirm in dialog

**Expected Results:**
- [ ] Loading state: "Cancelling..."
- [ ] Toast: "Subscription cancelled successfully"
- [ ] Plan switches to "Free"
- [ ] Button changes to "Switch to Free" (disabled)
- [ ] User plan in Redux store updated to "free"

---

## Test 9: Category Pricing 💰

**Steps:**
1. [ ] Navigate to `/payment` page
2. [ ] Verify "Government schools" tab selected by default
3. [ ] Note displayed price (should be ₹299 or configured amount)
4. [ ] Click "Private schools" tab
5. [ ] Note displayed price (should be ₹399 or configured amount)

**Expected Results:**
- [ ] Prices update correctly when switching tabs
- [ ] Tab selection visually clear
- [ ] Prices match backend configuration

---

## Test 10: Concurrent Payment Prevention ⏸️

**Steps:**
1. [ ] Click "Pay with PayPal"
2. [ ] Before redirect, try clicking "Pay with Razorpay"

**Expected Results:**
- [ ] Razorpay button disabled
- [ ] Click has no effect
- [ ] Only one payment flow active at a time

**Then:**
3. [ ] Cancel PayPal (don't complete)
4. [ ] Return to site
5. [ ] Try Razorpay again

**Expected Results:**
- [ ] Razorpay works normally
- [ ] No interference from previous attempt

---

## Test 11: Browser Compatibility 🌐

Test on each browser:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

**For Each Browser:**
- [ ] Modal opens correctly
- [ ] Payment completes successfully
- [ ] No console errors
- [ ] Responsive design works

---

## Test 12: Responsive Design 📱

**Steps:**
1. [ ] Open DevTools
2. [ ] Toggle device toolbar (Cmd/Ctrl + Shift + M)
3. [ ] Test on:
   - [ ] iPhone SE (375px)
   - [ ] iPhone 12 Pro (390px)
   - [ ] Pixel 5 (393px)
   - [ ] iPad (768px)
   - [ ] Desktop (1920px)

**Expected Results:**
- [ ] All buttons visible and clickable
- [ ] Modal displays correctly
- [ ] Text readable without zoom
- [ ] No horizontal scroll
- [ ] Touch targets adequate size (44x44px minimum)

---

## Test 13: Accessibility ♿

**Steps:**
1. [ ] Navigate using keyboard only (Tab key)
2. [ ] Verify can reach all interactive elements
3. [ ] Press Enter on "Pay with Razorpay" button
4. [ ] Modal opens and is keyboard accessible
5. [ ] Press Escape to close modal

**Expected Results:**
- [ ] All elements reachable via keyboard
- [ ] Focus indicators visible
- [ ] Modal traps focus correctly
- [ ] Escape key closes modal
- [ ] Screen reader announces state changes

---

## Test 14: Performance ⚡

**Steps:**
1. [ ] Open DevTools → Network tab
2. [ ] Clear cache
3. [ ] Reload payment page
4. [ ] Note load times

**Expected Results:**
- [ ] Page loads in < 2 seconds
- [ ] Razorpay script loads in < 1 second
- [ ] Order creation API responds in < 500ms
- [ ] Modal opens in < 1 second after click
- [ ] Verification API responds in < 1 second
- [ ] No unnecessary re-renders

---

## Test 15: Edge Cases 🎯

### 15.1 Slow Network
- [ ] Set throttling to "Slow 3G"
- [ ] Complete payment flow
- [ ] Verify retry logic works
- [ ] Verify user sees appropriate feedback

### 15.2 API Timeout
- [ ] Set very slow network
- [ ] Start payment
- [ ] Wait for timeout
- [ ] Verify error handling

### 15.3 Rapid Tab Switching
- [ ] Open payment page
- [ ] Click "Pay with Razorpay"
- [ ] Switch to another tab immediately
- [ ] Complete payment in Razorpay tab
- [ ] Switch back
- [ ] Verify state updated correctly

### 15.4 Page Refresh During Payment
- [ ] Click "Pay with Razorpay"
- [ ] Modal opens
- [ ] Refresh page (F5)
- [ ] Verify no charge made
- [ ] Verify can retry payment

---

## Security Checks 🔒

- [ ] No API keys visible in source code
- [ ] No sensitive data in console logs
- [ ] JWT token not exposed in URLs
- [ ] Payment signature verified on backend
- [ ] No XSS vulnerabilities
- [ ] No CSRF vulnerabilities
- [ ] HTTPS enforced in production

---

## Production Readiness ✅

Before deploying to production:

- [ ] All tests passed
- [ ] No console errors
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics tracking implemented
- [ ] Backend uses production Razorpay keys
- [ ] HTTPS configured
- [ ] Rate limiting in place
- [ ] Monitoring alerts configured
- [ ] Support documentation ready
- [ ] Rollback plan documented

---

## Regression Testing 🔄

After any code changes:

- [ ] Test 1: Successful payment
- [ ] Test 2: Payment cancellation
- [ ] Test 3: Network error
- [ ] Test 8: Subscription cancellation
- [ ] No console errors

---

## Known Issues / Limitations 📝

Document any known issues here:

1. _[None currently]_

---

## Testing Notes 📋

**Date Tested:** _________________
**Tested By:** _________________
**Environment:** ☐ Development  ☐ Staging  ☐ Production
**Backend Version:** _________________
**Frontend Version:** _________________

**Overall Status:** ☐ All Pass  ☐ Some Fail  ☐ Not Tested

**Failed Tests:**
- _[List any failed tests here]_

**Notes:**
- _[Any additional notes]_

---

## Quick Test (5 minutes)

For quick verification:

1. ✅ Successful payment flow (Test 1)
2. ✅ Payment cancellation (Test 2)
3. ✅ Subscription cancellation (Test 8)

If all three pass, core functionality is working.

---

**Last Updated:** November 17, 2025
**Version:** 1.0.0

