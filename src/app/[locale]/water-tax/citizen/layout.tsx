import { getCitizenLandingData, getCitizenSession } from '../actions';
import { CitizenPortalLayout } from '@/components/layout/citizen/CitizenPortalLayout';

/**
 * Layout for Water Tax Citizen Portal
 * 
 * Wraps all citizen portal pages with the CitizenPortalLayout component.
 * Provides consistent header, footer, and navigation with user profile info.
 */
export default async function WaterTaxCitizenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const landingData = await getCitizenLandingData();
    const session = await getCitizenSession();

    // Only create user object if we have a valid session with connections
    // This ensures user profile only shows after successful login (not on landing/login/otp screens)
    const user = session?.connections?.[0] && session.citizenId ? {
        consumerNameEnglish: (session.connections[0] as any).consumerNameEnglish || (session.connections[0] as any).consumerName,
        mobileNo: (session.connections[0] as any).mobileNumber || (session.connections[0] as any).mobileNo,
        wardNo: (session.connections[0] as any).wardNo || (session.connections[0] as any).wardName,
        propertyNo: (session.connections[0] as any).propertyNo || (session.connections[0] as any).propertyNumber,
        addressEnglish: (session.connections[0] as any).addressEnglish || (session.connections[0] as any).address,
        emailID: (session.connections[0] as any).emailID,
    } : null;

    return (
        <CitizenPortalLayout
            branding={landingData.branding}
            showPortalButtons={true}
            user={user}
        >
            {children}
        </CitizenPortalLayout>
    );
}
