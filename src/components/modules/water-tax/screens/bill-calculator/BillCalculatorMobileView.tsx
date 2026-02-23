"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Calculator,
    Droplet,
    TrendingUp,
    IndianRupee,
    Sparkles,
    Info,
    Loader2,
    X,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { toast } from "sonner";

interface BillCalculatorMobileViewProps {
    onNavigate: (screen: string) => void;
    ratesConfig?: RateConfig[];
}

interface RateConfig {
    connectionType: string;
    meterRate: number;
    fixedRate: number;
    label: string;
    icon: string;
}

export function BillCalculatorMobileView({ onNavigate: _onNavigate, ratesConfig: propRatesConfig }: BillCalculatorMobileViewProps) {
    const [connectionType, setConnectionType] = useState("");
    const [isMeter, setIsMeter] = useState(true);
    const [connectionSize, setConnectionSize] = useState("");
    const [previousReading, setPreviousReading] = useState("");
    const [currentReading, setCurrentReading] = useState("");
    const [consumedUnits, setConsumedUnits] = useState(0);
    const [rate, setRate] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ratesConfig, setRatesConfig] = useState<RateConfig[]>([]);

    useEffect(() => {
        if (propRatesConfig && propRatesConfig.length > 0) {
            setRatesConfig(propRatesConfig);
        } else {
            fetchRatesConfig();
        }
    }, [propRatesConfig]);

    const fetchRatesConfig = async () => {
        try {
            const mockRates: RateConfig[] = [
                {
                    connectionType: "residential",
                    meterRate: 8,
                    fixedRate: 500,
                    label: "Residential",
                    icon: "🏠",
                },
                {
                    connectionType: "commercial",
                    meterRate: 15,
                    fixedRate: 1500,
                    label: "Commercial",
                    icon: "🏢",
                },
                {
                    connectionType: "industrial",
                    meterRate: 25,
                    fixedRate: 3000,
                    label: "Industrial",
                    icon: "🏭",
                },
            ];
            setRatesConfig(mockRates);
        } catch (error) {
            console.error("Error fetching rates:", error);
            toast.error("Failed to load rate configuration");
        }
    };

    const getRateByConnectionType = (type: string): number => {
        const config = ratesConfig.find((r) => r.connectionType === type);
        return config?.meterRate || 0;
    };

    const getFixedRateByConnectionType = (type: string): number => {
        const config = ratesConfig.find((r) => r.connectionType === type);
        return config?.fixedRate || 0;
    };

    const handleCalculate = async () => {
        if (!connectionType) {
            toast.error("Please select a connection category");
            return;
        }

        if (isMeter) {
            if (!previousReading || !currentReading) {
                toast.error("Please enter both meter readings");
                return;
            }

            const prevReading = parseFloat(previousReading) || 0;
            const currReading = parseFloat(currentReading) || 0;
            const units = currReading - prevReading;

            if (units < 0) {
                toast.error("Current reading must be greater than previous reading");
                return;
            }

            setLoading(true);

            try {
                const calculatedRate = getRateByConnectionType(connectionType);
                const calculatedTotalTax = units * calculatedRate;

                setConsumedUnits(units);
                setRate(calculatedRate);
                setTotalTax(calculatedTotalTax);
                setShowResult(true);

                toast.success("Bill calculated successfully!");
            } catch (error) {
                console.error("Calculation error:", error);
                toast.error("Failed to calculate bill. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(true);

            try {
                const fixedBill = getFixedRateByConnectionType(connectionType);
                setConsumedUnits(0);
                setRate(fixedBill);
                setTotalTax(fixedBill);
                setShowResult(true);

                toast.success("Bill calculated successfully!");
            } catch (error) {
                console.error("Calculation error:", error);
                toast.error("Failed to calculate bill. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleReset = () => {
        setConnectionType("");
        setIsMeter(true);
        setConnectionSize("");
        setPreviousReading("");
        setCurrentReading("");
        setConsumedUnits(0);
        setRate(0);
        setTotalTax(0);
        setShowResult(false);
        toast.success("Form reset!");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 shadow-lg sticky top-0 z-20">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Bill Calculator</h1>
                        <p className="text-xs opacity-90">Estimate your water bill</p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Info Card */}
                <Card className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Info className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-blue-900 mb-1">Quick Estimate</h3>
                            <p className="text-xs text-blue-700">
                                Enter your details below to get an instant estimate of your water bill.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Calculator Card */}
                <Card className="p-4 bg-white shadow-lg border-0">
                    <div className="space-y-4">
                        {/* Connection Category */}
                        <div>
                            <label className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                                <Droplet className="w-3 h-3" />
                                Connection Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={connectionType}
                                onChange={(e) => setConnectionType(e.target.value)}
                                className="w-full h-10 px-3 border-2 border-gray-200 bg-white rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={ratesConfig.length === 0}
                            >
                                <option value="">Select Type</option>
                                {ratesConfig.map((config) => (
                                    <option key={config.connectionType} value={config.connectionType}>
                                        {config.icon} {config.label}
                                    </option>
                                ))}
                            </select>
                            {connectionType && (
                                <p className="text-[10px] text-gray-500 mt-1">
                                    Rate: ₹{getRateByConnectionType(connectionType)}/unit (Meter) | ₹{getFixedRateByConnectionType(connectionType)}/month (Fixed)
                                </p>
                            )}
                        </div>

                        {/* Connection Type & Tap Size */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-bold text-gray-700 mb-2 block">
                                    Connection Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={isMeter ? "meter" : "non-meter"}
                                    onChange={(e) => setIsMeter(e.target.value === "meter")}
                                    className="w-full h-10 px-3 border-2 border-gray-200 bg-white rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="meter">📊 Meter</option>
                                    <option value="non-meter">📅 Non-Meter</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 mb-2 block">
                                    Tap Size <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={connectionSize}
                                    onChange={(e) => setConnectionSize(e.target.value)}
                                    className="w-full h-10 px-3 border-2 border-gray-200 bg-white rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Size</option>
                                    <option value="0.5">1/2&quot;</option>
                                    <option value="0.75">3/4&quot;</option>
                                    <option value="1">1&quot;</option>
                                    <option value="1.5">1 1/2&quot;</option>
                                    <option value="2">2&quot;</option>
                                    <option value="3">3&quot;</option>
                                    <option value="4">4&quot;</option>
                                </select>
                            </div>
                        </div>

                        {/* Meter Readings - Only show if meter type is selected */}
                        {isMeter && (
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <label className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    Meter Readings
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] text-gray-600 mb-1 block">
                                            Previous Reading <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="number"
                                            value={previousReading}
                                            onChange={(e) => setPreviousReading(e.target.value)}
                                            placeholder="0.00"
                                            className="h-10 text-sm font-medium border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-600 mb-1 block">
                                            Current Reading <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="number"
                                            value={currentReading}
                                            onChange={(e) => setCurrentReading(e.target.value)}
                                            placeholder="0.00"
                                            className="h-10 text-sm font-medium border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                className="h-11 border-2 border-red-300 text-red-600 hover:bg-red-50 font-semibold"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Reset
                            </Button>
                            <Button
                                onClick={handleCalculate}
                                disabled={loading || !connectionType || (isMeter && (!previousReading || !currentReading))}
                                className="h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                        Calculating...
                                    </>
                                ) : (
                                    <>
                                        <Calculator className="w-4 h-4 mr-1" />
                                        Calculate
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Result Card */}
                {showResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Card className="p-5 bg-gradient-to-br from-green-500 to-emerald-600 border-0 shadow-xl text-white">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs opacity-90 font-medium">Estimated Bill Amount</p>
                                        <p className="text-[10px] opacity-75">
                                            {isMeter ? "Based on consumption" : "Fixed Monthly Rate"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <IndianRupee className="w-8 h-8 opacity-90" />
                                <div className="text-4xl font-bold">
                                    {totalTax.toFixed(2)}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/20">
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <p className="opacity-75 mb-1">Category</p>
                                        <p className="font-bold capitalize">{connectionType}</p>
                                    </div>
                                    <div>
                                        <p className="opacity-75 mb-1">Type</p>
                                        <p className="font-bold">{isMeter ? "Metered" : "Non-Metered"}</p>
                                    </div>
                                    {isMeter && (
                                        <>
                                            <div>
                                                <p className="opacity-75 mb-1">Units Consumed</p>
                                                <p className="font-bold">{consumedUnits.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="opacity-75 mb-1">Rate per Unit</p>
                                                <p className="font-bold">₹{rate}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Help Section */}
                <Card className="p-4 bg-gray-50 border-0">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">How it works</h3>
                    <ul className="space-y-2 text-xs text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-600">1</span>
                            <span>Select your connection category (Residential/Commercial/Industrial)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-600">2</span>
                            <span>Choose meter or non-meter connection type</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-600">3</span>
                            <span>For metered connections, enter previous and current readings</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-600">4</span>
                            <span>Click Calculate to see your estimated bill</span>
                        </li>
                    </ul>
                </Card>
            </div>
        </div>
    );
}
