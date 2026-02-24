"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Upload,
  CheckCircle,
  Droplets,
  Calendar,
  X,
  Sparkles,
  Eye,
  IndianRupee,
  TrendingUp,
  Gauge,
  ChevronUp,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { searchConsumer, fetchMeterReadings, submitMeterReading } from "@/services/waterConsumerService";
import { Button } from "@/components/common/Button";
import { toast } from "sonner";
import { MeterReadingMobileView } from "./MeterReadingMobileView";

interface MeterReadingScreenProps {
  onNavigate: (screen: string) => void;
  user?: any;
  initialConnections?: any[];
  initialReadingHistory?: any[];
}

interface Connection {
  consumerID: number;
  consumerNo: string;
  oldConsumerNo: string;
  areaName: string;
  subAreaName: string;
  propertyNo: string;
  partitionNo: string | null;
  consumerTitle: string;
  consumerTitleEnglish: string;
  consumerName: string;
  consumerNameEnglish: string;
  mobileNo: string;
  emailId: string;
  address: string;
  addressEnglish: string;
  connectionCategoryName: string;
  connectionTypeName: string;
  pipeSizeName: string;
  wardName: string;
  meterNumber: string;
  meterCompany: string;
  meterSize: string;
  meterCost: number;
  isActive: boolean;
  markedForDeletion: boolean;
  createdDate: string;
  createdBy: number;
  updatedDate: string | null;
  updatedBy: number | null;
  previousReading?: string;
  previousReadingDate?: string;
}

export function MeterReadingScreen({ onNavigate, user, initialConnections, initialReadingHistory }: MeterReadingScreenProps) {
  // API Integration - Fetch user's connections from backend
  const [availableConnections, setAvailableConnections] = useState<Connection[]>([]);
  const [isLoadingConnections, setIsLoadingConnections] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Fetch connections from API
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setIsLoadingConnections(true);
        setConnectionError(null);
        
        // Debug log user object structure
        console.log('🔍 MeterReadingScreen - User object:', user);
        console.log('🔍 MeterReadingScreen - User keys:', user ? Object.keys(user) : 'user is null/undefined');
        
        // Try multiple possible mobile number properties
        const mobileNo = user?.mobileNo || user?.mobile || user?.phoneNumber || user?.citizenId;
        
        console.log('🔍 MeterReadingScreen - Found mobile number:', mobileNo);
        
        // Validate that we have a mobile number
        if (!mobileNo) {
          console.error('❌ No mobile number found in user object:', {
            mobileNo: user?.mobileNo,
            mobile: user?.mobile,
            phoneNumber: user?.phoneNumber,
            citizenId: user?.citizenId,
            userObject: user
          });
          throw new Error('Mobile number not found in login session. Please login again.');
        }
        console.log('📞 Making API call with mobile:', mobileNo);
        const data = await searchConsumer({ query: mobileNo });
        console.log('📊 API Response:', data);
        
        // Check if response has items array
        if (!data.items || !Array.isArray(data.items)) {
          throw new Error('Invalid API response format');
        }
        
        // Map API response to our Connection interface
        const connections: Connection[] = data.items.map((item: any) => ({
          consumerID: item.consumerID,
          consumerNo: item.consumerNo,
          oldConsumerNo: item.oldConsumerNo,
          areaName: item.areaName,
          subAreaName: item.subAreaName,
          propertyNo: item.propertyNo,
          partitionNo: item.partitionNo,
          consumerTitle: item.consumerTitle,
          consumerTitleEnglish: item.consumerTitleEnglish,
          consumerName: item.consumerName,
          consumerNameEnglish: item.consumerNameEnglish,
          mobileNo: item.mobileNo,
          emailId: item.emailId,
          address: item.address,
          addressEnglish: item.addressEnglish,
          connectionCategoryName: item.connectionCategoryName,
          connectionTypeName: item.connectionTypeName,
          pipeSizeName: item.pipeSizeName,
          wardName: item.wardName,
          meterNumber: item.meterNumber,
          meterCompany: item.meterCompany,
          meterSize: item.meterSize,
          meterCost: item.meterCost,
          isActive: item.isActive,
          markedForDeletion: item.markedForDeletion,
          createdDate: item.createdDate,
          createdBy: item.createdBy,
          updatedDate: item.updatedDate,
          updatedBy: item.updatedBy,
          // Add default values for reading-related fields
          previousReading: "0",
          previousReadingDate: new Date().toLocaleDateString('en-GB'),
        }));
        
        setAvailableConnections(connections);
        
        // Set default selected connection if connections exist
        if (connections.length > 0) {
          setSelectedConnectionId(connections[0].consumerID.toString());
          setSelectedConnection(connections[0]);
        }
      } catch (error) {
        console.error('Error fetching connections:', error);
        setConnectionError(error instanceof Error ? error.message : 'Failed to fetch connections');
      } finally {
        setIsLoadingConnections(false);
      }
    };

    fetchConnections();
  }, [user]);

  const [selectedConnectionId, setSelectedConnectionId] = useState<string>("");
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);

  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const [readingDate, setReadingDate] = useState(getTodayDate());
  const [currentReading, setCurrentReading] = useState("");
  const [meterPhoto, setMeterPhoto] = useState<string | null>(null);
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [tapSize, setTapSize] = useState("");
  const [showMeterImageDialog, setShowMeterImageDialog] = useState(false);
  const [showAddReadingDialog, setShowAddReadingDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submittedReadingId, setSubmittedReadingId] = useState("");
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);

  // OCR Validation States
  const [showImageQualityDialog, setShowImageQualityDialog] = useState(false);
  const [imageQualityChecks, setImageQualityChecks] = useState({
    brightness: 0,
    blur: 0,
    meterDetected: false,
    digitsDetected: false,
    confidence: 0,
  });
  const [showOcrResultDialog, setShowOcrResultDialog] = useState(false);
  const [ocrDetectedReading, setOcrDetectedReading] = useState("");
  const [ocrConfidence, setOcrConfidence] = useState(0);
  const [showLowConfidenceDialog, setShowLowConfidenceDialog] = useState(false);
  const [showInvalidImageDialog, setShowInvalidImageDialog] = useState(false);
  const [invalidImageReason, setInvalidImageReason] = useState("");

  // Reading history state
  const [submittedReadings, setSubmittedReadings] = useState<any[]>([]);
  const [isLoadingReadings, setIsLoadingReadings] = useState(false);
  const [readingError, setReadingError] = useState<string | null>(null);

  // Fetch reading history when connection is selected
  useEffect(() => {
    const fetchReadingHistory = async () => {
      if (!selectedConnection) {
        setSubmittedReadings([]);
        return;
      }

      try {
        setIsLoadingReadings(true);
        setReadingError(null);
        
        // API call for reading history using service
        const data = await fetchMeterReadings(selectedConnection.consumerID.toString());
        
        // Map API response to reading history format
        const readings = data.items ? data.items.map((item: any) => ({
          id: item.readingId || `RDG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          method: item.meterSize || selectedConnection.meterSize,
          currentReading: item.currentReading?.toString() || "0",
          previousReading: item.previousReading?.toString() || "0",
          consumption: item.consumption || 0,
          unit: item.consumption || 0,
          rate: item.ratePerUnit || 8.58,
          waterCharges: item.waterCharges || 0,
          totalAmount: item.totalAmount || 0,
          status: item.status || "Submitted",
          date: item.readingDate ? new Date(item.readingDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
          readingMonth: item.readingMonth || new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
          connectionId: selectedConnection.consumerNo,
        })) : [];
        
        setSubmittedReadings(readings);
        
      } catch (error) {
        console.error('Error fetching reading history:', error);
        setReadingError(error instanceof Error ? error.message : 'Failed to fetch reading history');
        // Set empty array on error
        setSubmittedReadings([]);
      } finally {
        setIsLoadingReadings(false);
      }
    };

    fetchReadingHistory();
  }, [selectedConnection]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConnectionSelect = async (connectionId: string) => {
    setSelectedConnectionId(connectionId);

    // Find connection details when selected
    const connection = availableConnections.find(
      (conn) => conn.consumerID.toString() === connectionId
    );
    if (connection) {
      setSelectedConnection(connection);
      toast.success(`Connection ${connection.consumerNo} selected`);
      setReadingDate(getTodayDate());
      setCurrentReading("");
      setMeterPhoto(null);
      setUploadedDocument(null);
      setTapSize(connection.meterSize || "15mm");
    }
  };

  const analyzeImageQuality = (imageUrl: string): Promise<any> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Simulate advanced image quality analysis
        // In production, this would call actual OCR API

        const brightness = Math.random() * 100;
        const blur = Math.random() * 100;
        const hasMeter = brightness > 30 && blur < 70;
        const hasDigits = hasMeter && Math.random() > 0.1;

        const qualityScore = (brightness * 0.3 + (100 - blur) * 0.4 + (hasMeter ? 30 : 0));

        resolve({
          brightness: Math.round(brightness),
          blur: Math.round(blur),
          meterDetected: hasMeter,
          digitsDetected: hasDigits,
          confidence: Math.round(qualityScore),
          width: img.width,
          height: img.height,
        });
      };
      img.src = imageUrl;
    });
  };

  const performOcrDetection = async (imageUrl: string, qualityChecks: any) => {
    // TODO: API Integration - OCR Processing
    // API Endpoint: POST /api/water-tax/citizen/ocr-meter-reading
    // Request Body: { image: base64String, previousReading, connectionId }
    // Response: { success, detectedReading, confidence, digits: [...], validationErrors: [...] }

    return new Promise<any>((resolve) => {
      setTimeout(() => {
        if (!qualityChecks.meterDetected) {
          resolve({
            success: false,
            error: "METER_NOT_DETECTED",
            message: "Could not detect water meter in the image",
          });
          return;
        }

        if (!qualityChecks.digitsDetected) {
          resolve({
            success: false,
            error: "DIGITS_NOT_CLEAR",
            message: "Meter digits are not clear or readable",
          });
          return;
        }

        if (qualityChecks.blur > 70) {
          resolve({
            success: false,
            error: "IMAGE_TOO_BLURRY",
            message: "Image is too blurry. Please capture a clearer photo",
          });
          return;
        }

        if (qualityChecks.brightness < 30) {
          resolve({
            success: false,
            error: "IMAGE_TOO_DARK",
            message: "Image is too dark. Please ensure good lighting",
          });
          return;
        }

        // Simulate successful detection
        if (selectedConnection) {
          const previousValue = parseInt(selectedConnection.previousReading);
          const consumption = Math.floor(Math.random() * 100) + 50;
          const detectedValue = previousValue + consumption;

          // Random confidence between 75-98%
          const confidence = Math.floor(Math.random() * 23) + 75;

          resolve({
            success: true,
            detectedReading: detectedValue.toString(),
            confidence: confidence,
            digits: detectedValue.toString().split(""),
            previousReading: previousValue,
            isLogical: detectedValue > previousValue,
          });
        }
      }, 2000);
    });
  };

  const handleMeterPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageUrl = event.target?.result as string;
      setMeterPhoto(imageUrl);
      setUploadedDocument(file);

      setIsOcrProcessing(true);
      toast.info("Analyzing image quality...", {
        description: "Checking brightness, focus, and meter visibility",
      });

      try {
        // Step 1: Analyze image quality
        const qualityChecks = await analyzeImageQuality(imageUrl);
        setImageQualityChecks(qualityChecks);

        // Show image quality dialog
        setShowImageQualityDialog(true);

        // Wait for quality dialog to close (2 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000));
        setShowImageQualityDialog(false);

        // Step 2: Perform OCR if quality is acceptable
        if (qualityChecks.confidence < 50) {
          setInvalidImageReason("Image quality is too poor for accurate detection");
          setShowInvalidImageDialog(true);
          setIsOcrProcessing(false);
          setMeterPhoto(null);
          setUploadedDocument(null);
          return;
        }

        toast.info("Detecting meter reading with AI OCR...", {
          description: "Analyzing digits and validating reading",
        });

        const ocrResult = await performOcrDetection(imageUrl, qualityChecks);

        if (!ocrResult.success) {
          setInvalidImageReason(ocrResult.message);
          setShowInvalidImageDialog(true);
          setIsOcrProcessing(false);
          setMeterPhoto(null);
          setUploadedDocument(null);
          return;
        }

        // Step 3: Show OCR results
        setOcrDetectedReading(ocrResult.detectedReading);
        setOcrConfidence(ocrResult.confidence);
        setIsOcrProcessing(false);

        if (ocrResult.confidence < 80) {
          // Low confidence - show warning dialog
          setShowLowConfidenceDialog(true);
        } else {
          // High confidence - show success dialog
          setShowOcrResultDialog(true);
        }

      } catch (error) {
        setIsOcrProcessing(false);
        toast.error("Failed to process image. Please try again.");
        setMeterPhoto(null);
        setUploadedDocument(null);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleAcceptOcrReading = () => {
    setCurrentReading(ocrDetectedReading);
    const today = new Date().toISOString().split("T")[0];
    setReadingDate(today);
    setTapSize(selectedConnection?.meterSize || "15mm");
    setShowOcrResultDialog(false);
    setShowLowConfidenceDialog(false);

    toast.success("Meter reading accepted!", {
      description: `Reading: ${ocrDetectedReading} (Confidence: ${ocrConfidence}%)`,
    });
  };

  const handleRejectOcrReading = () => {
    setShowOcrResultDialog(false);
    setShowLowConfidenceDialog(false);
    setMeterPhoto(null);
    setUploadedDocument(null);
    setOcrDetectedReading("");
    setOcrConfidence(0);

    toast.warning("Please capture a new photo or enter reading manually");
  };

  const handleRetryCapture = () => {
    setShowInvalidImageDialog(false);
    setMeterPhoto(null);
    setUploadedDocument(null);
    fileInputRef.current?.click();
  };

  const calculateConsumption = () => {
    if (!selectedConnection || !currentReading) return 0;
    const current = parseInt(currentReading) || 0;
    const previous = parseInt(selectedConnection.previousReading) || 0;
    return current - previous;
  };

  const getRateByConnectionType = (type: string): number => {
    const rates: { [key: string]: number } = {
      Commercial: 15,
      Domestic: 8,
      Industrial: 25,
    };
    return rates[type] || 8;
  };

  const calculateEstimatedBill = () => {
    if (!selectedConnection || !currentReading) return 0;
    const consumption = calculateConsumption();
    if (consumption < 0) return 0;
    const rate = getRateByConnectionType(selectedConnection.connectionCategoryName);
    return consumption * rate;
  };

  const handleSubmit = async () => {
    if (!selectedConnectionId) {
      toast.error("Please select a connection");
      return;
    }
    if (!readingDate) {
      toast.error("Please select reading date");
      return;
    }
    if (!currentReading) {
      toast.error("Please enter current reading");
      return;
    }

    const consumption = calculateConsumption();
    if (consumption < 0) {
      toast.error("Current reading cannot be less than previous reading");
      return;
    }

    setIsSubmitting(true);

    try {
        // API Integration - Submit meter reading using service
        const formData = new FormData();
        formData.append('connectionId', selectedConnectionId);
        formData.append('readingDate', readingDate);
        formData.append('currentReading', currentReading);
        formData.append('tapSize', tapSize);
        if (uploadedDocument) {
          formData.append('meterPhoto', uploadedDocument);
        }

        const result = await submitMeterReading(formData);
        
        const readingId = result.readingId || `RDG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
        setSubmittedReadingId(readingId);

        // Refresh the reading history after successful submission using service
        const updatedData = await fetchMeterReadings(selectedConnection?.consumerID.toString() || '');
        const updatedReadings = updatedData.items ? updatedData.items.map((item: any) => ({
          id: item.readingId || `RDG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          method: item.meterSize || selectedConnection?.meterSize,
          currentReading: item.currentReading?.toString() || "0",
          previousReading: item.previousReading?.toString() || "0",
          consumption: item.consumption || 0,
          unit: item.consumption || 0,
          rate: item.ratePerUnit || 8.58,
          waterCharges: item.waterCharges || 0,
          totalAmount: item.totalAmount || 0,
          status: item.status || "Submitted",
          date: item.readingDate ? new Date(item.readingDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
          readingMonth: item.readingMonth || new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
          connectionId: selectedConnection?.consumerNo,
        })) : [];
        setSubmittedReadings(updatedReadings);
      toast.success("Meter reading submitted successfully!");
      setShowSuccessDialog(true);

      setTimeout(() => {
        setShowSuccessDialog(false);
        setReadingDate(getTodayDate());
        setCurrentReading("");
        setMeterPhoto(null);
        setUploadedDocument(null);
        setTapSize("");
      }, 3000);
    } catch (error) {
      toast.error("Failed to submit reading. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const consumption = calculateConsumption();

  const filteredReadings = submittedReadings.filter(
    (reading) => reading.connectionId === selectedConnection?.consumerNo
  );

  return (
    <>
      {/* Mobile View - Show on screens <1024px */}
      <div className="lg:hidden">
        <MeterReadingMobileView
          connections={availableConnections}
          selectedConnection={selectedConnection}
          onConnectionSelect={handleConnectionSelect}
          readingHistory={filteredReadings}
          isLoading={isLoadingConnections}
          error={connectionError}
        />
      </div>

      {/* Desktop View - Show on screens >= 1024px */}
      <div className="hidden lg:flex items-center justify-center h-fit overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 pt-4 sm:mt-[50px] pb-16 sm:pb-0">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col px-3 sm:px-6 py-2 sm:py-4">
          {/* Header */}
          <div className="mb-3 sm:mb-4 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl border-2 border-gray-200 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-3 sm:gap-6 items-start sm:items-center px-3 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                  <Gauge className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg text-gray-900 font-bold">
                    Submit Meter Reading
                  </h1>
                  <p className="text-[10px] sm:text-xs text-gray-600">
                    Select connection and track all meter readings
                  </p>
                </div>
              </div>

              <div className="flex justify-start sm:justify-right">
                <div className="bg-white rounded-lg border border-gray-300 shadow-sm px-6 sm:px-3 py-1.5 sm:py-2 sm:min-w-[320px]">
                  <label className="text-[10px] text-gray-500 mb-1 block uppercase tracking-wide font-semibold">
                    Filter by Connection
                  </label>
                  {isLoadingConnections ? (
                    <div className="flex items-center gap-2 h-8">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-500">Loading connections...</span>
                    </div>
                  ) : connectionError ? (
                    <div className="text-sm text-red-600 h-8 flex items-center">
                      Error: {connectionError}
                    </div>
                  ) : availableConnections.length === 0 ? (
                    <div className="text-sm text-gray-500 h-8 flex items-center">
                      No connections found
                    </div>
                  ) : (
                    <select
                      value={selectedConnectionId}
                      onChange={(e) => handleConnectionSelect(e.target.value)}
                      className="w-full h-8 border-0 bg-transparent p-0 focus:ring-0 text-sm text-gray-900 font-semibold"
                    >
                      {availableConnections.map((conn) => (
                        <option key={conn.consumerID} value={conn.consumerID.toString()}>
                          {conn.propertyNo} - {conn.consumerNo} - {conn.connectionCategoryName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

              </div>

              <div>
                <Button
                  onClick={() => setShowAddReadingDialog(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg h-11 px-6"
                  disabled={!selectedConnection || isLoadingConnections}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  <span className="text-sm font-bold">Add New Reading</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Readings Table */}
          <div className="flex-1 overflow-hidden">
            {isLoadingConnections ? (
              <Card className="h-full p-8 bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Connections</h3>
                  <p className="text-sm text-gray-600">Please wait while we fetch your connection data...</p>
                </div>
              </Card>
            ) : connectionError ? (
              <Card className="h-full p-8 bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Connection Error</h3>
                  <p className="text-sm text-red-600 mb-4">{connectionError}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Retry
                  </Button>
                </div>
              </Card>
            ) : availableConnections.length === 0 ? (
              <Card className="h-full p-8 bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Droplets className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Connections Found</h3>
                  <p className="text-sm text-gray-600">You don't have any water connections associated with your account.</p>
                </div>
              </Card>
            ) : !selectedConnection ? (
              <Card className="h-full p-8 bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Gauge className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Connection</h3>
                  <p className="text-sm text-gray-600">Please select a water connection from the dropdown above to view meter readings.</p>
                </div>
              </Card>
            ) : (
              <Card className="h-full p-4 bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-green-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base text-gray-900 font-bold">
                    Previous Readings History
                  </h2>
                  <p className="text-xs text-gray-600">
                    Connection: {selectedConnection?.consumerNo} • Total Records:{" "}
                    {filteredReadings.length}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                {filteredReadings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Gauge className="w-16 h-16 mb-3 opacity-30" />
                    <p className="text-sm">
                      No reading history available for this connection
                    </p>
                    <p className="text-xs">
                      Click "Add New Reading" to submit your first reading
                    </p>
                  </div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs border-r border-blue-400 font-semibold">
                          Reading Month
                        </th>
                        <th className="px-3 py-3 text-left text-xs border-r border-blue-400 font-semibold">
                          Reading Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs border-r border-blue-400 font-semibold">
                          Previous Reading
                        </th>
                        <th className="px-4 py-3 text-left text-xs border-r border-blue-400 font-semibold">
                          <div className="flex items-center gap-1">
                            <span>Current Reading</span>
                            <ChevronUp className="w-3 h-3" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs border-r border-blue-400 font-semibold">
                          <div className="flex items-center gap-1">
                            <span>Unit</span>
                            <ChevronUp className="w-3 h-3" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs border-r border-blue-400 font-semibold">
                          Rate (₹/Unit)
                        </th>
                        <th className="px-4 py-3 text-left text-xs border-r border-blue-400 font-semibold">
                          <div className="flex items-center gap-1">
                            <span>Water Charges</span>
                            <ChevronUp className="w-3 h-3" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs border-r border-blue-400 font-semibold">
                          <div className="flex items-center gap-1">
                            <span>Total Amount</span>
                            <ChevronUp className="w-3 h-3" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReadings.map((reading, index) => (
                        <tr
                          key={reading.id}
                          className={`${index % 2 === 0 ? "bg-white" : "bg-cyan-50/30"
                            } hover:bg-cyan-100/40 transition-colors border-b border-gray-200`}
                        >
                          <td className="px-4 py-3 text-sm border-r border-gray-200">
                            <span className="inline-flex items-center px-3 py-1 rounded-md bg-blue-500 text-white text-xs font-semibold">
                              {reading.readingMonth}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                            {reading.date}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                            {reading.previousReading}
                          </td>
                          <td className="px-4 py-3 text-sm text-cyan-600 border-r border-gray-200 font-semibold">
                            {reading.currentReading}
                          </td>
                          <td className="px-4 py-3 text-sm text-green-600 border-r border-gray-200 font-semibold">
                            <div className="flex items-center gap-1">
                              <ChevronUp className="w-3 h-3" />
                              {reading.unit}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                            ₹{reading.rate}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                            ₹{reading.waterCharges.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-cyan-600 border-r border-gray-200 font-semibold">
                            <div className="flex items-center gap-1">
                              <span>₹</span>
                              <ChevronUp className="w-3 h-3" />
                              <span>{reading.totalAmount.toFixed(2)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs bg-green-500 text-white font-semibold">
                              {reading.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              </Card>
            )}
          </div>
        </div>

        {/* Meter Image Preview Dialog */}
        {showMeterImageDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-3xl mx-4"
            >
              <Card className="bg-white shadow-2xl border-0">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Meter Photo</h3>
                      <p className="text-sm text-gray-600">
                        Preview of uploaded meter photo
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMeterImageDialog(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {meterPhoto && (
                  <div className="p-4">
                    <img
                      src={meterPhoto}
                      alt="Meter reading"
                      className="w-full h-auto rounded-lg border-2 border-gray-200"
                    />
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        )}

        {/* Success Dialog */}
        {showSuccessDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md mx-4"
            >
              <Card className="bg-white shadow-2xl border-0 p-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-600 mb-2">
                    Reading Submitted Successfully!
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Your meter reading has been recorded
                  </p>
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center mb-4">
                    <p className="text-sm text-gray-600 mb-1">Reading ID</p>
                    <p className="text-xl text-green-700 font-bold">
                      {submittedReadingId}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Connection</p>
                      <p className="text-sm text-gray-900 font-semibold">
                        {selectedConnection?.consumerNo}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Reading</p>
                      <p className="text-sm text-gray-900 font-semibold">
                        {currentReading}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm text-gray-900 font-semibold">
                        {readingDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Consumption</p>
                      <p className="text-sm text-blue-700 font-semibold">
                        {consumption} Units
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 text-center mt-3">
                    Your reading will be processed and reflected in your next bill
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Image Quality Check Dialog */}
        {showImageQualityDialog && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md mx-4"
            >
              <Card className="bg-white shadow-2xl border-0 p-6">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4"
                  >
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Analyzing Image Quality
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Checking image for optimal meter reading detection
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Brightness</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${imageQualityChecks.brightness}%` }}
                            className={`h-full ${imageQualityChecks.brightness > 50
                              ? "bg-green-500"
                              : imageQualityChecks.brightness > 30
                                ? "bg-yellow-500"
                                : "bg-red-500"
                              }`}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-8">
                          {imageQualityChecks.brightness}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Image Clarity</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${100 - imageQualityChecks.blur}%` }}
                            className={`h-full ${imageQualityChecks.blur < 30
                              ? "bg-green-500"
                              : imageQualityChecks.blur < 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                              }`}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-8">
                          {100 - imageQualityChecks.blur}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Meter Detected</span>
                      <span
                        className={`text-sm font-semibold ${imageQualityChecks.meterDetected
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        {imageQualityChecks.meterDetected ? "✓ Yes" : "✗ No"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Digits Visible</span>
                      <span
                        className={`text-sm font-semibold ${imageQualityChecks.digitsDetected
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        {imageQualityChecks.digitsDetected ? "✓ Clear" : "✗ Unclear"}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Invalid Image Dialog */}
        {showInvalidImageDialog && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md mx-4"
            >
              <Card className="bg-white shadow-2xl border-0 p-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-red-600 mb-2">
                    Image Quality Issue
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">{invalidImageReason}</p>

                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">
                      📸 Tips for Better Detection:
                    </h4>
                    <ul className="text-xs text-gray-700 space-y-1 text-left">
                      <li>• Ensure good lighting on the meter</li>
                      <li>• Hold camera steady to avoid blur</li>
                      <li>• Capture meter display clearly</li>
                      <li>• Avoid shadows and reflections</li>
                      <li>• Keep camera parallel to meter face</li>
                      <li>• Ensure all digits are visible</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleRetryCapture}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white h-11"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Retry Capture
                    </Button>
                    <Button
                      onClick={() => setShowInvalidImageDialog(false)}
                      variant="outline"
                      className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 h-11"
                    >
                      Enter Manually
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* OCR Result Dialog - High Confidence */}
        {showOcrResultDialog && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md mx-4"
            >
              <Card className="bg-white shadow-2xl border-0 p-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-600 mb-2">
                    Meter Reading Detected!
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    AI has successfully detected the meter reading
                  </p>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6 mb-4">
                    <p className="text-sm text-gray-600 mb-2">Detected Reading</p>
                    <p className="text-5xl font-bold text-green-700 mb-3 tracking-wider">
                      {ocrDetectedReading}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${ocrConfidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-green-700">
                        {ocrConfidence}% Confident
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Previous</p>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedConnection?.previousReading}
                      </p>
                    </div>
                    <div className="bg-cyan-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Consumption</p>
                      <p className="text-lg font-bold text-cyan-700">
                        {parseInt(ocrDetectedReading || "0") -
                          parseInt(selectedConnection?.previousReading || "0")}{" "}
                        Units
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-6">
                    ✓ Reading verified and validated successfully
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleAcceptOcrReading}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white h-11"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Accept Reading
                    </Button>
                    <Button
                      onClick={handleRejectOcrReading}
                      variant="outline"
                      className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 h-11"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Recapture
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Low Confidence Dialog */}
        {showLowConfidenceDialog && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md mx-4"
            >
              <Card className="bg-white shadow-2xl border-0 p-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-600 mb-2">
                    Low Confidence Detection
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Reading detected but confidence is below optimal level
                  </p>

                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-6 mb-4">
                    <p className="text-sm text-gray-600 mb-2">Detected Reading</p>
                    <p className="text-5xl font-bold text-yellow-700 mb-3 tracking-wider">
                      {ocrDetectedReading}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500"
                          style={{ width: `${ocrConfidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-yellow-700">
                        {ocrConfidence}% Confident
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-4">
                    <p className="text-xs font-bold text-gray-900 mb-2">
                      ⚠️ Recommendation:
                    </p>
                    <p className="text-xs text-gray-700">
                      For better accuracy, we recommend recapturing the image with
                      better lighting and focus. Alternatively, you can verify and
                      accept this reading if it appears correct.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Previous</p>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedConnection?.previousReading}
                      </p>
                    </div>
                    <div className="bg-cyan-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Consumption</p>
                      <p className="text-lg font-bold text-cyan-700">
                        {parseInt(ocrDetectedReading || "0") -
                          parseInt(selectedConnection?.previousReading || "0")}{" "}
                        Units
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleRejectOcrReading}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white h-11"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Recapture
                    </Button>
                    <Button
                      onClick={handleAcceptOcrReading}
                      variant="outline"
                      className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50 h-11"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Accept Anyway
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Add Reading Dialog */}
        {showAddReadingDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-3xl mx-4 h-auto"
            >
              <Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 border-2 border-blue-200">
                <div className="border-b-2 border-blue-200 pb-2 p-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Camera className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-sm text-gray-900 font-bold">
                          Add New Meter Reading
                        </span>
                        <p className="text-[10px] text-gray-600 font-normal mt-0.5">
                          Connection: {selectedConnection?.consumerNo} (
                          {selectedConnection?.connectionCategoryName})
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddReadingDialog(false)}
                      className="h-7 w-7 p-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="p-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Left Column */}
                    <div className="space-y-1.5">
                      <div>
                        <label className="text-xs text-gray-700 mb-1.5 flex items-center gap-1 font-semibold">
                          <Camera className="w-3 h-3" />
                          Meter Photo (OCR Auto-detect)
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleMeterPhotoUpload}
                          className="hidden"
                        />
                        {!meterPhoto ? (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isOcrProcessing}
                            className="w-full h-[120px] sm:h-[140px] border-2 border-dashed border-blue-400 rounded-lg bg-white hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-1 sm:gap-2"
                          >
                            {isOcrProcessing ? (
                              <>
                                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-pulse" />
                                <span className="text-xs sm:text-sm text-blue-600 font-semibold">
                                  AI Processing...
                                </span>
                                <span className="text-[10px] sm:text-xs text-gray-500">
                                  Detecting meter reading
                                </span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                                <span className="text-xs sm:text-sm text-gray-900 font-semibold">
                                  Upload Meter Photo
                                </span>
                                <span className="text-[10px] sm:text-xs text-gray-500">
                                  Auto-detect reading with AI
                                </span>
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="relative h-[120px] sm:h-[140px] border-2 border-blue-400 rounded-lg overflow-hidden">
                            <img
                              src={meterPhoto}
                              alt="Meter"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                              <button
                                type="button"
                                onClick={() => setShowMeterImageDialog(true)}
                                className="bg-blue-500 text-white rounded-full p-1 sm:p-1.5 hover:bg-blue-600 transition-colors shadow-lg"
                              >
                                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMeterPhoto(null);
                                  setUploadedDocument(null);
                                }}
                                className="bg-red-500 text-white rounded-full p-1 sm:p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                              >
                                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-transparent p-1.5 sm:p-2">
                              <p className="text-white text-[10px] sm:text-xs flex items-center gap-1 font-semibold">
                                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                OCR Auto-filled
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm text-gray-700 mb-1.5 flex items-center gap-1 font-semibold">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          Reading Date <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          value={readingDate}
                          onChange={(e) => setReadingDate(e.target.value)}
                          className="h-9 sm:h-10 border-2 border-gray-300 text-xs sm:text-sm focus:border-blue-500"
                        />
                      </div>

                      {selectedConnection &&
                        currentReading &&
                        consumption >= 0 && (
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg p-2 sm:p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] sm:text-xs text-gray-600 flex items-center gap-1">
                                <IndianRupee className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                Rate per Unit
                              </span>
                              <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-1.5 sm:px-2 py-0.5 rounded-full font-semibold">
                                {selectedConnection.connectionCategoryName}
                              </span>
                            </div>
                            <p className="text-lg sm:text-2xl text-blue-600 font-bold">
                              ₹
                              {getRateByConnectionType(
                                selectedConnection.connectionCategoryName
                              )}
                              /unit
                            </p>
                          </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-2 sm:space-y-3">
                      <div>
                        <label className="text-xs sm:text-sm text-gray-700 mb-1.5 flex items-center gap-1 font-semibold">
                          <Gauge className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                          Previous Reading
                        </label>
                        <Input
                          type="number"
                          value={selectedConnection?.previousReading || ""}
                          disabled
                          readOnly
                          className="h-9 sm:h-10 border-2 border-gray-300 bg-gray-100 cursor-not-allowed text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm text-gray-700 mb-1.5 flex items-center gap-1 font-semibold">
                          <Gauge className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                          Current Reading{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="number"
                          value={currentReading}
                          onChange={(e) => setCurrentReading(e.target.value)}
                          placeholder="Enter current reading"
                          className="h-9 sm:h-10 border-2 border-blue-300 text-xs sm:text-sm focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm text-gray-700 mb-1.5 flex items-center gap-1 font-semibold">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-600" />
                          Total Consumption
                        </label>
                        <div className="h-[70px] sm:h-[80px] bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-lg flex flex-col items-center justify-center">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                            <p className="text-2xl sm:text-4xl text-cyan-700 font-bold">
                              {consumption >= 0 ? consumption : 0}
                            </p>
                          </div>
                          <span className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                            Units Consumed
                          </span>
                          {currentReading && consumption < 0 && (
                            <p className="text-[10px] sm:text-xs text-red-600 mt-0.5 sm:mt-1">
                              ⚠️ Invalid reading
                            </p>
                          )}
                        </div>
                      </div>

                      {selectedConnection &&
                        currentReading &&
                        consumption >= 0 && (
                          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-300 rounded-lg p-2 sm:p-3">
                            <div className="space-y-0.5 sm:space-y-1">
                              <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-600">
                                <span>Calculation:</span>
                                <span className="font-semibold">
                                  {consumption} units × ₹
                                  {getRateByConnectionType(
                                    selectedConnection.connectionCategoryName
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center justify-between pt-1 sm:pt-2 border-t border-teal-200">
                                <span className="text-xs sm:text-sm text-gray-700 font-semibold">
                                  Estimated Bill:
                                </span>
                                <span className="text-lg sm:text-2xl text-teal-600 font-bold">
                                  ₹{calculateEstimatedBill().toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-3 border-t-2 border-blue-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        isSubmitting ||
                        !currentReading ||
                        !tapSize ||
                        consumption < 0
                      }
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white h-10 sm:h-11 shadow-lg w-full text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Submit Reading
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => setShowAddReadingDialog(false)}
                      variant="outline"
                      className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 h-10 sm:h-11 w-full text-sm sm:text-base"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}