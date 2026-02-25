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
import {
  fetchConsumerMeterReadings,
  createMeterReading,
  formatMeterReadingForDisplay,
  type MeterReading,
  type CreateMeterReadingRequest
} from "@/services/meterReadingService";
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
  const [showAddReadingDrawer, setShowAddReadingDrawer] = useState(false);
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
  const [meterReadings, setMeterReadings] = useState<MeterReading[]>([]);
  const [actualPreviousReading, setActualPreviousReading] = useState<number>(0);
  const [connectionRate, setConnectionRate] = useState<number>(8);
  const [isLoadingReadings, setIsLoadingReadings] = useState(false);
  const [readingError, setReadingError] = useState<string | null>(null);
  const [isRefreshingReadings, setIsRefreshingReadings] = useState(false);

  // Extract reading history fetch logic into reusable function
  const fetchReadingHistory = async (showLoading = true) => {
    if (!selectedConnection) {
      setSubmittedReadings([]);
      setMeterReadings([]);
      return;
    }

    try {
      if (showLoading) {
        setIsLoadingReadings(true);
      }
      setReadingError(null);

      // Fetch meter readings using the new service
      const readings = await fetchConsumerMeterReadings(selectedConnection.consumerID);
      setMeterReadings(readings);

      console.log('🔍 Fetched meter readings:', readings);
      console.log('📊 All readings with dates:', readings.map(r => ({
        date: r.currentReadingDate,
        currentReading: r.currentReading,
        meterReadingID: r.meterReadingID
      })));

      // Get the latest reading for previous reading display
      if (readings.length > 0) {
        const sortedReadings = readings.sort((a, b) =>
          new Date(b.currentReadingDate).getTime() - new Date(a.currentReadingDate).getTime()
        );
        const latestReading = sortedReadings[0];

        console.log('📅 Sorted readings (newest first):', sortedReadings.map(r => ({
          date: r.currentReadingDate,
          currentReading: r.currentReading
        })));

        // The latest current reading becomes the previous reading for the next submission
        const nextPreviousReading = latestReading.currentReading;
        setActualPreviousReading(nextPreviousReading);

        console.log('🔄 LOGIC: Latest Current Reading (' + latestReading.currentReading + ') becomes Previous Reading for new submission');
        console.log('✅ Setting actualPreviousReading to:', nextPreviousReading);
        console.log('📋 Latest reading details:', {
          date: latestReading.currentReadingDate,
          currentReading: latestReading.currentReading,
          willBecomePreviousReading: nextPreviousReading,
          meterReadingID: latestReading.meterReadingID
        });

        // Based on your screenshot: Feb 2026 Current Reading = 180, so next Previous Reading = 180
        console.log('📊 Example: If latest record shows Current Reading = 180, then Previous Reading for new entry = 180');
      } else {
        setActualPreviousReading(0);
        console.log('🆆 No previous readings found, setting to 0');
      }

      // Set connection-specific rate
      const rate = getRateByConnectionType(selectedConnection.connectionCategoryName);
      setConnectionRate(rate);

      // Format readings for display in the existing UI
      const formattedReadings = readings.map((reading) => {
        const formatted = formatMeterReadingForDisplay(reading);
        // Add connectionId to match the filtering logic
        return {
          ...formatted,
          connectionId: selectedConnection.consumerNo
        };
      });
      setSubmittedReadings(formattedReadings);

      console.log('✨ Formatted readings for display:', formattedReadings);

    } catch (error) {
      console.error('Error fetching reading history:', error);
      setReadingError(error instanceof Error ? error.message : 'Failed to fetch reading history');
      // Set empty arrays on error
      setSubmittedReadings([]);
      setMeterReadings([]);
    } finally {
      if (showLoading) {
        setIsLoadingReadings(false);
      }
    }
  };

  // Fetch reading history when connection is selected
  useEffect(() => {
    fetchReadingHistory();
  }, [selectedConnection]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConnectionSelect = async (connectionId: string) => {
    setSelectedConnectionId(connectionId);

    // Find connection details when selected
    const connection = availableConnections.find(
      (conn) => conn.consumerID.toString() === connectionId
    );

    console.log('🔗 Connection selection:', {
      connectionId,
      foundConnection: connection,
      consumerNo: connection?.consumerNo
    });

    if (connection) {
      setSelectedConnection(connection);
      toast.success(`Connection ${connection.consumerNo} selected`);

      // Reset form fields
      setReadingDate(getTodayDate());
      setCurrentReading("");
      setMeterPhoto(null);
      setUploadedDocument(null);
      setTapSize(connection.meterSize || "15mm");

      // Set connection rate
      const rate = getRateByConnectionType(connection.connectionCategoryName);
      setConnectionRate(rate);
      console.log('💰 Connection rate set to:', rate);

      // Reset previous reading - will be updated by the useEffect when readings are fetched
      console.log('🔄 Connection selected - temporarily resetting previous reading to 0');
      console.log('🔄 Previous reading will be updated after fetching latest readings');
      setActualPreviousReading(0);
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
    if (!currentReading) return 0;
    const current = parseInt(currentReading) || 0;
    const previous = actualPreviousReading; // Use actual previous reading from API
    return current - previous;
  };

  const getRateByConnectionType = (type: string): number => {
    // Return the dynamic connection rate if available
    return connectionRate;
  };

  const calculateEstimatedBill = () => {
    if (!currentReading) return 0;
    const consumption = calculateConsumption();
    if (consumption < 0) return 0;
    // Use the same rate function for consistency
    const rate = selectedConnection ? getRateByConnectionType(selectedConnection.connectionCategoryName) : connectionRate;
    return consumption * rate;
  };

  // Check if reading already exists for this date
  const checkExistingReading = async (date: string, consumerID: number) => {
    try {
      console.log('🔍 Checking existing readings for:', { date, consumerID });
      const existingReadings = await fetchConsumerMeterReadings(consumerID);
      console.log('📋 Existing readings found:', existingReadings.length);

      const conflictingReading = existingReadings.find(reading => {
        const readingDate = reading.currentReadingDate.split('T')[0];
        console.log('📅 Comparing dates:', { readingDate, inputDate: date });
        return readingDate === date;
      });

      if (conflictingReading) {
        console.log('⚠️ Conflict detected with existing reading:', conflictingReading);
        return true;
      }

      console.log('✅ No conflicts found for date:', date);
      return false;
    } catch (error) {
      console.error('❌ Error checking existing readings:', error);
      return false; // Allow submission if we can't check
    }
  };

  const handleSubmit = async () => {
    console.log('🚀 Starting meter reading submission...');
    toast.info('🚀 Starting submission process...');

    if (!selectedConnection || !selectedConnectionId) {
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

    // Check for existing reading on this date BEFORE attempting submission
    toast.info('🔍 Checking for existing readings...');
    const hasExistingReading = await checkExistingReading(readingDate, selectedConnection.consumerID);

    if (hasExistingReading) {
      const tomorrowDate = new Date(new Date(readingDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const yesterdayDate = new Date(new Date(readingDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      toast.error(
        `❌ Duplicate Reading Detected!\n` +
        `📅 A reading already exists for ${readingDate}\n\n` +
        `💡 Try these dates instead:\n` +
        `• Tomorrow: ${tomorrowDate}\n` +
        `• Yesterday: ${yesterdayDate}\n` +
        `• Or update the existing reading`,
        { duration: 15000 }
      );

      console.log('🚫 Pre-submission validation blocked duplicate reading');
      return;
    }

    console.log('✅ Pre-submission validation passed - no duplicates found');

    toast.success('✅ Form validation passed!');
    console.log('📝 Submitting meter reading:', {
      selectedConnection: selectedConnection?.consumerNo,
      currentReading,
      previousReading: selectedConnection?.previousReading,
      consumption,
      readingDate
    });

    setIsSubmitting(true);

    try {
      // API Integration - Submit meter reading using new service
      toast.info('📄 Preparing reading data...');

      // Create current reading datetime  
      const now = new Date();
      const readingDateTime = `${readingDate}T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}Z`;

      console.log('🕐 Generated reading datetime:', readingDateTime);

      // Prepare data according to your API schema
      const readingData: CreateMeterReadingRequest = {
        isActive: true,
        createdBy: 0,
        consumerMeterID: selectedConnection?.consumerID || 22,
        consumerID: selectedConnection?.consumerID || 22,
        billingCycleID: 4,
        previousReadingDate: readingDate, // Use same date format as current reading
        previousReading: actualPreviousReading,
        currentReadingDate: readingDate, // Use date only as per your schema
        currentReading: parseInt(currentReading),
        readingStatusID: 1,
        readingSourceID: uploadedDocument ? 2 : 1, // 2 for photo, 1 for manual
        markedForDeletion: false, // Set to false for new readings
        approvedBy: "system",
        approvedDate: readingDateTime,
        readingImagePath: uploadedDocument ? "uploaded_image.jpg" : "", // TODO: Implement actual image upload path
        remark: `Reading: ${currentReading} | Previous: ${actualPreviousReading} | Consumption: ${consumption} units | Connection: ${selectedConnection?.consumerNo}`
      };

      console.log('� Debug - Reading submission details:', {
        connection: selectedConnection?.consumerNo,
        consumerID: selectedConnection?.consumerID,
        currentReading: parseInt(currentReading),
        previousReading: actualPreviousReading,
        consumption: consumption,
        readingDate: readingDate,
        hasImage: !!uploadedDocument
      });

      console.log('�📤 Sending reading data to API (Updated Schema):', readingData);


      toast.info('🌐 Calling updated API with correct schema...');
      toast.loading('📡 Submitting meter reading to database...', {
        id: 'api-call'
      });

      const result = await createMeterReading(readingData);

      toast.dismiss('api-call');
      console.log('✅ API Response received:', result);
      toast.success('✅ Reading saved to database successfully!');

      const readingId = result.meterReadingID ? `RDG-${result.meterReadingID}` : `RDG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
      setSubmittedReadingId(readingId);

      // Close the drawer first
      setShowAddReadingDrawer(false);
      toast.info('📝 Drawer closed, preparing success message...');

      // Show success message
      toast.success(`🎉 Meter reading submitted!\nID: ${readingId}\nConsumption: ${consumption} units`, {
        duration: 5000,
      });
      setShowSuccessDialog(true);

      // Reset form fields
      setCurrentReading("");
      setMeterPhoto(null);
      setUploadedDocument(null);
      setReadingDate(getTodayDate());
      toast.info('🔄 Form fields reset for next entry');

      // Refresh the reading history after successful submission
      if (selectedConnection) {
        console.log('🔄 Refreshing meter readings after successful submission...');
        toast.loading('🔄 Refreshing readings table...', {
          id: 'refresh-table'
        });

        // Use the extracted function for consistency
        await fetchReadingHistory(false);

        toast.dismiss('refresh-table');
        console.log('✅ Reading history refreshed after submission');
        toast.success('✨ Table updated with latest readings!');
      }

      // Auto-hide success dialog after 3 seconds
      setTimeout(() => {
        setShowSuccessDialog(false);
        toast.info('✅ Process completed successfully!');
      }, 3000);

    } catch (error) {
      toast.dismiss(); // Dismiss any loading toasts
      console.error('❌ Error submitting meter reading:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      // Handle specific 409 Conflict error with helpful suggestions
      if (errorMessage.includes('409') || errorMessage.includes('Conflict')) {
        const tomorrowDate = new Date(new Date(readingDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const yesterdayDate = new Date(new Date(readingDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        console.error('🚨 409 Conflict occurred despite pre-validation!', {
          attemptedDate: readingDate,
          consumerID: selectedConnection?.consumerID,
          currentReading,
          errorDetails: errorMessage
        });

        toast.error(
          `❌ UNEXPECTED Conflict!\n` +
          `📅 Date: ${readingDate} still caused a duplicate\n\n` +
          `🔄 This suggests a timing issue or database constraint\n\n` +
          `💡 Try these solutions:\n` +
          `• Wait 1-2 seconds and try again\n` +
          `• Use tomorrow: ${tomorrowDate}\n` +
          `• Use yesterday: ${yesterdayDate}\n` +
          `• Check if another user submitted at the same time`,
          { duration: 20000 }
        );

        // Additional debugging for the development team
        console.group('🐞 409 Conflict Debug Info');
        console.log('Pre-validation passed but submission failed');
        console.log('This indicates either:');
        console.log('1. Race condition between validation and submission');
        console.log('2. Database constraint difference from API query');
        console.log('3. Multiple users submitting simultaneously');
        console.groupEnd();

      } else if (errorMessage.includes('400')) {
        toast.error(`❌ Invalid Data: Please check all fields and try again.\nError: ${errorMessage}`, {
          duration: 8000,
        });
      } else if (errorMessage.includes('500')) {
        toast.error(`🔧 Server Error: Please try again in a few moments.\nIf problem persists, contact support.`, {
          duration: 8000,
        });
      } else {
        toast.error(`❌ Submission Failed:\n${errorMessage}`, {
          duration: 8000,
        });
      }

      // Additional debugging toast
      toast.error(`🔍 Debug: Check browser console for detailed error`, {
        duration: 5000,
      });

      // Alert user to check API endpoint
      toast.warning('🔧 Ensure API server is running at localhost:5268', {
        duration: 6000,
      });

      // Don't close drawer on error so user can retry
    } finally {
      setIsSubmitting(false);
      toast.info('📝 Submission process finished');
    }
  };

  // Function to refresh readings and open drawer
  const handleOpenAddReadingDrawer = async () => {
    if (!selectedConnection) {
      toast.error("Please select a connection first");
      return;
    }

    try {
      setIsRefreshingReadings(true);
      toast.info('🔄 Refreshing latest readings...', {
        duration: 2000,
      });

      console.log('🔄 Auto-refreshing readings before opening drawer...');

      // Refresh reading data to get latest previous reading
      await fetchReadingHistory(false); // Don't show main loading state

      console.log('✅ Reading data refreshed, opening drawer with latest data');
      toast.success('✅ Latest readings loaded!');

      // Open drawer after refresh
      setShowAddReadingDrawer(true);

    } catch (error) {
      console.error('❌ Error refreshing readings:', error);
      toast.error('Failed to refresh readings. Opening drawer with cached data.');
      // Still open drawer even if refresh fails
      setShowAddReadingDrawer(true);
    } finally {
      setIsRefreshingReadings(false);
    }
  };

  const consumption = calculateConsumption();

  const filteredReadings = submittedReadings.filter(
    (reading) => reading.connectionId === selectedConnection?.consumerNo
  );

  console.log('🎯 Filtering readings:', {
    totalReadings: submittedReadings.length,
    selectedConsumerNo: selectedConnection?.consumerNo,
    filteredCount: filteredReadings.length,
    allReadings: submittedReadings.map(r => ({ id: r.id, connectionId: r.connectionId }))
  });

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

        <div className="w-full h-full flex flex-col px-3 sm:px-6 py-2 sm:py-4">
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
                  onClick={handleOpenAddReadingDrawer}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg h-11 px-6"
                  disabled={!selectedConnection || isLoadingConnections || isRefreshingReadings}
                >
                  {isRefreshingReadings ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      <span className="text-sm font-bold">Refreshing...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mr-2" />
                      <span className="text-sm font-bold">Add New Reading</span>
                    </>
                  )}
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

        {/* Add Reading Drawer */}
        {showAddReadingDrawer && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
            {/* Overlay - Click to close */}
            <div
              className="absolute inset-0"
              onClick={() => setShowAddReadingDrawer(false)}
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Add New Meter Reading</h2>
                    <p className="text-sm text-blue-100">
                      Connection: {selectedConnection?.consumerNo} • {selectedConnection?.connectionCategoryName}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddReadingDrawer(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue-50/30 to-cyan-50/30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Connection Info Card */}
                    <Card className="bg-white/80 backdrop-blur-sm border border-blue-200">
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-blue-600" />
                          Connection Details
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600">Consumer No.</p>
                            <p className="font-semibold text-gray-900">{selectedConnection?.consumerNo}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Property No.</p>
                            <p className="font-semibold text-gray-900">{selectedConnection?.propertyNo}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Area</p>
                            <p className="font-semibold text-gray-900">{selectedConnection?.areaName}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Connection Type</p>
                            <p className="font-semibold text-gray-900">{selectedConnection?.connectionCategoryName}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Previous Reading</p>
                            <p className="font-bold text-blue-700">{actualPreviousReading} Units</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Rate per Unit</p>
                            <p className="font-bold text-green-700">₹{connectionRate}</p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Photo Upload Card */}
                    <Card className="bg-white/80 backdrop-blur-sm border border-blue-200">
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Camera className="w-4 h-4 text-purple-600" />
                          Meter Photo (AI OCR)
                        </h3>
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
                            className="w-full h-40 border-2 border-dashed border-blue-400 rounded-lg bg-white hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-3"
                          >
                            {isOcrProcessing ? (
                              <>
                                <Sparkles className="w-12 h-12 text-blue-600 animate-pulse" />
                                <span className="text-sm text-blue-600 font-semibold">
                                  AI Processing...
                                </span>
                                <span className="text-xs text-gray-500">
                                  Detecting meter reading
                                </span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-12 h-12 text-blue-600" />
                                <span className="text-sm text-gray-900 font-semibold">
                                  Upload Meter Photo
                                </span>
                                <span className="text-xs text-gray-500">
                                  Auto-detect reading with AI
                                </span>
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <div className="relative h-40 border-2 border-blue-400 rounded-lg overflow-hidden">
                              <img
                                src={meterPhoto}
                                alt="Meter reading"
                                className="w-full h-full object-cover"
                                onClick={() => setShowMeterImageDialog(true)}
                              />
                              <div className="absolute top-2 right-2 flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => setShowMeterImageDialog(true)}
                                  className="bg-blue-500 text-white rounded-full p-1.5 hover:bg-blue-600 transition-colors shadow-lg"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMeterPhoto(null);
                                    setUploadedDocument(null);
                                  }}
                                  className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-transparent p-2">
                                <p className="text-white text-xs flex items-center gap-1 font-semibold">
                                  <Sparkles className="w-3 h-3" />
                                  OCR Auto-filled
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => fileInputRef.current?.click()}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Camera className="w-4 h-4 mr-2" />
                              Replace Photo
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Reading Input Card */}
                    <Card className="bg-white/80 backdrop-blur-sm border border-blue-200">
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-cyan-600" />
                          Reading Details
                        </h3>
                        <div className="space-y-4">
                          {/* Reading Date */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Reading Date <span className="text-red-500">*</span>
                            </label>
                            <Input
                              type="date"
                              value={readingDate}
                              onChange={(e) => {
                                setReadingDate(e.target.value);
                                if (e.target.value !== readingDate) {
                                  toast.dismiss();
                                }
                              }}
                              max={getTodayDate()}
                              className="w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              💡 If date conflicts occur, try adjacent dates
                            </p>
                          </div>

                          {/* Previous Reading */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Previous Reading
                              <span className="text-xs text-blue-600 ml-2">
                                (Latest: {actualPreviousReading})
                              </span>
                            </label>
                            <Input
                              type="number"
                              value={actualPreviousReading.toString()}
                              disabled
                              readOnly
                              className="w-full bg-gray-100 cursor-not-allowed"
                            />
                          </div>

                          {/* Current Reading */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Reading <span className="text-red-500">*</span>
                            </label>
                            <Input
                              type="number"
                              placeholder="Enter current reading"
                              value={currentReading}
                              onChange={(e) => setCurrentReading(e.target.value)}
                              className="w-full text-lg font-bold text-center"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Consumption & Bill Card */}
                    {currentReading && (
                      <Card className="bg-white/80 backdrop-blur-sm border border-green-200">
                        <div className="p-4">
                          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            Consumption & Bill
                          </h3>
                          <div className="space-y-4">
                            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4 text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <Droplets className="w-6 h-6 text-cyan-600" />
                                <span className="text-3xl font-bold text-cyan-700">
                                  {consumption >= 0 ? consumption : 0}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">Units Consumed</p>
                              {consumption < 0 && (
                                <p className="text-xs text-red-600 mt-1">
                                  ⚠️ Invalid reading
                                </p>
                              )}
                            </div>

                            {consumption >= 0 && (
                              <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
                                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                                  <span>Calculation:</span>
                                  <span className="font-semibold">
                                    {consumption} units × ₹{connectionRate}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-green-200">
                                  <span className="text-sm font-semibold text-gray-700">
                                    Estimated Bill:
                                  </span>
                                  <span className="text-2xl font-bold text-green-600">
                                    ₹{calculateEstimatedBill().toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 bg-white border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => setShowAddReadingDrawer(false)}
                    variant="outline"
                    className="h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      !currentReading ||
                      !readingDate ||
                      consumption < 0
                    }
                    className="h-12 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg"
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
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Submit Reading
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}