import { SharedWrapper } from "../SharedWrapper";

/**
 * Grievances Screen - Server Component
 * Displays and manages user grievances via SharedWrapper
 */
export function GrievancesScreenSSR({ user }: { user?: any }) {
    return <SharedWrapper screen="grievances" user={user} />;
}

export default GrievancesScreenSSR;
