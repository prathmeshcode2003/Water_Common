import { SharedWrapper } from "../SharedWrapper";

/**
 * Bill Calculator Screen - Server Component
 * Renders the bill calculator via SharedWrapper
 */
export function BillCalculatorScreenSSR({ user }: { user?: any }) {
    return <SharedWrapper screen="calculator" user={user} />;
}

export default BillCalculatorScreenSSR;