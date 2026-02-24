/**
 * Service to interact with the Water Consumer API.
 * This function should only be called ONCE per OTP verification.
 */
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
  const baseUrl = "http://localhost:5268/api/CitizenLogin";
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
