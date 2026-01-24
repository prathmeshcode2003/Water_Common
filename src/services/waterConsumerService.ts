/**
 * Service to interact with the Water Consumer API.
 * This function should only be called ONCE per OTP verification.
 */
export interface WaterConsumerSearchParams {
  query: string; // mobile, property, consumer number, or owner name
}

export async function searchConsumer(params: WaterConsumerSearchParams) {
  // Defensive: Ensure query is provided
  if (!params.query || params.query === "undefined") {
    throw new Error("No search query provided");
  }

  // Call the backend API endpoint directly (bypass Next.js API route)
  const url = `https://localhost:44346/api/wtis/search-consumer?SearchTerm=${encodeURIComponent(params.query)}`;
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
