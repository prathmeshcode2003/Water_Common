"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  Printer,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Calendar,
  IndianRupee,
  User,
  Building2,
  MapPin,
  Droplets,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Info,
  FileSpreadsheet,
  Search,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { toast } from "sonner";
import { searchConsumer } from "@/services/waterConsumerService"; // adjust import path if needed
import { PassbookMobileView } from "./PassbookMobileView";


interface PassbookScreenProps {
  user: any;
  onNavigate: (screen: string) => void;
}

interface Transaction {
  id: string;
  date: string;
  billingCycle: string;
  transactionType: string;
  openingBalance: number;
  pending: number;
  currentDemand: number;
  interest: number;
  principalAmount: number;
  interestAmount: number;
  debit: number;
  credit: number;
  runningBalance: number;
  remarks?: string;
  source?: string;
}

export function PassbookScreen({ user, onNavigate }: PassbookScreenProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  // Filter states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [billingCycle, setBillingCycle] = useState("all");
  const [transactionType, setTransactionType] = useState("all");
  const [asOnDate, setAsOnDate] = useState(new Date().toISOString().split("T")[0]);

  // Use connections from user prop (real API data)
  const connections = user?.connections || [];

  // Find selected consumer data
  const [selectedConnection, setSelectedConnection] = useState<string>(
    connections[0]?.consumerID?.toString() || ""
  );
  const consumerData = connections.find(
    (conn) => conn.consumerID?.toString() === selectedConnection
  );

  // For propertyData, use from consumerData if available
  const propertyData = consumerData
    ? {
      ward: consumerData.wardName,
      zone: consumerData.zoneName,
      propertyNo: consumerData.propertyNo,
    }
    : { ward: "", zone: "", propertyNo: "" };

  // TODO: API Integration - Fetch passbook transactions from backend
  // API Endpoint: GET /api/water-tax/citizen/passbook?connectionId={connectionId}&fromDate={fromDate}&toDate={toDate}
  const [transactions] = useState<Transaction[]>([
    {
      id: "TXN-001",
      date: "15/12/2024",
      billingCycle: "Dec 2024",
      transactionType: "Current Demand",
      openingBalance: 8230.0,
      pending: 8230.0,
      currentDemand: 7220.0,
      interest: 165.0,
      principalAmount: 7220.0,
      interestAmount: 165.0,
      debit: 7385.0,
      credit: 0,
      runningBalance: 15615.0,
      source: "Monthly Bill Generation",
      remarks: "December 2024 billing cycle",
    },
    {
      id: "TXN-002",
      date: "10/12/2024",
      billingCycle: "Dec 2024",
      transactionType: "Payment",
      openingBalance: 15615.0,
      pending: 0,
      currentDemand: 0,
      interest: 0,
      principalAmount: 0,
      interestAmount: 0,
      debit: 0,
      credit: 5000.0,
      runningBalance: 10615.0,
      source: "Online Payment",
      remarks: "Payment received via UPI",
    },
    {
      id: "TXN-003",
      date: "15/11/2024",
      billingCycle: "Nov 2024",
      transactionType: "Current Demand",
      openingBalance: 5615.0,
      pending: 5615.0,
      currentDemand: 6850.0,
      interest: 112.0,
      principalAmount: 6850.0,
      interestAmount: 112.0,
      debit: 6962.0,
      credit: 0,
      runningBalance: 12577.0,
      source: "Monthly Bill Generation",
      remarks: "November 2024 billing cycle",
    },
    {
      id: "TXN-004",
      date: "15/10/2024",
      billingCycle: "Oct 2024",
      transactionType: "Current Demand",
      openingBalance: 0,
      pending: 0,
      currentDemand: 5615.0,
      interest: 0,
      principalAmount: 5615.0,
      interestAmount: 0,
      debit: 5615.0,
      credit: 0,
      runningBalance: 5615.0,
      source: "Monthly Bill Generation",
      remarks: "October 2024 billing cycle",
    },
    {
      id: "TXN-005",
      date: "05/10/2024",
      billingCycle: "Sep 2024",
      transactionType: "Payment",
      openingBalance: 5615.0,
      pending: 0,
      currentDemand: 0,
      interest: 0,
      principalAmount: 0,
      interestAmount: 0,
      debit: 0,
      credit: 5615.0,
      runningBalance: 0,
      source: "Cash Payment",
      remarks: "Cash payment at municipal office",
    },
  ]);

  const totalPrincipal = transactions.reduce((sum, t) => sum + t.principalAmount, 0);
  const totalInterest = transactions.reduce((sum, t) => sum + t.interestAmount, 0);
  const netPayable = consumerData?.totalOutstanding;

  const handleApplyFilter = () => {
    // TODO: API Integration - Apply filters and fetch filtered data
    toast.success("Filter applied successfully!");
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

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailDrawer(true);
  };

  const handleDownloadPDF = () => {
    // TODO: API Integration - Generate and download PDF
    // API Endpoint: GET /api/water-tax/citizen/passbook/pdf?connectionId={connectionId}
    toast.success("Downloading passbook PDF...");
  };

  const handleExportExcel = () => {
    // TODO: API Integration - Generate and download Excel
    // API Endpoint: GET /api/water-tax/citizen/passbook/excel?connectionId={connectionId}
    toast.success("Exporting to Excel...");
  };

  const handlePrint = () => {
    toast.success("Opening print dialog...");
    window.print();
  };

  // Inline WaterBillPassbook component for PassbookScreen only
  const WaterBillPassbook = ({ connections }: { connections: any[] }) => (
    <div className="mb-4">
      <h3 className="text-lg font-bold mb-2"></h3>

    </div>
  );

  return (
    <>
      {/* Mobile View - Show on screens < 1024px */}
      <div className="lg:hidden">
        <PassbookMobileView
          transactions={transactions}
          selectedConnection={selectedConnection}
          connections={connections}
          onConnectionChange={setSelectedConnection}
          onDownloadPDF={handleDownloadPDF}
          onPrint={handlePrint}
          onExportExcel={handleExportExcel}
        />
      </div>

      {/* Desktop View - Show on screens >= 1024px */}
      <main className="hidden lg:flex items-center justify-center h-fit bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 sm:mt-[50px] overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 w-full p-2 flex-1 flex flex-col overflow-hidden">
          {/* PAGE HEADER */}
          <div className="flex-shrink-0 bg-white/95 backdrop-blur-sm shadow-md rounded-xl border-2 border-blue-200 mb-1 px-3 py-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl text-gray-900 font-bold">
                    💧 Water Bill Passbook
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Consumer Ledger & Outstanding Details
                  </p>
                </div>
              </div>

              {/* Connection Selector & Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Connection Selector */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg sm:rounded-xl shadow-lg p-[2px]">
                  <div className="bg-white rounded-md sm:rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md sm:rounded-lg flex items-center justify-center shadow-md">
                      <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 flex-1 sm:flex-none px-0 py-1">
                      <label className="text-xs sm:text-sm text-gray-900 whitespace-nowrap font-bold">
                        Select Connection:
                      </label>
                      <select
                        value={selectedConnection}
                        onChange={(e) => {
                          setSelectedConnection(e.target.value);
                          toast.success("Connection changed successfully!");
                        }}
                        className="w-full sm:w-[240px] h-8 sm:h-10 px-2 sm:px-3 border-2 border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 hover:border-purple-500 transition-all shadow-sm rounded-md text-xs sm:text-sm font-semibold"
                      >
                        {connections.map((conn) => (

                          <option key={conn.consumerID} value={conn.consumerID}>
                            {propertyData.propertyNo} - {conn.consumerNo} - {conn.categoryName}
                          </option>
                        ))}

                      </select>
                    </div>
                  </div>
                </div>

                {/* Vertical Divider - Hidden on mobile */}
                <div className="hidden sm:block h-12 w-px bg-gradient-to-b from-purple-300 via-pink-300 to-purple-300" />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <Button
                    onClick={handleDownloadPDF}
                    variant="outline"
                    className="border-2 border-red-300 text-red-600 hover:bg-red-50 text-xs sm:text-sm h-9"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Download PDF</span>
                    <span className="sm:hidden">PDF</span>
                  </Button>
                  <Button
                    onClick={handleExportExcel}
                    variant="outline"
                    className="border-2 border-green-300 text-green-600 hover:bg-green-50 text-xs sm:text-sm h-9"
                  >
                    <FileSpreadsheet className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Export Excel</span>
                    <span className="sm:hidden">Excel</span>
                  </Button>
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm h-9"
                  >
                    <Printer className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* CONSUMER SUMMARY CARD */}
          <Card className="flex-shrink-0 mb-1 p-2 sm:p-3 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-blue-200">
            <div className="flex flex-col lg:flex-row items-center gap-2">
              {/* Consumer Details Grid */}
              <div className="w-full lg:flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">

                    Consumer No
                  </label>
                  <p className="text-sm text-gray-900 font-semibold">
                    {consumerData?.consumerNo || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">Consumer Name</label>
                  <p className="text-sm text-gray-900 font-semibold">
                    {consumerData?.consumerNameEnglish || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Droplets className="w-3 h-3" />
                    Connection Type
                  </label>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 border border-blue-300 font-semibold">
                    {consumerData?.connectionTypeName || "-"}
                  </span>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    Category
                  </label>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-700 border border-purple-300 font-semibold">
                    {consumerData?.connectionCategoryName || "-"}
                  </span>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">Pipe Size</label>
                  <p className="text-sm text-gray-900 font-semibold">
                    {consumerData?.pipeSizeName || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">Property No</label>
                  <p className="text-sm text-gray-900 font-semibold">
                    {propertyData.propertyNo || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">Status</label>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-700 border border-green-300 font-semibold">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {consumerData?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Outstanding Summary Badges */}
              {/* You may need to fetch and display outstanding, pending, demand from another API */}
              <div className="w-full lg:w-auto overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 sm:gap-1 min-w-min">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg p-2 sm:p-3 text-white shadow-lg min-w-[100px] sm:min-w-[100px]">
                    <p className="text-[10px] sm:text-xs opacity-90 mb-1">Total Outstanding</p>
                    <p className="text-lg sm:text-2xl font-bold">
                      {/* Replace with real value if available */}
                      ₹{(consumerData?.totalOutstanding ?? 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg p-2 sm:p-3 text-white shadow-lg min-w-[100px] sm:min-w-[100px]">
                    <p className="text-[10px] sm:text-xs opacity-90 mb-1">Pending Amount</p>
                    <p className="text-lg sm:text-xl font-bold">
                      ₹{(consumerData?.pendingAmount ?? 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg p-2 sm:p-3 text-white shadow-lg min-w-[100px] sm:min-w-[100px]">
                    <p className="text-[10px] sm:text-xs opacity-90 mb-1">Current Demand</p>
                    <p className="text-lg sm:text-xl font-bold">
                      ₹{(consumerData?.currentDemand ?? 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* WaterBillPassbook Table for all connections */}
          <WaterBillPassbook connections={connections} />

          {/* FILTER SECTION */}
          <Card className="pt-3 pb-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 overflow-hidden">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full px-0 sm:px-1 py-1 flex items-center justify-between hover:bg-blue-100/50 transition-colors"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-xs sm:text-sm text-gray-900 font-semibold">Filters</span>
                {(fromDate || toDate || billingCycle !== "all" || transactionType !== "all") && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-500 text-white font-semibold">
                    Active
                  </span>
                )}
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
                  <div className="px-3 sm:px-0 pb-4 sm:pb-6 pt-2 bg-white border-t border-blue-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-4 mb-4">
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block font-semibold">
                          From Date
                        </label>
                        <Input
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          className="h-9 text-sm border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block font-semibold">
                          To Date
                        </label>
                        <Input
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="h-9 text-sm border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block font-semibold">
                          Billing Cycle
                        </label>
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
                        <label className="text-xs text-gray-600 mb-1 block font-semibold">
                          Transaction Type
                        </label>
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
                        <label className="text-xs text-gray-600 mb-1 block font-semibold">
                          As-On Date
                        </label>
                        <Input
                          type="date"
                          value={asOnDate}
                          onChange={(e) => setAsOnDate(e.target.value)}
                          className="h-9 text-sm border-gray-300"
                        />
                      </div>
                      <Button
                        onClick={handleApplyFilter}
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-3 py-2 sm:mt-5 text-sm"
                      >
                        <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Apply Filter
                      </Button>
                      <Button
                        onClick={handleResetFilter}
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-100 sm:mt-5 text-sm"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* PASSBOOK TABLE */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-2 border-blue-200 overflow-hidden">
            <div className="p-3 sm:p-4 border-b-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <h2 className="text-base sm:text-lg text-gray-900 flex items-center gap-2 font-bold">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Transaction Ledger
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">
                Total {transactions.length} transactions
              </p>
            </div>

            <div className="overflow-x-auto scrollbar-hide">
              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2 font-semibold">
                    No Passbook Entries Available
                  </h3>
                  <p className="text-sm text-gray-600 text-center max-w-md">
                    निवडलेल्या कालावधीसाठी कोणतीही खातेवही नोंद उपलब्ध नाही
                  </p>
                  <p className="text-xs text-gray-500 mt-4">
                    Try adjusting your filter criteria
                  </p>
                </div>
              ) : (
                <table className="w-full border-collapse min-w-[800px]">
                  <thead className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white sticky top-0 z-10">
                    <tr>
                      <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-[10px] sm:text-xs border-r border-blue-400 font-semibold whitespace-nowrap">
                        Date
                      </th>
                      <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-[10px] sm:text-xs border-r border-blue-400 font-semibold whitespace-nowrap">
                        Billing Cycle
                      </th>
                      <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-[10px] sm:text-xs border-r border-blue-400 font-semibold whitespace-nowrap">
                        Transaction Type
                      </th>
                      <th className="px-2 sm:px-3 py-2 sm:py-3 text-right text-[10px] sm:text-xs border-r border-blue-400 font-semibold whitespace-nowrap">
                        Opening Balance
                      </th>
                      <th className="px-2 sm:px-3 py-2 sm:py-3 text-right text-[10px] sm:text-xs border-r border-blue-400 font-semibold whitespace-nowrap">
                        Pending (Arrear)
                      </th>
                      <th className="px-2 sm:px-3 py-2 sm:py-3 text-right text-[10px] sm:text-xs border-r border-blue-400 font-semibold whitespace-nowrap">
                        Current Demand
                      </th>
                      <th className="px-2 sm:px-3 py-2 sm:py-3 text-right text-[10px] sm:text-xs border-r border-blue-400 font-semibold whitespace-nowrap">
                        Interest
                      </th>
                      <th className="px-2 sm:px-3 py-2 sm:py-3 text-right text-[10px] sm:text-xs border-r border-blue-400 font-semibold whitespace-nowrap">
                        Principal (₹)
                      </th>
                      <th className="px-2 sm:px-3 py-2 sm:py-3 text-right text-[10px] sm:text-xs border-r border-blue-400 font-semibold whitespace-nowrap">
                        Interest (₹)
                      </th>
                      <th className="px-2 sm:px-3 py-2 sm:py-3 text-right text-[10px] sm:text-xs border-r border-blue-400 font-semibold whitespace-nowrap">
                        Debit (₹)
                      </th>
                      <th className="px-2 sm:px-3 py-2 sm:py-3 text-right text-[10px] sm:text-xs border-r border-blue-400 font-semibold whitespace-nowrap">
                        Credit (₹)
                      </th>
                      <th className="px-2 sm:px-3 py-2 sm:py-3 text-right text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                        Running Balance (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr
                        key={transaction.id}
                        onClick={() => handleRowClick(transaction)}
                        className={`${index % 2 === 0 ? "bg-white" : "bg-blue-50/30"
                          } hover:bg-blue-100/50 transition-colors cursor-pointer border-b border-gray-200`}
                      >
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 border-r border-gray-200 whitespace-nowrap">
                          {transaction.date}
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 border-r border-gray-200">
                          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs bg-blue-50 border-blue-300 text-blue-700 font-semibold whitespace-nowrap">
                            {transaction.billingCycle}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 border-r border-gray-200">
                          <span
                            className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-semibold whitespace-nowrap ${transaction.transactionType === "Payment"
                              ? "bg-green-100 text-green-700 border border-green-300"
                              : "bg-orange-100 text-orange-700 border border-orange-300"
                              }`}
                          >
                            {transaction.transactionType}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-right text-gray-900 border-r border-gray-200 whitespace-nowrap">
                          ₹{transaction.openingBalance.toFixed(2)}
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-right text-orange-600 border-r border-gray-200 font-semibold whitespace-nowrap">
                          {transaction.pending > 0
                            ? `₹${transaction.pending.toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-right text-blue-600 border-r border-gray-200 font-semibold whitespace-nowrap">
                          {transaction.currentDemand > 0
                            ? `₹${transaction.currentDemand.toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-right text-purple-600 border-r border-gray-200 italic whitespace-nowrap">
                          {transaction.interest > 0
                            ? `₹${transaction.interest.toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-right text-gray-900 border-r border-gray-200 whitespace-nowrap">
                          {transaction.principalAmount > 0
                            ? `₹${transaction.principalAmount.toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-right text-purple-600 border-r border-gray-200 italic whitespace-nowrap">
                          {transaction.interestAmount > 0
                            ? `₹${transaction.interestAmount.toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-right text-red-600 border-r border-gray-200 font-semibold whitespace-nowrap">
                          {transaction.debit > 0
                            ? `₹${transaction.debit.toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-right text-green-600 border-r border-gray-200 font-semibold whitespace-nowrap">
                          {transaction.credit > 0
                            ? `₹${transaction.credit.toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-right text-gray-900 font-bold whitespace-nowrap">
                          ₹{transaction.runningBalance.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {transactions.length > 0 && (
              <div className="flex items-center justify-between px-6 py-2 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Showing 1 to {transactions.length} of {transactions.length} entries
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs border-gray-300 hover:bg-gray-100"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs border-gray-300 bg-blue-500 text-white hover:bg-blue-600"
                  >
                    1
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs border-gray-300 hover:bg-gray-100"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* TRANSACTION DETAIL DRAWER */}
        {showDetailDrawer && selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xl mx-4"
            >
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <Info className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">
                      Transaction Details / व्यवहार तपशील
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Complete information about this transaction
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">Transaction ID</label>
                        <p className="text-sm text-gray-900 font-semibold">
                          {selectedTransaction.id}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Date</label>
                        <p className="text-sm text-gray-900 font-semibold">
                          {selectedTransaction.date}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Billing Cycle</label>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 border border-blue-300 font-semibold">
                          {selectedTransaction.billingCycle}
                        </span>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Type</label>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${selectedTransaction.transactionType === "Payment"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-orange-100 text-orange-700 border border-orange-300"
                            }`}
                        >
                          {selectedTransaction.transactionType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
                    <h3 className="text-sm text-gray-900 mb-3 font-semibold">
                      Amount Breakdown
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Opening Balance:</span>
                        <span className="text-gray-900 font-semibold">
                          ₹{selectedTransaction.openingBalance.toFixed(2)}
                        </span>
                      </div>
                      {selectedTransaction.pending > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Pending Amount:</span>
                          <span className="text-orange-600 font-semibold">
                            ₹{selectedTransaction.pending.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {selectedTransaction.currentDemand > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Current Demand:</span>
                          <span className="text-blue-600 font-semibold">
                            ₹{selectedTransaction.currentDemand.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {selectedTransaction.interestAmount > 0 && (
                        <div className="flex items-center justify-between text-sm bg-purple-50 p-2 rounded">
                          <span className="text-gray-600">Interest Charged:</span>
                          <span className="text-purple-600 font-semibold">
                            ₹{selectedTransaction.interestAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        {selectedTransaction.debit > 0 && (
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Debit:</span>
                            <span className="text-red-600 font-semibold">
                              ₹{selectedTransaction.debit.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {selectedTransaction.credit > 0 && (
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Credit:</span>
                            <span className="text-green-600 font-semibold">
                              ₹{selectedTransaction.credit.toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm bg-blue-50 p-2 rounded mt-2">
                          <span className="text-gray-900 font-semibold">
                            Running Balance:
                          </span>
                          <span className="text-blue-700 text-lg font-bold">
                            ₹{selectedTransaction.runningBalance.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedTransaction.source && (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
                      <label className="text-xs text-gray-500">Source / स्रोत</label>
                      <p className="text-sm text-gray-900 mt-1 font-semibold">
                        {selectedTransaction.source}
                      </p>
                    </div>
                  )}

                  {selectedTransaction.remarks && (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
                      <label className="text-xs text-gray-500">Remarks / टिप्पण्या</label>
                      <p className="text-sm text-gray-700 mt-1">
                        {selectedTransaction.remarks}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => setShowDetailDrawer(false)}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                  >
                    Close
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </main>
    </>
  );
}
