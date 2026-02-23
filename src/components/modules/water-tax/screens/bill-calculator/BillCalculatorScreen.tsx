"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { motion } from "framer-motion";
import {
  Calculator,
  Droplet,
  X,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import  CivicRibbon  from "@/components/modules/water-tax/screens/shared/CivicRibbon"; // Import CivicRibbon
import { toast } from "sonner";
import  { BillCalculatorMobileView }  from "./BillCalculatorMobileView";
interface BillCalculatorScreenProps {
  onNavigate: (screen: string) => void;
  ratesConfig?: RateConfig[];
}

// API-ready rate structure
interface RateConfig {
  connectionType: string;
  meterRate: number; // Rate per unit for metered connections
  fixedRate: number; // Fixed monthly rate for non-metered connections
  label: string;
  icon: string;
}

export function BillCalculatorScreen({ onNavigate, ratesConfig: propRatesConfig }: BillCalculatorScreenProps) {
  const router = useRouter(); // Initialize router for navigation
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

  // TODO: Replace with actual API call to fetch corporation-specific rates
  useEffect(() => {
    if (propRatesConfig && propRatesConfig.length > 0) {
      setRatesConfig(propRatesConfig);
    } else {
      fetchRatesConfig();
    }
  }, [propRatesConfig]);

  const fetchRatesConfig = async () => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/water-tax/rates');
      // const data = await response.json();
      // setRatesConfig(data.rates);

      // Mock data - Replace with API call
      const mockRates: RateConfig[] = [
        {
          connectionType: 'residential',
          meterRate: 8,
          fixedRate: 500,
          label: 'Residential',
          icon: '🏠'
        },
        {
          connectionType: 'commercial',
          meterRate: 15,
          fixedRate: 1500,
          label: 'Commercial',
          icon: '🏢'
        },
        {
          connectionType: 'industrial',
          meterRate: 25,
          fixedRate: 3000,
          label: 'Industrial',
          icon: '🏭'
        }
      ];
      setRatesConfig(mockRates);
    } catch (error) {
      console.error('Error fetching rates:', error);
      toast.error('Failed to load rate configuration');
    }
  };

  const getRateByConnectionType = (type: string): number => {
    const config = ratesConfig.find(r => r.connectionType === type);
    return config?.meterRate || 0;
  };

  const getFixedRateByConnectionType = (type: string): number => {
    const config = ratesConfig.find(r => r.connectionType === type);
    return config?.fixedRate || 0;
  };

  const handleCalculate = async () => {
    if (!connectionType) {
      toast.error('Please select a connection category');
      return;
    }

    if (isMeter) {
      if (!previousReading || !currentReading) {
        toast.error('Please enter both meter readings');
        return;
      }

      const prevReading = parseFloat(previousReading) || 0;
      const currReading = parseFloat(currentReading) || 0;
      const units = currReading - prevReading;

      if (units < 0) {
        toast.error('Current reading must be greater than previous reading');
        return;
      }

      setLoading(true);

      try {
        // TODO: Add API call for calculation if needed
        // const response = await fetch('/api/water-tax/calculate', {
        //   method: 'POST',
        //   body: JSON.stringify({ connectionType, units, isMeter })
        // });
        // const data = await response.json();

        const calculatedRate = getRateByConnectionType(connectionType);
        const calculatedTotalTax = units * calculatedRate;

        setConsumedUnits(units);
        setRate(calculatedRate);
        setTotalTax(calculatedTotalTax);
        setShowResult(true);

        toast.success('Bill calculated successfully!');
      } catch (error) {
        console.error('Calculation error:', error);
        toast.error('Failed to calculate bill. Please try again.');
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

        toast.success('Bill calculated successfully!');
      } catch (error) {
        console.error('Calculation error:', error);
        toast.error('Failed to calculate bill. Please try again.');
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
  };

  const handleNavigate = (screen: string) => {
    const screenRoutes: Record<string, string> = {
      dashboard: "dashboard",
      passbook: "passbook",
      submitReading: "submitReading",
      grievances: "grievances",
      calculator: "calculator",
    };

    const viewParam = screenRoutes[screen] || screen;
    router.push(`/water-tax/citizen?view=${viewParam}`);
  };

  return (
    <>
      {/* Civic Ribbon */}
      <CivicRibbon currentScreen="calculator" onNavigate={handleNavigate} />

      {/* Mobile View */}
      <div className="lg:hidden">
        <BillCalculatorMobileView onNavigate={onNavigate} ratesConfig={ratesConfig} />
      </div>

      {/* Desktop View - Centered and No Scroll */}
      <div className="hidden lg:flex items-center justify-center h-fit bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 overflow-hidden pt-20 pb-15">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          {/* Calculator Card */}
          <Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 border-2 border-cyan-300 shadow-2xl">
            <div className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 border-b-2 border-cyan-200 pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                  <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-xl font-bold text-gray-900">Calculate Water Tax</h2>
                  <p className="text-[10px] sm:text-xs text-gray-600">Enter connection details to estimate your water bill</p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Calculator Input Form */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 border-2 border-blue-300 shadow-xl">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Connection Type - Dynamic from API */}
                    <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
                      <label className="text-sm text-gray-800 mb-2 block flex items-center gap-2 font-semibold">
                        <Droplet className="w-4 h-4 text-blue-600" />
                        Connection Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={connectionType}
                        onChange={(e) => setConnectionType(e.target.value)}
                        className="w-full h-11 border-2 border-gray-300 bg-white hover:border-gray-400 transition-colors shadow-sm rounded-md px-3"
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
                        <p className="text-xs text-gray-500 mt-2">
                          Rate: ₹{getRateByConnectionType(connectionType)}/unit (Meter) | ₹{getFixedRateByConnectionType(connectionType)}/month (Fixed)
                        </p>
                      )}
                    </div>

                    {/* Meter Type & Pipe Size */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
                        <label className="text-sm text-gray-800 mb-2 block font-semibold">
                          Connection Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={isMeter ? "meter" : "non-meter"}
                          onChange={(e) => setIsMeter(e.target.value === "meter")}
                          className="w-full h-11 border-2 border-gray-300 bg-white hover:border-gray-400 transition-colors shadow-sm rounded-md px-3"
                        >
                          <option value="meter">📊 Meter</option>
                          <option value="non-meter">📅 Non-Meter</option>
                        </select>
                      </div>

                      <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
                        <label className="text-sm text-gray-800 mb-2 block font-semibold">
                          Tap Size <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={connectionSize}
                          onChange={(e) => setConnectionSize(e.target.value)}
                          className="w-full h-11 border-2 border-gray-300 bg-white hover:border-gray-400 transition-colors shadow-sm rounded-md px-3"
                        >
                          <option value="">Size</option>
                          <option value="0.5">1/2"</option>
                          <option value="0.75">3/4"</option>
                          <option value="1">1"</option>
                          <option value="1.5">1 1/2"</option>
                          <option value="2">2"</option>
                          <option value="3">3"</option>
                          <option value="4">4"</option>
                        </select>
                      </div>
                    </div>

                    {/* Meter Readings */}
                    {isMeter && (
                      <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
                        <label className="text-sm text-gray-800 mb-3 block font-semibold flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-gray-600" />
                          Meter Readings
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-700 mb-1.5 block">
                              Previous Reading <span className="text-red-500">*</span>
                            </label>
                            <Input
                              type="number"
                              value={previousReading}
                              onChange={(e) => setPreviousReading(e.target.value)}
                              placeholder="0.00"
                              className="h-11 border-2 border-gray-300 bg-white hover:border-gray-400 focus:border-gray-500 transition-colors shadow-sm"
                              min="0"
                              step="0.01"
                            />
                          </div>

                          <div>
                            <label className="text-xs text-gray-700 mb-1.5 block">
                              Current Reading <span className="text-red-500">*</span>
                            </label>
                            <Input
                              type="number"
                              value={currentReading}
                              onChange={(e) => setCurrentReading(e.target.value)}
                              placeholder="0.00"
                              className="h-11 border-2 border-gray-300 bg-white hover:border-gray-400 focus:border-gray-500 transition-colors shadow-sm"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Button
                        onClick={handleCalculate}
                        disabled={loading || !connectionType || (isMeter && (!previousReading || !currentReading))}
                        className="h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Calculating...
                          </>
                        ) : (
                          <>
                            <Calculator className="w-5 h-5 mr-2" />
                            Calculate
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="h-12 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 shadow-lg font-semibold"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Result Display */}
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-2xl border-2 border-green-400"
                  >
                    <div className="text-center">
                      <p className="text-sm text-white/90 mb-1 font-medium">Estimated Bill Amount</p>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="text-5xl text-white font-bold">₹{totalTax.toFixed(2)}</span>
                      </div>

                      {isMeter ? (
                        <div className="pt-3 border-t border-white/30">
                          <p className="text-white/95 text-sm font-medium">
                            {consumedUnits.toFixed(2)} units × ₹{rate} per unit
                          </p>
                        </div>
                      ) : (
                        <div className="pt-1 border-t border-white/30">
                          <p className="text-white/95 text-sm font-medium">
                            Fixed Monthly Rate
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
