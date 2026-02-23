# 🔧 500 Error Fix - Dashboard Rendering

## ❌ Problem

Getting 500 error when trying to view dashboard after successful OTP verification.

### Root Cause:
The `DashboardScreen.server.tsx` server component had **client-side code**:

```typescript
// ❌ WRONG: Server components cannot have window checks
const handlePropertyChange = (propertyNumber: string) => {
  if (typeof window !== 'undefined') {  // ❌ Error!
    console.log('Property changed to:', propertyNumber);
  }
};
```

**Server components cannot:**
- Check `typeof window`
- Pass functions to client components
- Have client-side logic

---

## ✅ Solution Applied

### 1. Fixed `DashboardScreen.server.tsx`
Removed all client-side functions and window checks:

```typescript
// ✅ CORRECT: Just pass data, no functions
<PropertySelector
  properties={allProperties}
  currentProperty={selectedPropertyNumber}
  // No onPropertyChange prop!
/>
```

### 2. Client Components Handle Their Own Logic
Each client component should handle its own clicks internally:

**PropertySelector.tsx** - Needs update:
```typescript
interface PropertySelectorProps {
  properties: Property[];
  currentProperty: string;
  onPropertyChange?: (propertyNumber: string) => void; // Make optional
}

export function PropertySelector({ properties, currentProperty, onPropertyChange }: PropertySelectorProps) {
  const router = useRouter();
  
  const handleChange = (propertyNumber: string) => {
    if (onPropertyChange) {
      onPropertyChange(propertyNumber);
    } else {
      // Default: update URL
      router.push(`?view=dashboard&property=${propertyNumber}`);
    }
  };
  
  return (
    <Select value={currentProperty} onValueChange={handleChange}>
      {/* ... */}
    </Select>
  );
}
```

**QuickActions.tsx** - Already handles internally ✅

**DashboardStats.tsx** - Already handles internally ✅

**ConnectionsList.tsx** - Needs update:
```typescript
interface ConnectionsListProps {
  connections: any[];
  propertyNumber: string;
  onPaySelected?: (ids: string[], amount: number) => void; // Make optional
  onViewDetails?: (conn: any) => void; // Make optional
}

export function ConnectionsList({ connections, propertyNumber, onPaySelected, onViewDetails }: ConnectionsListProps) {
  const router = useRouter();
  
  const handlePay = (ids: string[], amount: number) => {
    if (onPaySelected) {
      onPaySelected(ids, amount);
    } else {
      // Default: navigate to payment
      router.push(`/water-tax/citizen/payment?connections=${ids.join(',')}&amount=${amount}`);
    }
  };
  
  const handleViewDetails = (conn: any) => {
    if (onViewDetails) {
      onViewDetails(conn);
    } else {
      // Default: show details
      console.log('View details:', conn);
    }
  };
  
  // Use handlePay and handleViewDetails
}
```

---

## 📁 Files Fixed

### ✅ Already Fixed:
1. `DashboardScreen.server.tsx` - Removed client-side code

### ⏳ Need Manual Updates:
2. `PropertySelector.tsx` - Make `onPropertyChange` optional
3. `ConnectionsList.tsx` - Make `onPaySelected` and `onViewDetails` optional
4. `QuickActions.tsx` - Already handles internally ✅
5. `DashboardStats.tsx` - Already handles internally ✅

---

## 🔧 Manual Fixes Needed

### Fix 1: PropertySelector.tsx

**Line 22** - Change:
```typescript
onPropertyChange: (propertyNumber: string) => void;
```

To:
```typescript
onPropertyChange?: (propertyNumber: string) => void;
```

**Add after line 35**:
```typescript
const router = useRouter();

const handleChange = (propertyNumber: string) => {
  if (onPropertyChange) {
    onPropertyChange(propertyNumber);
  } else {
    router.push(`?view=dashboard&property=${propertyNumber}`);
  }
};
```

**Line 46** - Change:
```typescript
<Select value={currentProperty} onValueChange={onPropertyChange}>
```

To:
```typescript
<Select value={currentProperty} onValueChange={handleChange}>
```

### Fix 2: ConnectionsList.tsx

**Lines 8-11** - Change:
```typescript
onPaySelected: (connectionIds: string[], totalAmount: number) => void;
onViewDetails: (connection: any) => void;
```

To:
```typescript
onPaySelected?: (connectionIds: string[], totalAmount: number) => void;
onViewDetails?: (connection: any) => void;
```

**Add handlers**:
```typescript
const router = useRouter();

const handlePay = (ids: string[], amount: number) => {
  if (onPaySelected) {
    onPaySelected(ids, amount);
  } else {
    router.push(`/water-tax/citizen/payment?connections=${ids.join(',')}`);
  }
};

const handleViewDetails = (conn: any) => {
  if (onViewDetails) {
    onViewDetails(conn);
  } else {
    console.log('View details:', conn);
  }
};
```

---

## 🧪 Testing

After making the fixes:

1. **Restart dev server**:
   ```bash
   npm run dev
   ```

2. **Test flow**:
   - Visit `/en/water-tax/citizen`
   - Click "Get Started Now"
   - Enter query: `9876543210`
   - Click "Send OTP"
   - Enter OTP: `123456`
   - Click "Verify & Login"

3. **Expected**:
   - ✅ No 500 error
   - ✅ Dashboard loads
   - ✅ Shows user data
   - ✅ All components render

---

## 📝 Summary

**The 500 error was caused by server component having client-side code.**

✅ **Fixed**: Removed window checks from DashboardScreen.server.tsx  
⏳ **TODO**: Make client component props optional  
⏳ **TODO**: Add internal handlers in client components  

**Once the manual fixes are applied, the dashboard will render successfully!**
