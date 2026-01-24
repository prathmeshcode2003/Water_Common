"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardScreen } from "./DashboardScreenNew";
import CivicRibbon from "./CivicRibbon";
import type { WaterConnectionSummary } from "@/types/water-tax.types";

interface DashboardWrapperProps {
  citizenName: string;
  connections: WaterConnectionSummary[];
  mobileNumber?: string;
}

/**
 * DashboardWrapper Component
 * 
 * This component fetches consumer data from sessionStorage (set by OTP verification)
 * and passes it to the DashboardScreen for display.
 */
export function DashboardWrapper({ 
  citizenName, 
  connections: initialConnections,
  mobileNumber
}: DashboardWrapperProps) {
  const router = useRouter();
  const [consumerData, setConsumerData] = useState<WaterConnectionSummary[]>(initialConnections);
  const [loading, setLoading] = useState(true);

  // Load consumer data from sessionStorage on client side
  useEffect(() => {
    try {
      const storedConsumers = sessionStorage.getItem('waterTaxConsumers');
      const storedSelected = sessionStorage.getItem('waterTaxSelectedConsumer');
      
      if (storedConsumers) {
        const consumers = JSON.parse(storedConsumers);
        console.log('DashboardWrapper - Loaded from sessionStorage:', consumers);
        setConsumerData(consumers);
      } else if (initialConnections.length > 0) {
        console.log('DashboardWrapper - Using initial connections:', initialConnections);
        setConsumerData(initialConnections);
      }
    } catch (error) {
      console.error('Error loading consumer data:', error);
      setConsumerData(initialConnections);
    } finally {
      setLoading(false);
    }
  }, [initialConnections]);

  // Defensive: Ensure consumerData is always an array
  const safeConsumerData = Array.isArray(consumerData) ? consumerData : [];

  console.log('DashboardWrapper - Consumer data:', { 
    consumerData: safeConsumerData,
    dataCount: safeConsumerData.length,
    firstConsumer: safeConsumerData[0]
  });

  // Transform API consumer data for dashboard display
  const firstConsumer = safeConsumerData[0];
  
  const allProperties = safeConsumerData.map((conn) => ({
    // Use propertyNumber if present, else fallback to propertyNo from API
    propertyNumber: conn.propertyNumber || conn.propertyNo,
    partitionNumber: conn.partitionNumber,
    address: conn.addressEnglish || conn.address,
    ward: conn.wardNo,
    zone: conn.zoneNo,
    connectionCount: 1
  }));

  // Map all API response fields to user object
  const user = {
    // Basic Info
    name: firstConsumer?.consumerNameEnglish || firstConsumer?.consumerName || citizenName,
    nameHindi: firstConsumer?.consumerName,
    mobile: firstConsumer?.mobileNumber || firstConsumer?.mobileNo || mobileNumber,
    email: firstConsumer?.emailID || firstConsumer?.emailID,
    
    // Consumer Details
    consumerID: firstConsumer?.consumerID,
    consumerNumber: firstConsumer?.consumerNumber,
    oldConsumerNumber: firstConsumer?.oldConsumerNumber,
    
    // Location Details
    propertyNumber: firstConsumer?.propertyNumber || firstConsumer?.propertyNo || "",
    partitionNumber: firstConsumer?.partitionNumber,
    selectedProperty: firstConsumer?.propertyNumber || firstConsumer?.propertyNo || "",
    address: firstConsumer?.addressEnglish || firstConsumer?.address,
    addressHindi: firstConsumer?.address,
    wardNo: firstConsumer?.wardNo,
    zoneNo: firstConsumer?.zoneNo,
    
    // Connection Details
    connectionTypeID: firstConsumer?.connectionTypeID,
    connectionTypeName: firstConsumer?.connectionTypeName,
    categoryID: firstConsumer?.categoryID,
    categoryName: firstConsumer?.categoryName,
    pipeSizeID: firstConsumer?.pipeSizeID,
    pipeSize: firstConsumer?.pipeSize,
    connectionDate: firstConsumer?.connectionDate,
    isActive: firstConsumer?.isActive,
    
    // Additional Info
    remark: firstConsumer?.remark,
    createdDate: firstConsumer?.createdDate,
    updatedDate: firstConsumer?.updatedDate,
    
    // Arrays
    allProperties: allProperties,
    connections: safeConsumerData,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      router.push("/water-tax/citizen?view=landing");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/water-tax/citizen?view=landing");
    }
  };

  const handleNavigate = (screen: string) => {
    const screenRoutes: Record<string, string> = {
      dashboard: "dashboard",
      connections: "connections",
      newConnection: "new-connection",
      trackStatus: "track-status",
      grievances: "grievances",
      // payBills: "pay-bills",
      submitReading: "submit-reading",
      passbook: "passbook",
      calculator: "calculator",
      // history: "history",
      // downloads: "downloads",
      // support: "support",
      // rti: "rti",
    };

    const viewParam = screenRoutes[screen] || screen;
    router.push(`/water-tax/citizen?view=${viewParam}`);
  };

  return (
    <>
      <CivicRibbon 
        currentScreen="dashboard" 
        onNavigate={handleNavigate} 
      />
      
      <DashboardScreen
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
    </>
  );
}
