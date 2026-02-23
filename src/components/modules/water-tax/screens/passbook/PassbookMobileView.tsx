"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    ChevronDown,
    ChevronUp,
    Calendar,
    Download,
    Printer,
    Filter,
    Search,
    X,
    FileSpreadsheet,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { toast } from "sonner";

interface PassbookMobileViewProps {
    transactions: any[];
    selectedConnection: string;
    connections: any[];
    onConnectionChange: (value: string) => void;
    onDownloadPDF: () => void;
    onPrint: () => void;
    onExportExcel: () => void;
}

export function PassbookMobileView({
    transactions,
    selectedConnection,
    connections,
    onConnectionChange,
    onDownloadPDF,
    onPrint,
    onExportExcel,
}: PassbookMobileViewProps) {
    const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter states
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [billingCycle, setBillingCycle] = useState("all");
    const [transactionType, setTransactionType] = useState("all");
    const [asOnDate, setAsOnDate] = useState(new Date().toISOString().split("T")[0]);

    const consumerData = connections.find(
        (conn) => conn.consumerID?.toString() === selectedConnection
    );

    const propertyData = consumerData || {};

    const handleApplyFilter = () => {
        toast.success("Filters applied successfully!");
        setIsFilterOpen(false);
    };

    const handleResetFilter = () => {
        setFromDate("");
        setToDate("");
        setBillingCycle("all");
        setTransactionType("all");
        setAsOnDate(new Date().toISOString().split("T")[0]);
        toast.info("Filters reset");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
            {/* Mobile Header - Sticky */}
            <div className="bg-white/95 backdrop-blur-sm shadow-md border-b-2 border-blue-200 sticky top-0 z-20">
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-lg font-bold text-gray-900">💧 Water Bill Passbook</h1>
                            <p className="text-xs text-gray-600">Consumer Ledger & Outstanding</p>
                        </div>
                    </div>

                    {/* Connection Selector */}
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg p-[2px] mb-3">
                        <div className="bg-white rounded-md px-3 py-2">
                            <label className="text-xs text-gray-900 font-bold mb-1 block">Select Connection:</label>
                            <select
                                value={selectedConnection}
                                onChange={(e) => {
                                    onConnectionChange(e.target.value);
                                    toast.success("Connection changed!");
                                }}
                                className="w-full h-9 px-2 border-2 border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 hover:border-purple-500 rounded-md text-sm font-semibold"
                            >
                                {connections.map((conn) => (
                                    <option key={conn.consumerID} value={conn.consumerID}>
                                        {propertyData.propertyNo} - {conn.consumerNo} - {conn.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                        <Button
                            onClick={onDownloadPDF}
                            className="border-2 border-red-300 text-red-600 hover:bg-red-50 text-xs sm:text-sm h-9"
                        >
                            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            PDF
                        </Button>
                        <Button
                            onClick={onExportExcel}
                            className="border-2 border-green-300 text-green-600 hover:bg-green-50 text-xs sm:text-sm h-9"
                        >
                            <FileSpreadsheet className="w-3 h-3 mr-1" />
                            Excel
                        </Button>
                        <Button
                            onClick={onPrint}

                            className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm h-9"
                        >
                            <Printer className="w-3 h-3 mr-1" />
                            Print
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-3">
                {/* Consumer Summary Card */}
                <Card className="bg-white border-2 border-blue-200 p-4">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Consumer No</p>
                            <p className="text-sm font-semibold text-gray-900">{consumerData?.consumerNo || "-"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Name</p>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {consumerData?.consumerNameEnglish || "-"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Type</p>
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 font-medium border border-blue-300">
                                {consumerData?.connectionTypeName || "-"}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Category</p>
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-700 font-medium border border-purple-300">
                                {consumerData?.categoryName || "-"}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Pipe Size</p>
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-orange-100 text-orange-700 font-medium border border-orange-300">
                                {consumerData?.sizeName || "-"}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Property No</p>
                            <p className="text-sm font-semibold text-gray-900">{propertyData.propertyNo  || "-"}</p>
                        </div>
                    </div>

                    {/* Outstanding Summary */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-lg p-3 text-white shadow-md">
                            <p className="text-[10px] opacity-90 mb-1">Total Due</p>
                            <p className="text-lg font-bold">
                                ₹{(consumerData?.totalOutstanding ?? 0).toFixed(0)}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg p-3 text-white shadow-md">
                            <p className="text-[10px] opacity-90 mb-1">Pending</p>
                            <p className="text-lg font-bold">
                                ₹{(consumerData?.pendingAmount ?? 0).toFixed(0)}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg p-3 text-white shadow-md">
                            <p className="text-[10px] opacity-90 mb-1">Current</p>
                            <p className="text-lg font-bold">
                                ₹{(consumerData?.currentDemand ?? 0).toFixed(0)}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Filters Card */}
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-2 border-blue-200">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg border-b-2 border-blue-200"
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-blue-600" />
                            <span className="text-base font-bold text-gray-900">Filters</span>
                        </div>
                        {isFilterOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                    </button>

                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 space-y-3">
                                    <div>
                                        <label className="text-xs text-gray-600 mb-1 block font-semibold">From Date</label>
                                        <Input
                                            type="date"
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)}
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600 mb-1 block font-semibold">To Date</label>
                                        <Input
                                            type="date"
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600 mb-1 block font-semibold">Billing Cycle</label>
                                        <select
                                            value={billingCycle}
                                            onChange={(e) => setBillingCycle(e.target.value)}
                                            className="h-9 text-sm border-gray-300 border rounded-md px-2 w-full"
                                        >
                                            <option value="all">All Cycles</option>
                                            <option value="dec2024">Dec 2024</option>
                                            <option value="nov2024">Nov 2024</option>
                                            <option value="oct2024">Oct 2024</option>
                                            <option value="sep2024">Sep 2024</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600 mb-1 block font-semibold">Transaction Type</label>
                                        <select
                                            value={transactionType}
                                            onChange={(e) => setTransactionType(e.target.value)}
                                            className="h-9 text-sm border-gray-300 border rounded-md px-2 w-full"
                                        >
                                            <option value="all">All Types</option>
                                            <option value="current">Current Demand</option>
                                            <option value="pending">Pending</option>
                                            <option value="interest">Interest</option>
                                            <option value="payment">Payment</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600 mb-1 block font-semibold">As-On Date</label>
                                        <Input
                                            type="date"
                                            value={asOnDate}
                                            onChange={(e) => setAsOnDate(e.target.value)}
                                            className="h-9 text-sm"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <Button
                                            onClick={handleApplyFilter}
                                            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-sm h-10"
                                        >
                                            <Search className="w-4 h-4 mr-1" />
                                            Apply
                                        </Button>
                                        <Button
                                            onClick={handleResetFilter}
                                            className="border-2 border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-sm h-10"
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            Reset
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>

                {/* Transaction Ledger */}
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-2 border-blue-200">
                    <div className="p-4 border-b-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Transaction Ledger
                        </h2>
                        <p className="text-xs text-gray-600 mt-1">Total {transactions.length} transactions</p>
                    </div>

                    <div className="p-3">
                        {transactions.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <FileText className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-base text-gray-900 mb-2 font-semibold">No Transactions</h3>
                                <p className="text-sm text-gray-600">No passbook entries available</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {transactions.map((txn) => (
                                    <Card
                                        key={txn.id}
                                        className="border-2 border-gray-200 overflow-hidden shadow-sm"
                                    >
                                        <div
                                            onClick={() =>
                                                setExpandedTransaction(
                                                    expandedTransaction === txn.id ? null : txn.id
                                                )
                                            }
                                            className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 cursor-pointer active:bg-blue-100 border-b border-gray-200"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Calendar className="w-4 h-4 text-blue-600" />
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {txn.date}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 border border-blue-300 text-blue-700">
                                                            {txn.billingCycle}
                                                        </span>
                                                        <span
                                                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${txn.transactionType === "Payment"
                                                                ? "bg-green-100 text-green-700 border border-green-300"
                                                                : "bg-orange-100 text-orange-700 border border-orange-300"
                                                                }`}
                                                        >
                                                            {txn.transactionType}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right ml-3">
                                                    <p className="text-xs text-gray-500 mb-1">Balance</p>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        ₹{txn.runningBalance.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end text-xs text-blue-600 font-medium">
                                                {expandedTransaction === txn.id ? "Hide" : "View"} Details
                                                <ChevronDown
                                                    className={`w-4 h-4 ml-1 transition-transform ${expandedTransaction === txn.id ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        {expandedTransaction === txn.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="bg-white p-4"
                                            >
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                                        <span className="text-gray-600">Opening Balance:</span>
                                                        <span className="font-semibold text-gray-900">
                                                            ₹{txn.openingBalance.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    {txn.pending > 0 && (
                                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Pending (Arrear):</span>
                                                            <span className="font-semibold text-orange-600">
                                                                ₹{txn.pending.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {txn.currentDemand > 0 && (
                                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Current Demand:</span>
                                                            <span className="font-semibold text-blue-600">
                                                                ₹{txn.currentDemand.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {txn.interest > 0 && (
                                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Interest:</span>
                                                            <span className="font-semibold text-purple-600">
                                                                ₹{txn.interest.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {txn.principalAmount > 0 && (
                                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Principal (₹):</span>
                                                            <span className="font-semibold text-gray-900">
                                                                ₹{txn.principalAmount.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {txn.interestAmount > 0 && (
                                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Interest (₹):</span>
                                                            <span className="font-semibold text-purple-600">
                                                                ₹{txn.interestAmount.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {txn.debit > 0 && (
                                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Debit:</span>
                                                            <span className="font-semibold text-red-600">
                                                                ₹{txn.debit.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {txn.credit > 0 && (
                                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Credit:</span>
                                                            <span className="font-semibold text-green-600">
                                                                ₹{txn.credit.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between py-2 bg-blue-50 -mx-4 px-4 mt-2">
                                                        <span className="text-gray-900 font-semibold">Running Balance:</span>
                                                        <span className="font-bold text-blue-600 text-base">
                                                            ₹{txn.runningBalance.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    {txn.remarks && (
                                                        <div className="pt-2 mt-2 border-t border-gray-100">
                                                            <p className="text-xs text-gray-500 mb-1">Remarks:</p>
                                                            <p className="text-xs text-gray-700">{txn.remarks}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
