# Server-Side Rendering (SSR) Verification Guide

## Overview
This guide explains how to verify that your Next.js water-tax module is rendering correctly on the server and what to expect in different scenarios.

## What Should Be Displayed

### 1. **Landing Page** (`/water-tax/citizen` or `?view=landing`)
**Expected Header:**
- ✅ Water droplet logo + "Panvel Municipal Corporation"
- ✅ "Officer Login" button (right side)
- ✅ "Citizen Portal" button (right side)
- ❌ NO user profile avatar/dropdown
- ❌ NO logout button

**Page Content:**
- Welcome message and features
- "Get Started" button leading to login

---

### 2. **Login Page** (`/water-tax/citizen?view=login`)
**Expected Header:**
- ✅ Water droplet logo + "Panvel Municipal Corporation"
- ✅ "Officer Login" button
- ✅ "Citizen Portal" button
- ❌ NO user profile avatar/dropdown
- ❌ NO logout button

**Page Content:**
- Property Number / Mobile Number input field
- "Send OTP" button
- Water-themed animations

---

### 3. **OTP Page** (`/water-tax/citizen?view=otp`)
**Expected Header:**
- ✅ Water droplet logo + "Panvel Municipal Corporation"
- ✅ "Officer Login" button
- ✅ "Citizen Portal" button
- ❌ NO user profile avatar/dropdown
- ❌ NO logout button

**Page Content:**
- OTP input boxes (6 digits)
- Timer countdown
- Resend OTP option
- "Verify OTP" button

---

### 4. **Dashboard Page** (`/water-tax/citizen?view=dashboard`) - **After Successful Login**
**Expected Header:**
- ✅ Water droplet logo + "Panvel Municipal Corporation"
- ✅ User profile avatar (with first letter of name)
- ✅ User name display
- ✅ Mobile number display
- ✅ Profile dropdown (click to see full details)
- ✅ Logout button
- ❌ NO "Officer Login" / "Citizen Portal" buttons

**Profile Dropdown Contains:**
- Ward Number
- Property Number
- Full Name
- Complete Address
- Mobile Number
- Email Address

**Page Content:**
- Property selector dropdown
- Statistics cards (Active Connections, Total Due, Pending Bills, Consumption)
- Connection list with details
- Usage graphs
- Quick action buttons

---

## How to Verify Server-Side Rendering (SSR)

### Method 1: View Page Source (Recommended)
1. **Open your browser** and navigate to the page
2. **Right-click** anywhere on the page
3. **Select "View Page Source"** (or press `Ctrl+U` / `Cmd+U`)
4. **Look for HTML content** in the source

**✅ SSR is Working If:**
```html
<!-- You should see actual HTML like this: -->
<div class="h-screen flex flex-col bg-white overflow-hidden">
  <nav class="relative z-20 bg-gradient-to-r from-[#005AA7]...">
    <div class="w-full px-6 sm:px-8 lg:px-12">
      <div class="flex items-center justify-between h-20">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl text-white font-bold">Panvel Municipal Corporation</h1>
          <!-- ... more content ... -->
```

**❌ SSR is NOT Working If:**
```html
<!-- You only see: -->
<div id="root"></div>
<script src="bundle.js"></script>
```

### Method 2: Disable JavaScript
1. **Open Chrome DevTools** (`F12` or `Ctrl+Shift+I`)
2. **Press `Ctrl+Shift+P`** to open command palette
3. **Type "Disable JavaScript"** and select it
4. **Reload the page** (`F5`)

**✅ SSR is Working If:**
- Page still shows content (even without interactions)
- Header, layout, and text are visible
- Only interactive elements (buttons, dropdowns) won't work

**❌ SSR is NOT Working If:**
- Page is completely blank
- Only "Loading..." appears
- No content visible at all

### Method 3: Network Tab - Check Initial HTML
1. **Open DevTools** → **Network tab**
2. **Reload the page**
3. **Click on the first document request** (usually the page URL)
4. **Go to "Response" tab**

**✅ SSR is Working If:**
- Response shows full HTML with your content
- You can see component markup in the HTML
- User data is already populated in the HTML (for dashboard)

### Method 4: Check for Hydration
1. **Open Console** in DevTools
2. **Look for React DevTools** and check for:
   - Initial render should be instant (SSR)
   - Then React "hydrates" the page

**✅ SSR is Working If:**
- Content appears immediately on page load
- React hydration happens after
- No "flash of unstyled content" (FOUC)

---

## Common SSR Issues & Fixes

### Issue 1: User Profile Shows on Landing/Login Pages
**Problem:** `isLoggedIn` check might not be working
**Fix:** 
- Ensure `layout.tsx` only passes `user` when `session.citizenId` exists
- Check `CitizenPortalLayout.tsx` uses `isLoggedIn = !!(user && user.consumerNameEnglish)`

### Issue 2: Blank Page or Loading Forever
**Problem:** Component expecting browser APIs on server
**Fix:**
- Wrap browser code in `if (typeof window !== 'undefined')`
- Use `'use client'` directive for client-only components
- Check for `sessionStorage`/`localStorage` usage on server

### Issue 3: Hydration Mismatch Errors
**Problem:** Server HTML doesn't match client render
**Fix:**
- Don't use random values or `Date.now()` directly
- Ensure same data on server and client
- Check for conditional rendering based on browser APIs

---

## Testing Checklist

- [ ] Landing page shows Officer/Citizen buttons, NO user profile
- [ ] Login page shows Officer/Citizen buttons, NO user profile
- [ ] OTP page shows Officer/Citizen buttons, NO user profile
- [ ] Dashboard shows user profile + logout, NO Officer/Citizen buttons
- [ ] View Page Source shows actual HTML content (not just scripts)
- [ ] Disable JavaScript → Content still visible (layout, text)
- [ ] Network Response tab shows rendered HTML
- [ ] No hydration mismatch errors in console
- [ ] User profile dropdown works and shows correct data
- [ ] Logout button redirects to login page

---

## Current Implementation Status

### ✅ Correctly Implemented:
1. **Server Components:**
   - `DashboardScreen.server.tsx` - Server wrapper
   - `LoginScreen.server.tsx` - Login page SSR
   - `OtpScreen.server.tsx` - OTP page SSR
   - `LandingScreen.server.tsx` - Landing page SSR

2. **Session Management:**
   - Server-side cookies (`getCitizenSession()`)
   - No reliance on sessionStorage for critical data
   - Proper session validation before dashboard access

3. **User Profile Display:**
   - Only shown when `isLoggedIn = true`
   - `isLoggedIn` set only when user data exists
   - User data only passed from layout when session is valid

### 🔧 Client Components (Interactive Islands):
- `DashboardScreenNew.tsx` - Main dashboard UI
- `DashboardWrapper.tsx` - Client wrapper with navigation
- `CivicRibbon.tsx` - Navigation component
- `OtpVerification.tsx` - OTP input and verification

---

## Browser DevTools Commands

```javascript
// Check if user session exists in cookies
document.cookie

// Check current view
new URLSearchParams(window.location.search).get('view')

// Check if React has hydrated
window.__NEXT_DATA__

// See current session data (after login)
// NOTE: Session data should be in cookies, not sessionStorage
sessionStorage.getItem('waterTaxSession')
```

---

## Expected Console Output (Development Mode)

```
🔍 Current View: landing
🔍 Session: No session

🔍 Current View: login  
🔍 Session: No session

🔍 Current View: otp
🔍 Session: { hasConnections: false, otpTargetMasked: '******1234' }

🔍 Current View: dashboard
🔍 Session: { 
  citizenId: 'CIT-123',
  hasConnections: true,
  connectionsCount: 2 
}
✅ Rendering Dashboard with user: {
  citizenId: 'CIT-123',
  propertiesCount: 2,
  connectionsCount: 2
}
```

---

## Summary

**Your water-tax module is properly using SSR when:**
1. Initial HTML contains rendered content (check page source)
2. User profile only appears after successful OTP login
3. Officer/Citizen buttons disappear after login
4. Content is visible even with JavaScript disabled
5. No `sessionStorage` dependencies for critical data
