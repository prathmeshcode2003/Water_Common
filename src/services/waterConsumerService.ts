/**
 * Service to interact with the Water Consumer API.
 * This file provides all API interactions for water tax citizen portal.
 * 
 * Available Functions:
 * - searchConsumer: Find consumers by mobile, property, name, etc.
 * - fetchMeterReadings: Get meter reading history for a connection
 * - submitMeterReading: Submit new meter reading with photo
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5268';

export interface WaterConsumerSearchParams {
  query: string; // mobile, property, consumer number, or owner name
}

function isMobileLike(q: string) {
  const digits = q.replace(/\D/g, "");
  return digits.length >= 10;
}

function detectQueryType(query: string) {
  const q = query.trim();
  if (!q) return "unknown";
  if (isMobileLike(q)) return "mobile";
  if (/^cns[-\s]?\d+/i.test(q)) return "consumerNo";
  if (/^prop[-\s]?\d+/i.test(q)) return "propertyNo";
  if (/^ward[-\s]?\d+/i.test(q)) return "wardNo"; 
  if (/^part[-\s]?\d+/i.test(q)) return "partitionNo";
  if (q.length >= 3) return "name";
  return "unknown";
}

function buildApiUrl(query: string): string {
  const baseUrl = `${API_BASE_URL}/api/CitizenLogin`;
  const queryType = detectQueryType(query);
  const cleanQuery = query.trim();
  
  switch (queryType) {
    case "mobile":
      // Extract only digits for mobile
      const mobileDigits = cleanQuery.replace(/\D/g, "");
      return `${baseUrl}?MobileNo=${encodeURIComponent(mobileDigits)}`;
    case "consumerNo":
      // Remove "cns" prefix if present
      const consumerNo = cleanQuery.replace(/^cns[-\s]?/i, "");
      return `${baseUrl}?ConsumerNo=${encodeURIComponent(consumerNo)}`;
    case "propertyNo":
      // Remove "prop" prefix if present
      const propertyNo = cleanQuery.replace(/^prop[-\s]?/i, "");
      return `${baseUrl}?PropertyNo=${encodeURIComponent(propertyNo)}`;
    case "wardNo":
      // Remove "ward" prefix if present
      const wardNo = cleanQuery.replace(/^ward[-\s]?/i, "");
      return `${baseUrl}?WardNo=${encodeURIComponent(wardNo)}`;
    case "partitionNo":
      // Remove "part" prefix if present
      const partitionNo = cleanQuery.replace(/^part[-\s]?/i, "");
      return `${baseUrl}?PartitionNo=${encodeURIComponent(partitionNo)}`;
    case "name":
      return `${baseUrl}?ConsumerName=${encodeURIComponent(cleanQuery)}`;
    default:
      // If we can't determine the type, try as consumer name
      return `${baseUrl}?ConsumerName=${encodeURIComponent(cleanQuery)}`;
  }
}

export async function searchConsumer(params: WaterConsumerSearchParams) {
  // Defensive: Ensure query is provided
  if (!params.query || params.query === "undefined") {
    throw new Error("No search query provided");
  }

  // Build URL with correct parameter based on query type
  const url = buildApiUrl(params.query);
  
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // For local dev with self-signed certs, you may need to allow insecure requests in your browser
  });

  if (!res.ok) {
    throw new Error("Failed to fetch consumer data");
  }

  return res.json();
}

/**
 * Fetch meter reading history for a specific connection
 */
export async function fetchMeterReadings(connectionId: string) {
  const url = `${API_BASE_URL}/api/MeterReadings?ConnectionId=${connectionId}`;
  
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch meter readings: ${res.status}`);
  }

  return res.json();
}

/**
 * Submit a new meter reading
 */
export async function submitMeterReading(formData: FormData) {
  const url = `${API_BASE_URL}/api/MeterReadings`;
  
  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failed to submit meter reading: ${res.status}`);
  }

  return res.json();
}
