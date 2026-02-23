import { SharedWrapper } from "../SharedWrapper";

/**
 * Passbook Screen - Server Component
 * Displays bill payment history and transaction passbook
 * 
 * This SSR wrapper:
 * 1. Receives user data from page.tsx (server-side)
 * 2. Passes it to SharedWrapper (client component)
 * 3. SharedWrapper then renders PassbookScreen with navigation handlers
 */
export function PassbookScreenSSR({ user }: { user: any }) {
    return <SharedWrapper screen="passbook" user={user} />;
}

export default PassbookScreenSSR;
