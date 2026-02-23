'use client';

import { useRouter } from 'next/navigation';
import { PropertySelector as PropertySelectorBase } from './PropertySelector';
import { ConnectionsList as ConnectionsListBase } from './ConnectionsList';

/**
 * PropertySelectorWrapper - Provides default handler for PropertySelector
 */
export function PropertySelectorWrapper(props: {
    properties: any[];
    currentProperty: string;
}) {
    const router = useRouter();

    const handlePropertyChange = (propertyNumber: string) => {
        router.push(`?view=dashboard&property=${propertyNumber}`);
    };

    return (
        <PropertySelectorBase
            {...props}
            onPropertyChange={handlePropertyChange}
        />
    );
}

/**
 * ConnectionsListWrapper - Provides default handlers for ConnectionsList
 */
export function ConnectionsListWrapper(props: {
    connections: any[];
    propertyNumber: string;
}) {
    const router = useRouter();

    const handlePaySelected = (connectionIds: string[], totalAmount: number) => {
        console.log('Pay selected:', connectionIds, totalAmount);
        // TODO: Navigate to payment page
        // router.push(`/water-tax/citizen/payment?connections=${connectionIds.join(',')}&amount=${totalAmount}`);
    };

    const handleViewDetails = (connection: any) => {
        console.log('View details:', connection);
        // TODO: Show details dialog
    };

    return (
        <ConnectionsListBase
            {...props}
            onPaySelected={handlePaySelected}
            onViewDetails={handleViewDetails}
        />
    );
}
