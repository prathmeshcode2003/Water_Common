import { SharedWrapper } from "../SharedWrapper";

interface DashboardScreenSSRProps {
    user: any;
}

/**
 * DashboardScreenSSR - Server Component Wrapper
 * 
 * This server component prepares and validates data on the server,
 * then passes it to the SharedWrapper client component.
 */
export function DashboardScreenSSR({ user }: DashboardScreenSSRProps) {
    // Validate and prepare data on the server
    const allConnections = user?.connections || [];
    const selectedPropertyNumber = user?.selectedProperty || user?.propertyNumber || '';

    // Ensure connections have required IDs
    const connectionsWithIds = allConnections.map((conn: any, index: number) => ({
        ...conn,
        id: conn.id || conn.consumerID || conn.consumerNumber || `conn-${index}`,
    }));

    // Prepare user object for client component
    const preparedUser = {
        ...user,
        connections: connectionsWithIds,
        selectedProperty: selectedPropertyNumber,
        propertyNumber: selectedPropertyNumber,
    };

    // Use the single SharedWrapper with screen="dashboard"
    return <SharedWrapper screen="dashboard" user={preparedUser} />;
}

export default DashboardScreenSSR;
