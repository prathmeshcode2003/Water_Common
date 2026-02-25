"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera,
    Upload,
    CheckCircle,
    Droplets,
    Calendar,
    X,
    Sparkles,
    Gauge,
    Image as ImageIcon,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { toast } from "sonner";

interface MeterReadingMobileViewProps {
    connections: any[];
    selectedConnection: any;
    onConnectionSelect: (id: string) => void;
    readingHistory: any[];
    isLoading?: boolean;
    error?: string | null;
}

export function MeterReadingMobileView({
    connections,
    selectedConnection,
    onConnectionSelect,
    readingHistory,
    isLoading = false,
    error = null,
}: MeterReadingMobileViewProps) {
    const [showAddReadingDialog, setShowAddReadingDialog] = useState(false);
    const [currentReading, setCurrentReading] = useState("");
    const [readingDate, setReadingDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [meterPhoto, setMeterPhoto] = useState<string | null>(null);
    const [isOcrProcessing, setIsOcrProcessing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCameraOptions, setShowCameraOptions] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const consumption = currentReading && selectedConnection
        ? parseInt(currentReading) - parseInt(selectedConnection.previousReading)
        : 0;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

            // Simulate OCR processing
            setIsOcrProcessing(true);
            toast.info("Processing meter image...", {
                description: "AI is detecting the reading",
            });

            setTimeout(() => {
                // Simulate detected reading
                if (selectedConnection) {
                    const previousValue = parseInt(selectedConnection.previousReading);
                    const consumption = Math.floor(Math.random() * 100) + 50;
                    const detectedValue = previousValue + consumption;

                    setCurrentReading(detectedValue.toString());
                    setIsOcrProcessing(false);

                    toast.success("Meter reading detected!", {
                        description: `Reading: ${detectedValue}`,
                    });
                }
            }, 2000);
        };

        reader.readAsDataURL(file);
    };

    const handleOpenCamera = () => {
        setShowCameraOptions(false);
        cameraInputRef.current?.click();
    };

    const handleOpenGallery = () => {
        setShowCameraOptions(false);
        fileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        if (!currentReading) {
            toast.error("Please enter current reading");
            return;
        }

        if (consumption < 0) {
            toast.error("Current reading cannot be less than previous reading");
            return;
        }

        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            toast.success("Meter reading submitted successfully!");
            setShowAddReadingDialog(false);
            setCurrentReading("");
            setMeterPhoto(null);
        } catch (error) {
            toast.error("Failed to submit reading. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 pb-20">
            {/* Header - Sticky */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-4 shadow-lg sticky top-0 z-20">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Gauge className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold">Meter Reading</h1>
                        <p className="text-xs opacity-90">Submit and track readings</p>
                    </div>
                </div>

                {/* Connection Selector */}
                <select
                    value={selectedConnection?.consumerID || ""}
                    onChange={(e) => onConnectionSelect(e.target.value)}
                    className="w-full bg-white text-gray-900 rounded-lg px-3 py-2.5 text-sm font-semibold shadow-md"
                    disabled={isLoading}
                >
                    {connections.map((conn) => (
                        <option key={conn.consumerID} value={conn.consumerID}>
                            {conn.propertyNo} - {conn.consumerNo} - {conn.connectionCategoryName}
                        </option>
                    ))}
                </select>

                {/* Add Reading Button */}
                <Button
                    onClick={() => setShowAddReadingDialog(true)}
                    variant="secondary"
                    className="w-full mt-3 border-0 bg-white text-blue-600 hover:bg-gray-100 h-12 shadow-md"
                >
                    <Camera className="w-5 h-5 mr-2" />
                    Add New Reading
                </Button>
            </div>

            <div className="p-4 space-y-4">
                {/* Connection Summary */}
                {selectedConnection && (
                    <Card className="bg-white border-2 border-blue-200 p-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-gray-600">Consumer No.</p>
                                <p className="text-sm font-bold text-gray-900">
                                    {selectedConnection.consumerNo}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Type</p>
                                <p className="text-sm font-bold text-gray-900">
                                    {selectedConnection.connectionCategoryName}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Meter No.</p>
                                <p className="text-sm font-bold text-gray-900">
                                    {selectedConnection.meterNumber}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Previous Reading</p>
                                <p className="text-sm font-bold text-blue-600">
                                    {selectedConnection.previousReading}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Reading History */}
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-2 border-blue-200">
                    <div className="p-4 border-b-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                            Reading History
                        </h2>
                        <p className="text-xs text-gray-600 mt-1">
                            {readingHistory.length} record(s)
                        </p>
                    </div>

                    <div className="p-3 space-y-3 max-h-[500px] overflow-y-auto">
                        {readingHistory.length === 0 ? (
                            <div className="text-center py-8">
                                <Gauge className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">No reading history</p>
                            </div>
                        ) : (
                            readingHistory.map((reading) => (
                                <Card key={reading.id} className="border-2 border-gray-200 p-3">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-500 text-white text-xs font-semibold">
                                                {reading.readingMonth}
                                            </span>
                                            <p className="text-xs text-gray-600 mt-1">{reading.date}</p>
                                        </div>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-500 text-white font-semibold">
                                            {reading.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-gray-50 rounded p-2">
                                            <p className="text-gray-600">Previous</p>
                                            <p className="font-bold text-gray-900">{reading.previousReading}</p>
                                        </div>
                                        <div className="bg-cyan-50 rounded p-2">
                                            <p className="text-gray-600">Current</p>
                                            <p className="font-bold text-cyan-600">{reading.currentReading}</p>
                                        </div>
                                        <div className="bg-green-50 rounded p-2">
                                            <p className="text-gray-600">Consumption</p>
                                            <p className="font-bold text-green-600">{reading.unit} Units</p>
                                        </div>
                                        <div className="bg-blue-50 rounded p-2">
                                            <p className="text-gray-600">Amount</p>
                                            <p className="font-bold text-blue-600">₹{reading.totalAmount}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Add Reading Dialog */}
            <AnimatePresence>
                {showAddReadingDialog && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25 }}
                            className="w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-t-2xl"
                        >
                            <Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 border-2 border-blue-200">
                                <div className="border-b-2 border-blue-200 p-4 bg-white/90 sticky top-0 z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                                <Camera className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-900 font-bold">
                                                    Add New Meter Reading
                                                </span>
                                                <p className="text-xs text-gray-600">
                                                    {selectedConnection?.consumerNo}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowAddReadingDialog(false)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-4 space-y-4">
                                    {/* Meter Photo Upload */}
                                    <div>
                                        <label className="text-sm text-gray-700 mb-2 flex items-center gap-1 font-semibold">
                                            <Camera className="w-4 h-4" />
                                            Meter Photo (AI Auto-detect)
                                        </label>

                                        {/* Hidden inputs */}
                                        <input
                                            ref={cameraInputRef}
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />

                                        {!meterPhoto ? (
                                            <button
                                                type="button"
                                                onClick={() => setShowCameraOptions(true)}
                                                disabled={isOcrProcessing}
                                                className="w-full h-40 border-2 border-dashed border-blue-400 rounded-lg bg-white hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2"
                                            >
                                                {isOcrProcessing ? (
                                                    <>
                                                        <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
                                                        <span className="text-sm text-blue-600 font-semibold">
                                                            AI Processing...
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ImageIcon className="w-8 h-8 text-blue-600" />
                                                        <span className="textbase font-semibold text-gray-900">
                                                            Upload Meter Photo
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            Tap to capture or upload
                                                        </span>
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <div className="relative h-40 border-2 border-blue-400 rounded-lg overflow-hidden">
                                                <img
                                                    src={meterPhoto}
                                                    alt="Meter"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-2 right-2 flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setMeterPhoto(null);
                                                            setCurrentReading("");
                                                        }}
                                                        className="bg-red-500 text-white rounded-full p-2 shadow-lg"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-transparent p-2">
                                                    <p className="text-white text-xs flex items-center gap-1 font-semibold">
                                                        <Sparkles className="w-3 h-3" />
                                                        AI Detected
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Reading Details */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm text-gray-700 mb-1.5 flex items-center gap-1 font-semibold">
                                                <Gauge className="w-4 h-4" />
                                                Previous
                                            </label>
                                            <Input
                                                type="number"
                                                value={selectedConnection?.previousReading || ""}
                                                disabled
                                                className="h-11 bg-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-700 mb-1.5 flex items-center gap-1 font-semibold">
                                                <Gauge className="w-4 h-4 text-blue-600" />
                                                Current *
                                            </label>
                                            <Input
                                                type="number"
                                                value={currentReading}
                                                onChange={(e) => setCurrentReading(e.target.value)}
                                                placeholder="Enter"
                                                className="h-11 border-2 border-blue-300"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-700 mb-1.5 flex items-center gap-1 font-semibold">
                                            <Calendar className="w-4 h-4" />
                                            Reading Date *
                                        </label>
                                        <Input
                                            type="date"
                                            value={readingDate}
                                            onChange={(e) => setReadingDate(e.target.value)}
                                            className="h-11 border-2 border-gray-300"
                                        />
                                    </div>

                                    {/* Consumption Display */}
                                    {currentReading && consumption >= 0 && (
                                        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-lg p-4">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <Droplets className="w-6 h-6 text-cyan-600" />
                                                <p className="text-3xl text-cyan-700 font-bold">
                                                    {consumption}
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-600 text-center">
                                                Units Consumed
                                            </p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="space-y-2 pt-2">
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting || !currentReading || consumption < 0}
                                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white h-12 shadow-lg"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
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
                                        <Button
                                            onClick={() => setShowAddReadingDialog(false)}
                                            variant="outline"
                                            className="w-full border-2 border-gray-300 h-12"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Camera Options Bottom Sheet */}
            <AnimatePresence>
                {showCameraOptions && (
                    <div
                        className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowCameraOptions(false)}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25 }}
                            className="w-full bg-white rounded-t-2xl p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Upload Meter Photo
                            </h3>
                            <div className="space-y-3">
                                <Button
                                    onClick={handleOpenCamera}
                                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white h-14 text-base"
                                >
                                    <Camera className="w-5 h-5 mr-2" />
                                    Take Photo
                                </Button>
                                <Button
                                    onClick={handleOpenGallery}
                                    variant="outline"
                                    className="w-full border-2 border-blue-300 h-14 text-base"
                                >
                                    <Upload className="w-5 h-5 mr-2" />
                                    Choose from Gallery
                                </Button>
                                <Button
                                    onClick={() => setShowCameraOptions(false)}
                                    variant="outline"
                                    className="w-full border-2 border-gray-300 h-14 text-base"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
