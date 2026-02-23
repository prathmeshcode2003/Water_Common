import {
  LandingScreenSSR,
  LoginScreenSSR,
  OtpScreenSSR,
  DashboardScreenSSR,
  PassbookScreenSSR,
  GrievancesScreenSSR,
  BillCalculatorScreenSSR,
  SharedWrapper,
} from '@/components/modules/water-tax/screens/index';
import { getCitizenSession } from '../actions';

/**
 * WaterTaxCitizenPage - Main Entry Point for Water Tax Citizen Module
 * 
 * Server-side rendered page that handles view transitions:
 * Landing -> Login -> OTP -> Dashboard -> Other screens
 * 
 * All post-login screens use SharedWrapper as the single client wrapper.
 * Pre-login screens (landing, login, otp) use their own SSR components.
 */
export default async function WaterTaxCitizenPage({
  searchParams
}: {
  searchParams: Promise<{ view?: string; err?: string }>
}) {
  const { view, err } = await searchParams;
  const session = await getCitizenSession();

  // Determine current view
  const currentView = view || 'landing';

  // Debug: Log session state (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Current View:', currentView);
    console.log('🔍 Session:', session ? {
      citizenId: session.citizenId,
      hasConnections: !!session.connections,
      connectionsCount: session.connections?.length || 0,
      selectedConnectionId: session.selectedConnectionId,
    } : 'No session');
  }

  // Protected views that require a valid session
  const protectedViews = ['dashboard', 'passbook', 'submitReading', 'grievances', 'calculator'];

  // Security: Redirect to login if trying to access protected views without session
  if (protectedViews.includes(currentView) && (!session || !session.citizenId || !session.connections || session.connections.length === 0)) {
    console.error('❌ Protected view access denied:', {
      view: currentView,
      hasSession: !!session,
      hasCitizenId: !!session?.citizenId,
      hasConnections: !!session?.connections,
      connectionsCount: session?.connections?.length || 0,
    });
    return <LoginScreenSSR error="session" />;
  }

  // OTP view requires lookup session
  if (currentView === 'otp' && !session?.otpTargetMasked) {
    return <LoginScreenSSR error="session" />;
  }

  // Prepare user object for protected screens
  let user: any = null;
  if (session && session.citizenId && session.connections) {
    user = {
      citizenId: session.citizenId,
      selectedProperty: session.selectedConnectionId || session.connections[0]?.consumerID,
      propertyNumber: session.selectedConnectionId || session.connections[0]?.consumerID,
      allProperties: session.connections.map((conn: any) => ({
        propertyNumber: conn.propertyNo || conn.propertyNumber || conn.consumerID || conn.consumerNumber,
        address: conn.addressEnglish || conn.address || 'N/A',
        connectionCount: 1,
      })),
      connections: session.connections,
    };
  }

  // Render appropriate screen based on view
  switch (currentView) {
    case 'login':
      return <LoginScreenSSR error={err} />;

    case 'otp':
      return (
        <OtpScreenSSR
          otpTargetMasked={session?.otpTargetMasked || 'your registered contact'}
          lookupQuery={session?.lookupQuery}
        />
      );

    case 'dashboard':
      console.log('✅ Rendering Dashboard with user:', {
        citizenId: user.citizenId,
        propertiesCount: user.allProperties.length,
        connectionsCount: user.connections.length,
      });
      return <DashboardScreenSSR user={user} />;

    case 'passbook':
      console.log('✅ Rendering Passbook');
      return <PassbookScreenSSR user={user} />;

    case 'submitReading':
      console.log('✅ Rendering Submit Reading');
      return <SharedWrapper screen="submitReading" user={user} />;

    case 'grievances':
      console.log('✅ Rendering Grievances');
      return <GrievancesScreenSSR user={user} />;

    case 'calculator':
      console.log('✅ Rendering Calculator');
      return <BillCalculatorScreenSSR user={user} />;

    case 'landing':
    default:
      return <LandingScreenSSR />;
  }
}
