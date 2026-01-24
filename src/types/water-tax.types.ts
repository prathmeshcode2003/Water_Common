export type CitizenPortalView =
  | "landing"
  | "login"
  | "otp"
  | "select-property"
  | "dashboard"
  | "passbook"
  | "submit-reading"
  | "grievances"
  | "calculator";

export type CitizenLookupKind = "name" | "mobile" | "consumerNo" | "propertyNo" | "unknown";

export interface WaterPortalBranding {
  corporationName: string;
  portalName: string;
  versionTag: string;
  systemStatus: "Aqua" | "Offline";
}

export interface WaterLandingStat {
  label: string;
  value: string;
  hint?: string;
}

export interface WaterCitizenLandingData {
  branding: WaterPortalBranding;
  heroKicker: string;
  heroTitleLine1: string;
  heroTitleAccent: string;
  heroTitleLine3: string;
  heroDescription: string;
  stats: WaterLandingStat[];
}

export interface WaterConnectionSummary {
  consumerID: number;
  consumerNumber: string;
  oldConsumerNumber: string;
  zoneNo: string;
  wardNo: string;
  propertyNumber: string;
  partitionNumber: string;
  consumerName: string;
  consumerNameEnglish: string;
  mobileNumber: string;
  emailID: string;
  address: string;
  addressEnglish: string;
  connectionTypeID: number;
  categoryID: number;
  pipeSizeID: number;
  connectionTypeName: string;
  categoryName: string;
  pipeSize: string;
  connectionDate: string;
  isActive: boolean;
  remark: string;
  createdDate: string;
  updatedDate: string;
}

// Backward compatibility - maps to old structure
export interface LegacyConnectionSummary {
  connectionId: string;
  consumerNo: string;
  propertyNo: string;
  ownerName: string;
  addressLine: string;
  ward?: string;
  status: "Active" | "Inactive";
}

export interface WaterCitizenCandidate {
  citizenId: string;
  displayName: string;
  mobileMasked: string;
  connections: WaterConnectionSummary[];
}

export interface CitizenAuthSession {
  sessionId: string;
  lookupQuery: string;
  lookupKind: CitizenLookupKind;

  otpTargetMasked: string;
  otp: string; // mock/demo only; in real system do not store OTP in plain text
  otpExpiresAtIso: string;

  citizenId?: string;
  selectedConnectionId?: string;
  connections?: WaterConnectionSummary[]; // Store API connections in session
}

// Add this interface for OTP verification result
export interface VerifyOtpResult {
  success: boolean;
  connections?: WaterConnectionSummary[];
  error?: string;
}
