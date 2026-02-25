/**
 * Meter Reading Service
 * 
 * This service handles all API interactions related to meter readings.
 * It uses the ConsumerMeterReading API endpoints to manage meter reading data.
 * 
 * Available Functions:
 * - fetchConsumerMeterReadings: Get all meter readings for a consumer
 * - fetchMeterReadingById: Get specific meter reading by ID
 * - createMeterReading: Submit new meter reading
 * - updateMeterReading: Update existing meter reading  
 * - deleteMeterReading: Delete meter reading
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5268';

export interface MeterReading {
  meterReadingID: number;
  consumerMeterID: number;
  consumerID: number;
  billingCycleID: number;
  previousReadingDate: string;
  previousReading: number;
  currentReadingDate: string;
  currentReading: number;
  totalUnit: number;
  readingStatusID: number;
  readingSourceID: number;
  markedForDeletion: boolean;
  approvedBy: number | null;
  approvedDate: string | null;
  readingImagePath: string | null;
  remark: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string | null;
}

export interface CreateMeterReadingRequest {
  isActive: boolean;
  createdBy: number;
  consumerMeterID: number;
  consumerID: number;
  billingCycleID: number;
  previousReadingDate: string;
  previousReading: number;
  currentReadingDate: string;
  currentReading: number;
  readingStatusID: number;
  readingSourceID: number;
  markedForDeletion: boolean;
  approvedBy?: string;
  approvedDate?: string;
  readingImagePath?: string;
  remark: string;
}

export interface UpdateMeterReadingRequest {
  meterReadingID: number;
  currentReadingDate?: string;
  currentReading?: number;
  readingStatusID?: number;
  remark?: string;
  readingImage?: File;
}

/**
 * Fetch all meter readings for a specific consumer
 */
export async function fetchConsumerMeterReadings(consumerID: number): Promise<MeterReading[]> {
  const url = `${API_BASE_URL}/api/ConsumerMeterReading?consumerID=${consumerID}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch meter readings: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || data || [];
}

/**
 * Fetch all meter readings (without filtering)
 */
export async function fetchAllMeterReadings(): Promise<MeterReading[]> {
  const url = `${API_BASE_URL}/api/ConsumerMeterReading`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch meter readings: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || data || [];
}

/**
 * Fetch specific meter reading by ID
 */
export async function fetchMeterReadingById(meterReadingID: number): Promise<MeterReading> {
  const url = `${API_BASE_URL}/api/ConsumerMeterReading/${meterReadingID}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch meter reading: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create a new meter reading
 */
export async function createMeterReading(data: CreateMeterReadingRequest): Promise<MeterReading> {
  const url = `${API_BASE_URL}/api/ConsumerMeterReading`;
  
  const body = JSON.stringify({
    isActive: data.isActive,
    createdBy: data.createdBy,
    consumerMeterID: data.consumerMeterID,
    consumerID: data.consumerID,
    billingCycleID: data.billingCycleID,
    previousReadingDate: data.previousReadingDate,
    previousReading: data.previousReading,
    currentReadingDate: data.currentReadingDate,
    currentReading: data.currentReading,
    readingStatusID: data.readingStatusID,
    readingSourceID: data.readingSourceID,
    markedForDeletion: data.markedForDeletion,
    approvedBy: data.approvedBy || "system",
    approvedDate: data.approvedDate || new Date().toISOString(),
    readingImagePath: data.readingImagePath || "",
    remark: data.remark
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Failed to create meter reading: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update an existing meter reading
 */
export async function updateMeterReading(data: UpdateMeterReadingRequest): Promise<MeterReading> {
  const url = `${API_BASE_URL}/api/ConsumerMeterReading/${data.meterReadingID}`;
  
  // Create FormData if image is included
  let body: FormData | string;
  let headers: Record<string, string>;

  if (data.readingImage) {
    const formData = new FormData();
    formData.append('meterReadingID', data.meterReadingID.toString());
    if (data.currentReadingDate) {
      formData.append('currentReadingDate', data.currentReadingDate);
    }
    if (data.currentReading !== undefined) {
      formData.append('currentReading', data.currentReading.toString());
    }
    if (data.readingStatusID !== undefined) {
      formData.append('readingStatusID', data.readingStatusID.toString());
    }
    if (data.remark) {
      formData.append('remark', data.remark);
    }
    formData.append('readingImage', data.readingImage);
    
    body = formData;
    headers = {}; // Let browser set content-type for FormData
  } else {
    const updatePayload: any = { meterReadingID: data.meterReadingID };
    if (data.currentReadingDate) updatePayload.currentReadingDate = data.currentReadingDate;
    if (data.currentReading !== undefined) updatePayload.currentReading = data.currentReading;
    if (data.readingStatusID !== undefined) updatePayload.readingStatusID = data.readingStatusID;
    if (data.remark) updatePayload.remark = data.remark;

    body = JSON.stringify(updatePayload);
    headers = {
      'Content-Type': 'application/json',
    };
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error(`Failed to update meter reading: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a meter reading
 */
export async function deleteMeterReading(meterReadingID: number): Promise<void> {
  const url = `${API_BASE_URL}/api/ConsumerMeterReading/${meterReadingID}`;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete meter reading: ${response.status} ${response.statusText}`);
  }
}

/**
 * Helper function to format meter reading for display
 */
export function formatMeterReadingForDisplay(reading: MeterReading) {
  const consumption = reading.totalUnit;
  const rate = 8.58; // Default rate per unit - should be configurable
  const waterCharges = consumption * rate;
  const totalAmount = waterCharges + (waterCharges * 0.18); // Adding 18% tax
  
  return {
    id: reading.meterReadingID,
    readingId: `RDG-${reading.meterReadingID}`,
    consumerID: reading.consumerID,
    previousReading: reading.previousReading.toString(),
    currentReading: reading.currentReading.toString(),
    consumption: reading.totalUnit,
    unit: reading.totalUnit, // Same as consumption for backward compatibility
    rate: rate,
    waterCharges: waterCharges,
    totalAmount: totalAmount,
    readingDate: new Date(reading.currentReadingDate).toLocaleDateString('en-GB'),
    date: new Date(reading.currentReadingDate).toLocaleDateString('en-GB'), // Alias for readingDate
    previousReadingDate: new Date(reading.previousReadingDate).toLocaleDateString('en-GB'),
    readingMonth: new Date(reading.currentReadingDate).toLocaleDateString('en-GB', { 
      month: 'short', 
      year: 'numeric' 
    }),
    status: reading.readingStatusID === 1 ? 'Approved' : reading.readingStatusID === 2 ? 'Pending' : 'Rejected',
    source: reading.readingSourceID === 1 ? 'Manual' : reading.readingSourceID === 2 ? 'Photo' : 'Auto',
    remark: reading.remark,
    isActive: reading.isActive,
    hasImage: !!reading.readingImagePath,
    imagePath: reading.readingImagePath,
    approvedBy: reading.approvedBy,
    approvedDate: reading.approvedDate ? new Date(reading.approvedDate).toLocaleDateString('en-GB') : null,
  };
}