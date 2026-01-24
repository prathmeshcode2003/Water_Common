"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PassbookScreen } from "./PassbookScreen";
import CivicRibbon from "./CivicRibbon";
import type { WaterConnectionSummary } from "@/types/water-tax.types";

// Accept props for initial data (optional, for SSR/hydration)
interface PassbookWrapperProps {
  citizenName?: string;
  connections?: WaterConnectionSummary[];
  mobileNumber?: string;
}

export function PassbookWrapper(props: PassbookWrapperProps = {}) {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    const screenRoutes: Record<string, string> = {
      dashboard: "dashboard",
      passbook: "passbook",
      submitReading: "submit-reading",
      grievances: "grievances",
      calculator: "calculator",
    };

    const viewParam = screenRoutes[screen] || screen;
    router.push(`/water-tax/citizen?view=${viewParam}`);
  };

  // Load consumer data from sessionStorage or props (same as DashboardWrapper)
  const [consumerData, setConsumerData] = useState<WaterConnectionSummary[]>(props.connections || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedConsumers = sessionStorage.getItem('waterTaxConsumers');
      if (storedConsumers) {
        const consumers = JSON.parse(storedConsumers);
        setConsumerData(consumers);
      } else if (props.connections && props.connections.length > 0) {
        setConsumerData(props.connections);
      }
    } catch (error) {
      setConsumerData(props.connections || []);
    } finally {
      setLoading(false);
    }
  }, [props.connections]);

  const safeConsumerData = Array.isArray(consumerData) ? consumerData : [];
  const firstConsumer = safeConsumerData[0];

  const allProperties = safeConsumerData.map((conn) => ({
    propertyNumber: conn.propertyNumber || conn.propertyNo,
    partitionNumber: conn.partitionNumber,
    address: conn.addressEnglish || conn.address,
    ward: conn.wardNo,
    zone: conn.zoneNo,
    connectionCount: 1
  }));

  const user = {
    name: firstConsumer?.consumerNameEnglish || firstConsumer?.consumerName || props.citizenName,
    nameHindi: firstConsumer?.consumerName,
    mobile: firstConsumer?.mobileNumber || firstConsumer?.mobileNo || props.mobileNumber,
    email: firstConsumer?.emailID || firstConsumer?.emailID,
    consumerID: firstConsumer?.consumerID,
    consumerNumber: firstConsumer?.consumerNumber,
    oldConsumerNumber: firstConsumer?.oldConsumerNumber,
    propertyNumber: firstConsumer?.propertyNumber || firstConsumer?.propertyNo || "",
    partitionNumber: firstConsumer?.partitionNumber,
    selectedProperty: firstConsumer?.propertyNumber || firstConsumer?.propertyNo || "",
    address: firstConsumer?.addressEnglish || firstConsumer?.address,
    addressHindi: firstConsumer?.address,
    wardNo: firstConsumer?.wardNo,
    zoneNo: firstConsumer?.zoneNo,
    connectionTypeID: firstConsumer?.connectionTypeID,
    connectionTypeName: firstConsumer?.connectionTypeName,
    categoryID: firstConsumer?.categoryID,
    categoryName: firstConsumer?.categoryName,
    pipeSizeID: firstConsumer?.pipeSizeID,
    pipeSize: firstConsumer?.pipeSize,
    connectionDate: firstConsumer?.connectionDate,
    isActive: firstConsumer?.isActive,
    remark: firstConsumer?.remark,
    createdDate: firstConsumer?.createdDate,
    updatedDate: firstConsumer?.updatedDate,
    allProperties: allProperties,
    connections: safeConsumerData,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading passbook...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <CivicRibbon currentScreen="passbook" onNavigate={handleNavigate} />
      <PassbookScreen user={user} onNavigate={handleNavigate} />
    </>
  );
}
