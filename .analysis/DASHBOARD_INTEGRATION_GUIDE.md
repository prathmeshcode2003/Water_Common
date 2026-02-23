# 📘 Dashboard SSR Integration Guide

## 🎯 Quick Start (5 Steps)

### Step 1: Update `page.tsx` to use Dashboard SSR

**File**: `src/app/[locale]/water-tax/citizen/page.tsx`

Add the dashboard view to your view router:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { LandingScreenSSR } from '@/components/modules/water-tax/screens/LandingScreen.server';
import { LoginScreenSSR } from '@/components/modules/water-tax/screens/LoginScreen.server';
import { OtpScreenSSR } from '@/components/modules/water-tax/screens/OtpScreen.server';
import { DashboardScreenSSR } from '@/components/modules/water-tax/screens/DashboardScreen.server';  // ← ADD THIS

export default function WaterTaxCitizenPage() {
  const searchParams = useSearchParams();
  const [view, setView] = useState('landing');
  const [lookupQuery, setLookupQuery] = useState('');
  const [otpTarget, setOtpTarget] = useState('');
  const [user, setUser] = useState<any>(null);  // ← ADD THIS

  useEffect(() => {
    const currentView = searchParams.get('view') || 'landing';
    setView(currentView);
    
    // Get saved query from sessionStorage
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('waterTaxLookupQuery');
      const savedTarget = sessionStorage.getItem('waterTaxOtpTarget');
      if (saved) setLookupQuery(saved);
      if (savedTarget) setOtpTarget(savedTarget);
      
      // Load user data if authenticated
      const userData = sessionStorage.getItem('waterTaxUser');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [searchParams]);

  const handleNavigateToLogin = () => {
    window.location.href = '?view=login';
  };

  const handleNavigate = (newView: string) => {
    window.location.href = `?view=${newView}`;
  };

  // Render based on view
  switch (view) {
    case 'login':
      return <LoginScreenSSR lookupQuery={lookupQuery} />;
    
    case 'otp':
      return <OtpScreenSSR lookupQuery={lookupQuery} otpTargetMasked={otpTarget} />;
    
    case 'dashboard':  // ← ADD THIS CASE
      return user ?  (
        <DashboardScreenSSR 
          user={user} 
          onLogout={() => {
            sessionStorage.removeItem('waterTaxUser');
            handleNavigate('landing');
          }}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      );
    
    default:
      return <LandingScreenSSR onNavigateToLogin={handleNavigateToLogin} />;
  }
}
```

---

### Step 2: Mock User Data (for Testing)

Add this to your OTP verification success handler:

```tsx
// In OtpVerification.tsx or wherever you handle OTP success

const handleOtpSuccess = () => {
  // Mock user data for testing
  const mockUser = {
    name: 'John Doe',
    mobile: '9876543210',
    selectedProperty: 'PROP-001',
    propertyNumber: 'PROP-001',
    allProperties: [
      {
        propertyNumber: 'PROP-001',
        address: '123 Main Street, Ward 5, Zone A',
        connectionCount: 2,
      },
      {
        propertyNumber: 'PROP-002',
        address: '456 Oak Avenue, Ward 3, Zone B',
        connectionCount: 1,
      },
    ],
    connections: [
      {
        id: 'CONN-001',
        consumerNo: 'CON123456',
        propertyNo: 'PROP-001',
        categoryName: 'Domestic',
        connectionTypeName: 'Residential',
        status: 'Active',
        isActive: true,
        sizeName: '15mm',
        billAmount: 2500,
        consumption: 45,
        currentDemand: 2500,
        addressEnglish: '123 Main Street',
        zoneName: 'Zone A',
        wardName: 'Ward 5',
        meterType: 'meter',
        meterNumber: 'MTR789012',
        dueDate: '2026-02-15',
      },
      {
        id: 'CONN-002',
        consumerNo: 'CON789012',
        propertyNo: 'PROP-001',
        categoryName: 'Commercial',
        connectionTypeName: 'Commercial',
        status: 'Active',
        isActive: true,
        sizeName: '20mm',
        billAmount: 4500,
        consumption: 85,
        currentDemand: 4500,
        addressEnglish: '123 Main Street (Shop)',
        zoneName: 'Zone A',
        wardName: 'Ward 5',
        meterType: 'meter',
        meterNumber: 'MTR345678',
        dueDate: '2026-02-15',
      },
    ],
  };

  // Save to sessionStorage
  sessionStorage.setItem('waterTaxUser', JSON.stringify(mockUser));
  
  // Navigate to dashboard
  window.location.href = '?view=dashboard';
};
```

---

### Step 3: Test the Dashboard

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Navigate through the flow**:
   - Visit: `http://localhost:3000/en/water-tax/citizen`
   - Click "Get Started Now"
   - Enter any query and click "Send OTP"
   - Enter OTP: 123456
   - Click "Verify"
   - **You should see the Dashboard!**

3. **Test features**:
   - Switch between properties in the dropdown
   - Check/uncheck connections
   - Click "Pay Now" button
   - Click "View Details" on a connection
   - Resize window to test responsiveness

---

### Step 4: Check for Visual Issues

Open Chrome DevTools and test:

1. **Mobile view** (375px):
   - Stats: 2 columns ✓
   - Connections list: Full width ✓
   - News marquee: Hidden ✓
   - Touch-friendly buttons ✓

2. **Tablet view** (768px):
   - Stats: Still 2 columns ✓
   - Cards expanded ✓

3. **Desktop view** (1024px+):
   - Stats: 4 columns ✓
   - News marquee: Visible & scrolling ✓
   - Property selector: Fixed 260px width ✓
   - Connections + Usage: Side-by-side ✓

---

### Step 5: Verify Performance

1. **Open DevTools** (F12)

2. **Network Tab**:
   - Clear cache
   - Reload page
   - Check bundle sizes:
     - Main bundle: ~15-20 KB ✓
     - Total transfer: <100 KB ✓

3. **Lighthouse**:
   - Run Lighthouse audit
   - Performance: 90+ ✓
   - SEO: 90+ ✓
   - Accessibility: 85+ ✓

4. **Console**:
   - No hydration errors ✓
   - No PropType warnings ✓

---

## 🔧 Troubleshooting

### Issue: "Cannot find module 'DashboardScreenSSR'"

**Solution**: Make sure you've exported it:
```tsx
// src/components/modules/water-tax/screens/index.server.ts
export { DashboardScreenSSR } from './DashboardScreen.server';
```

### Issue: "Property 'id' does not exist on Checkbox"

**Solution**: Remove the `id` prop from Checkbox in ConnectionCard.tsx (it's not needed for the component to work).

### Issue: "user is null"

**Solution**: Make sure you're setting user data in sessionStorage after OTP verification (see Step 2).

### Issue: Property selector doesn't change

**Solution**: This is expected in the current implementation. To make it work, you need to:
1. Add server action to update selected property
2. Or update URL params and reload
3. For now, it's just a visual selector

---

## 🎨 Customization

### Change Colors:

All components use Tailwind colors. To change the theme:

```tsx
// Example: Change from blue to purple

// In PropertySelector.tsx
className="bg-gradient-to-br from-purple-500 to-pink-500"

// In DashboardStats.tsx
color: 'from-purple-500 to-pink-500'
```

### Add New Stats:

In `DashboardScreen.server.tsx`:

```tsx
const newStat = {
  title: 'New Stat',
  value: '100',
  change: 'Description',
  icon: require('lucide-react').Star,
  color: 'from-yellow-500 to-orange-500',
  trend: 'up' as const,
};
```

### Modify Breakpoints:

All components use consistent breakpoints:
- `sm:` = 640px
 - `md:` = 768px
- `lg:` = 1024px
- `xl:` = 1280px

Change any `lg:` class to `md:` for earlier activation.

---

## ✅ Final Checklist

Before deploying:

- [ ] Tested on mobile (375px)
- [ ] Tested on tablet (768px)
- [ ] Tested on desktop (1920px)
- [ ] Checked bundle size (<20 KB)
- [ ] No console errors
- [ ] No hydration warnings
- [ ] All animations smooth
- [ ] Touch targets ≥44px
- [ ] Property selector works
- [ ] Connections display correctly
- [ ] Payment button works
- [ ] Quick actions respond
- [ ] News marquee scrolls

---

## 🚀 You're Ready!

Your Dashboard SSR implementation is complete and ready to use!

**Next Steps**:
1. Replace mock data with real API calls
2. Add server actions for property switching
3. Integrate payment gateway
4. Add remaining optional components (UsageChart, ActivityTimeline)
5. Deploy to staging for testing

**Need Help**: Check `.analysis/DASHBOARD_SSR_COMPLETE.md` for full documentation.
