"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Water.Citizen/Badge";
import { Checkbox } from "@/components/common/Water.Citizen/Checkbox";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/common/Water.Citizen/Select";
import {
  Droplets,
  Building,
  Home,
  Megaphone,
  CheckCircle,
  CreditCard,
  IndianRupee,
  Activity,
  MessageSquare,
  TrendingDown,
  TrendingUp,
  Calendar,
  FileText,
  User,
  MapPin,
  Eye, // <-- Add this to your lucide-react import
} from "lucide-react";
import { clearCitizenSession } from "@/app/[locale]/water-tax/actions";
import { useRouter } from "next/navigation";
import { Drawer } from "@/components/common/Drawer";
import { Dialog, DialogContent } from "@/components/common/Water.Citizen";
import { NewConnectionFormContent } from "@/components/modules/water-tax/screens/shared/NewConnectionForm";
import { TrackStatus } from "@/components/modules/water-tax/screens/shared/TrackStatus";
import { NewGrievanceForm } from "@/components/modules/water-tax/screens/grievances/NewGrievanceForm";

// Dummy components for tabs (replace with actual implementations)
const MyConnections = () => <div>MyConnections Component</div>;
const NewConnectionForm = () => <div>NewConnectionForm Component</div>;
const PayBills = () => <div>PayBills Component</div>;
const SubmitReading = () => <div>SubmitReading Component</div>;
const WaterBillPassbook = ({ connections }: { connections: any[] }) => (
  <div>
    <h3 className="text-lg font-bold mb-2">Water Bill Passbook</h3>
    {connections.length === 0 ? (
      <div className="text-gray-400">No records found.</div>
    ) : (
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">Consumer No</th>
            <th className="px-2 py-1 border">Property No</th>
            <th className="px-2 py-1 border">Bill Amount</th>
            <th className="px-2 py-1 border">Due Date</th>
            <th className="px-2 py-1 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((conn: any) => (
            <tr key={conn.id || conn.consumerID || conn.consumerNo}>
              <td className="px-2 py-1 border">{conn.consumerNo || conn.consumerNumber || conn.consumerID || "N/A"}</td>
              <td className="px-2 py-1 border">{conn.propertyNo || conn.propertyNumber || "N/A"}</td>
              <td className="px-2 py-1 border">₹{(conn.billAmount || 0).toLocaleString()}</td>
              <td className="px-2 py-1 border">{conn.dueDate || "N/A"}</td>
              <td className="px-2 py-1 border">
                {(conn.status || (conn.isActive ? "Active" : "Inactive"))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
const Grievances = () => <div>Grievances Component</div>;


// Remove mock data and use only real data from user.connections (API payload)
function DetailedConnectionCard({
  conn,
  selectedConnections,
  handleConnectionCheck,
}: {
  conn: any;
  selectedConnections: string[];
  handleConnectionCheck: (id: string, checked: boolean) => void;
}) {
  const id = conn.id || conn.consumerID || conn.consumerNo;
  const isSelected = selectedConnections.includes(id);

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Summary View - Always Visible */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 flex items-center justify-between border-b-2 border-blue-100">
        <div className="flex items-center gap-3 flex-1">
          {/* Always show checkbox for payment selection */}
          <Checkbox
            checked={isSelected}
            onChange={(checked: boolean) => handleConnectionCheck(id, checked)}
            className="data-[state=checked]:bg-green-500 bg-white border-2 border-gray-300"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Render consumer number instead of index/number */}
              <h3 className="text-gray-900 font-bold text-sm sm:text-base">
                {conn.consumerNo || conn.consumerNumber || conn.consumerID || "N/A"}
              </h3>
              <Badge
                className={
                  conn.connectionTypeName === "Residential"
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : conn.connectionTypeName === "Commercial"
                      ? "bg-purple-100 text-purple-700 border-purple-200"
                      : "bg-orange-100 text-orange-700 border-orange-200"
                }
              >
                {conn.categoryName || "N/A"}
              </Badge>
              <Badge
                className={
                  (conn.status === "Active" || conn.isActive)
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }
              >
                {conn.status || (conn.isActive ? "Active" : "Inactive")}
              </Badge>
            </div>
            <p className="text-gray-600 text-xs mt-0.5">
              Property: {conn.propertyNo || conn.propertyNumber || conn.propertyId || "N/A"} • Size: {conn.sizeName || conn.size || "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {conn.billAmount > 0 ? (
            <>
              <div className="flex flex-row gap-2">
                {/* Partial Payment (Current Month Bill) */}
                <div className="bg-blue-100 rounded-lg px-3 py-1.5 border-2 border-blue-200">
                  <p className="text-blue-700 text-[10px] font-medium">Pending Demand</p>
                  <p className="text-blue-900 font-bold text-sm">
                    ₹{((conn.consumption || 0) * 12).toLocaleString()}
                  </p>
                </div>
                {/* Total Demand (Including Previous Dues) */}
                <div className="bg-orange-100 rounded-lg px-3 py-1.5 border-2 border-orange-200">
                  <p className="text-orange-700 text-[10px] font-medium">Current Demand</p>
                  <p className="text-orange-900 font-bold text-sm">
                    ₹{conn.billAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-green-100 px-3 py-1 rounded-full border-2 border-green-200">
              <p className="text-green-700 text-xs font-semibold">No Dues</p>
            </div>
          )}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              // View details functionality can be added here
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            View Details
          </Button>
        </div>
      </div>
      {/* Quick Info Bar */}
      <div className="bg-gray-50 px-4 py-2">
        <div className="flex items-center gap-4 flex-wrap text-xs">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-gray-700 line-clamp-1">{conn.addressEnglish || conn.address || "N/A"}</span>
          </div>
          {/* Zone Name */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-700 line-clamp-1">
              {conn.zoneName || conn.zoneNo || "N/A"}
            </span>
          </div>
          {/* Ward Name */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-700 line-clamp-1">
              {conn.wardName || conn.wardNo || "N/A"}
            </span>
          </div>
          {conn.meterType === "meter" && (
            <>
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                <span className="text-gray-700">{conn.consumption || "N/A"} KL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-gray-700">Meter: {conn.meterNumber || "N/A"}</span>
              </div>
            </>
          )}
          {conn.billAmount > 0 && (
            <div className="ml-auto">
              <span className="text-orange-600 font-medium">Due: {conn.dueDate || "N/A"}</span>
            </div>
          )}
        </div>
      </div>
      {/* Dialog for details (optional, not implemented here) */}
      {/* ...existing code for dialog if needed... */}
    </div>
  );
}

interface DashboardProps {
  user: any;
  onLogout: () => void;
  onNavigate: (screen: string) => void;
}

export function DashboardScreen({ user, onLogout, onNavigate }: DashboardProps) {
  // State definitions
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentProperty, setCurrentProperty] = useState<string>(
    user?.selectedProperty || user?.propertyNumber || ""
  );
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showCalculatorDialog, setShowCalculatorDialog] = useState(false);
  const [selectedUsageConnection, setSelectedUsageConnection] = useState<string>("all");
  const [showNewConnectionDialog, setShowNewConnectionDialog] = useState(false);
  const [showTrackStatusDrawer, setShowTrackStatusDrawer] = useState(false);
  const [showNewGrievanceForm, setShowNewGrievanceForm] = useState(false);

  const router = useRouter();

  // Auto-select property if only one property exists
  useEffect(() => {
    if (user?.allProperties?.length === 1 && !currentProperty) {
      setCurrentProperty(user.allProperties[0].propertyNumber);
    }
  }, [user?.allProperties, currentProperty]);

  // Use only real API data
  const selectedPropertyNumber = currentProperty || user?.propertyNumber || user?.selectedProperty;
  const allConnectionDetails = user.connections || [];
  const userConnections = allConnectionDetails.filter((conn: any) =>
    conn.propertyNumber === selectedPropertyNumber ||
    conn.propertyNo === selectedPropertyNumber
  );

  // Only connections with billAmount > 0 are payable
  const payableConnections = userConnections.filter((c: any) => c.billAmount > 0);
  const payableIds = payableConnections.map((c: any) => c.id);

  // Calculate totalDue and pendingBillsCount from userConnections
  const totalDue = userConnections.reduce(
    (sum: number, conn: any) => sum + (conn.currentDemand || conn.billAmount || conn.dueAmount || 0),
    0
  );
  const pendingBillsCount = userConnections.filter(
    (conn: any) => (conn.currentDemand || conn.billAmount || conn.dueAmount || 0) > 0
  ).length;
  const totalConsumption = userConnections.reduce((sum: number, conn: any) => sum + (conn.consumption || 0), 0);

  // Select all logic: by default, select all payable connections on mount
  useEffect(() => {
    setSelectedConnections(payableIds);
  }, [selectedPropertyNumber, userConnections.length]);

  // Select All checkbox logic
  const handleSelectAllConnections = (checked: boolean) => {
    if (checked) {
      setSelectedConnections(payableIds);
    } else {
      setSelectedConnections([]);
    }
  };

  // Individual checkbox logic
  const handleConnectionCheck = (connectionId: string, checked: boolean) => {
    if (checked) {
      setSelectedConnections(prev => Array.from(new Set([...prev, connectionId])));
    } else {
      setSelectedConnections(prev => prev.filter(id => id !== connectionId));
    }
  };

  // Payment logic for demonstration
  const totalSelectedAmount = selectedConnections.reduce((sum: number, id: string) => {
    const conn = userConnections.find((c: any) => c.id === id);
    return sum + (conn?.currentDemand || 0);
  }, 0);

  // Property switch logic
  const handlePropertySwitch = (propertyNumber: string) => {
    setCurrentProperty(propertyNumber);
  };

  // Quick Actions
  const quickActions = [
    {
      label: "New Connection",
      icon: FileText,
      color: "from-blue-500 to-blue-500",
      action: () => setShowNewConnectionDialog(true),
    },
    {
      label: "Track Status",
      icon: Activity,
      color: "from-blue-500 to-blue-500",
      action: () => setShowTrackStatusDrawer(true),
    },
    {
      label: "Raise Complaints",
      icon: MessageSquare,
      color: "from-blue-500 to-blue-500",
      action: () => setShowNewGrievanceForm(true),
    },
  ];

  // Add missing handler for payment button in connection card
  const handlePaySelected = () => {
    setShowPaymentDialog(true);
  };

  // Main UI
  return (
    <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full mx-auto space-y-3 pt-20 md:pt-24"
      ></motion.div>

      {/* Dashboard Main Layout */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch">
        {/* Property Dropdown Selector */}
        <Card className="w-full lg:w-[260px] bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-3 shadow-md flex-shrink-0 px-[12px] py-[2px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-[10px] font-medium text-gray-600 mb-0.5 block">
                Select Property
              </label>
              <Select value={currentProperty} onValueChange={handlePropertySwitch}>
                <SelectTrigger className="h-9 bg-white border-2 border-blue-300 hover:border-blue-400 focus:border-blue-500 font-semibold text-blue-900 rounded-lg shadow-sm">
                  <SelectValue>
                    {/* Always show property number and address if selected */}
                    {(() => {
                      const selectedProp = user.allProperties.find((p: any) => p.propertyNumber === currentProperty);
                      if (selectedProp) {
                        return (
                          <div className="flex items-center gap-2">
                            <Home className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                            <span className="font-bold text-blue-900 text-sm flex-shrink-0">{selectedProp.propertyNumber}</span>
                            <span className="text-gray-400 flex-shrink-0">•</span>
                            <span className="text-xs text-gray-600 truncate">{selectedProp.address}</span>
                          </div>
                        );
                      }
                      return (
                        <div className="flex items-center gap-2">
                          <Home className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span className="font-bold text-blue-900 text-sm flex-shrink-0">Select a property</span>
                        </div>
                      );
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-blue-200 rounded-lg shadow-lg p-1">
                  {user.allProperties.map((property: any) => (
                    <SelectItem key={property.propertyNumber} value={property.propertyNumber} className="hover:bg-blue-50 rounded-lg transition">
                      <div className="flex items-start gap-2 py-1">
                        <Home className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">{property.propertyNumber}</span>
                            {currentProperty === property.propertyNumber && (
                              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span className="line-clamp-1">{property.address}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-blue-600 mt-0.5">
                            <Droplets className="w-3 h-3" />
                            <span className="font-medium">{property.connectionCount} {property.connectionCount === 1 ? 'Connection' : 'Connections'}</span>
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* News Marquee Section - Now visible on all screens */}
        <Card className="flex-1 min-w-0 h-fit bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 border-2 border-blue-300 shadow-md overflow-hidden p-[0px]">
          <div className="flex items-center gap-3 h-fit p-3 px-[0px] py-[0px] mx-[0px] my-[1px]">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 overflow-hidden">
              {/* Continuous marquee animation using keyframes */}
              <div
                className="flex items-center gap-6 whitespace-nowrap"
                style={{
                  animation: "marquee 25s linear infinite",
                  minWidth: "max-content",
                }}
              >
                {/* Item 1 */}
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    🎉 Free Meter Installation - Starting January 2026
                  </span>
                  <Badge className="bg-white/20 text-white border-0 text-[10px] px-2 py-0.5">New</Badge>
                </div>
                <span className="text-white/40 text-lg">•</span>
                {/* Item 2 */}
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    💧 Rainwater Harvesting - Subsidy up to ₹10,000
                  </span>
                  <Badge className="bg-white/20 text-white border-0 text-[10px] px-2 py-0.5">New</Badge>
                </div>
                <span className="text-white/40 text-lg">•</span>
                {/* Item 3 */}
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    💳 Digital Payments Bonus - Cashback on online bills
                  </span>
                  <Badge className="bg-white/20 text-white border-0 text-[10px] px-2 py-0.5">New</Badge>
                </div>
                <span className="text-white/40 text-lg">•</span>
                {/* Item 4 */}
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    🏠 Low-Income Housing - 50% connection fee waiver
                  </span>
                  <Badge className="bg-white/20 text-white border-0 text-[10px] px-2 py-0.5">New</Badge>
                </div>
                {/* Repeat items for seamless loop */}
                <span className="text-white/40 text-lg">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    🎉 Free Meter Installation - Starting January 2026
                  </span>
                  <Badge className="bg-white/20 text-white border-0 text-[10px] px-2 py-0.5">New</Badge>
                </div>
                <span className="text-white/40 text-lg">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    💧 Rainwater Harvesting - Subsidy up to ₹10,000
                  </span>
                  <Badge className="bg-white/20 text-white border-0 text-[10px] px-2 py-0.5">New</Badge>
                </div>
                <span className="text-white/40 text-lg">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    💳 Digital Payments Bonus - Cashback on online bills
                  </span>
                  <Badge className="bg-white/20 text-white border-0 text-[10px] px-2 py-0.5">New</Badge>
                </div>
                <span className="text-white/40 text-lg">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    🏠 Low-Income Housing - 50% connection fee waiver
                  </span>
                  <Badge className="bg-white/20 text-white border-0 text-[10px] px-2 py-0.5">New</Badge>
                </div>
              </div>
              {/* Add marquee keyframes to global CSS if not present */}
              <style jsx global>{`
                @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
              `}</style>
            </div>
          </div>
        </Card>

        {/* Quick Action Buttons */}
        <div className="w-full lg:w-auto flex flex-wrap gap-2 lg:gap-2 flex-shrink-0 p-[0px]">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 300,
              }}
            >
              <Button
                className={`w-auto px-3 py-4 rounded-xl bg-gradient-to-r ${action.color} border-0 shadow-lg hover:shadow-2xl text-white transition-all relative overflow-hidden group h-auto`}
                onClick={action.action}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.6 }}
                />
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                    <action.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-xs font-bold">
                    {action.label}
                  </span>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
        <StatsCard
          title="Active Connections"
          value={userConnections.length.toString()
          }
          change={userConnections.length > 1 ? "Multiple properties" : "Single property"}
          icon={Droplets}
          color="from-blue-500 to-cyan-500"
          trend="up"
        />
        <StatsCard
          title="Total Due"
          value={`₹${totalDue.toLocaleString()}`}
          change={`${pendingBillsCount} pending ${pendingBillsCount === 1 ? "bill" : "bills"}`}
          icon={IndianRupee}
          color="from-orange-500 to-red-500"
          trend="neutral"
        />
        <StatsCard
          title="Water Consumed"
          value={`${totalConsumption} KL`}
          change="Current month total"
          icon={Activity}
          color="from-teal-500 to-emerald-500"
          trend="neutral"
          onClick={() => setShowCalculatorDialog(true)}
        />
        <StatsCard
          title="Open Grievances"
          value="0"
          change="Response pending"
          icon={MessageSquare}
          color="from-purple-500 to-pink-500"
          trend="neutral"
          onClick={() => setActiveTab("grievances")}
        />
      </div>

      {/* My Connections and Usage/Activity */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
        {/* My Connections Card */}
        <Card className="p-4 sm:p-5 shadow-lg border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50">
          {/* Header with Checkbox */}
          <div className="flex items-center gap-3 mb-[4px] mt-[0px] mr-[0px] ml-[0px]">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg text-gray-900 font-bold">My Connections</h3>
              <p className="text-xs text-gray-600">Property {selectedPropertyNumber}</p>
            </div>
            {/* Add Select All checkbox to the right */}
            {/* <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={selectedConnections.length > 0 && selectedConnections.length === payableIds.length}
                onCheckedChange={(checked) => handleSelectAllConnections(Boolean(checked))}
                tabIndex={0}
              />
              <label
                htmlFor="select-all"
                className="text-sm text-gray-700 cursor-pointer font-medium"
                style={{ userSelect: "none" }}
              >
                Select All
              </label>
            </div> */}
          </div>
          {/* Selected Amount Card */}
          {selectedConnections.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-2"
            >
              <Card className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg p-[12px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-90">{selectedConnections.length} connection(s) selected</p>
                    <p className="text-xl font-bold">
                      ₹{selectedConnections.reduce((sum, id) => {
                        const conn = userConnections.find((c: any) => c.id === id);
                        return sum + (conn?.currentDemand || conn?.billAmount || conn?.dueAmount || 0);
                      }, 0).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={handlePaySelected}
                    disabled={paymentProcessing}
                    className=" text-green-600 hover:gray-100 h-8 text-xs px-3"
                  >
                    <CreditCard className="w-3 h-3 mr-1" />
                    Pay Now
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
          {/* Connections List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {userConnections.length === 0 ? (
              <div className="text-center text-gray-400 py-10">
                No connections found for this property.
              </div>
            ) : (
              userConnections.map((conn: any) => (
                <DetailedConnectionCard
                  key={conn.id}
                  conn={conn}
                  selectedConnections={selectedConnections}
                  handleConnectionCheck={handleConnectionCheck}
                />
              ))
            )}
          </div>
        </Card>

        {/* Right Side - Usage Stats and Recent Activity */}
        <div className="grid grid-cols-2 gap-4">
          {/* Water Usage Stats */}
          <Card className="p-3 sm:p-4 shadow-lg border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50">
            {/* Header row: logo/heading left, select right */}
            <div className="flex items-center justify-between mb-4">
              {/* Left: Logo and Heading */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg text-gray-900 font-bold">Usage</h3>
                  <p className="text-xs text-gray-600">Overview</p>
                </div>
              </div>
              {/* Right: Select Connection or Selected Connection */}
              <div className="flex-shrink-0">
                <Select value={selectedUsageConnection} onValueChange={setSelectedUsageConnection}>
                  <SelectTrigger className="w-[210px] h-8 text-xs bg-white border-blue-200">
                    {/* Show selected connection info or placeholder */}
                    {selectedUsageConnection === "all" ? (
                      <span className="text-gray-500">Select Connection</span>
                    ) : (
                      (() => {
                        const selectedConn = userConnections.find((conn: any) => conn.id === selectedUsageConnection);
                        if (!selectedConn) return <span className="text-gray-500">Select Connection</span>;
                        return (
                          <span className="flex flex-col items-start">
                            <span className="font-bold text-blue-900">{selectedConn.consumerNo || selectedConn.consumerNumber || selectedConn.consumerID || selectedConn.id}</span>
                            <span className="text-xs text-gray-500">{selectedConn.addressEnglish || selectedConn.address || ""}</span>
                          </span>
                        );
                      })()
                    )}
                  </SelectTrigger>
                  <SelectContent className="z-[9999] h-auto bg-white" position="popper" sideOffset={5}>
                    <SelectItem key="all" value="all">All Connections</SelectItem>
                    {userConnections.map((conn: any) => (
                      <SelectItem key={conn.id} value={conn.id}>
                        <div className="flex flex-col">
                          <span className="font-bold text-blue-900">{conn.consumerNo || conn.consumerNumber || conn.consumerID || conn.id}</span>
                          <span className="text-xs text-gray-500">{conn.addressEnglish || conn.address || ""}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-xl p-3 border-2 border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <p className="text-xs text-gray-600">This Month</p>
                </div>
                <p className="text-xl font-bold text-blue-600">
                  {selectedUsageConnection === "all"
                    ? userConnections.reduce((sum: number, conn: any) => sum + (conn.consumption || 0), 0)
                    : userConnections.find((conn: any) => conn.id === selectedUsageConnection)?.consumption || 0
                  } KL
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">12% less</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 border-2 border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee className="w-4 h-4 text-orange-600" />
                  <p className="text-xs text-gray-600">Total Bill</p>
                </div>
                <p className="text-xl font-bold text-orange-600">
                  ₹{(selectedUsageConnection === "all"
                    ? userConnections.reduce((sum: number, conn: any) => sum + (conn.billAmount || 0), 0)
                    : userConnections.find((conn: any) => conn.id === selectedUsageConnection)?.billAmount || 0
                  ).toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600">Due Soon</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">Last 6 Months Consumption</p>
              <div className="space-y-2">
                {[
                  { month: 'Aug', usage: 45, color: 'from-blue-400 to-blue-500' },
                  { month: 'Sep', usage: 52, color: 'from-cyan-400 to-cyan-500' },
                  { month: 'Oct', usage: 48, color: 'from-blue-400 to-blue-500' },
                  { month: 'Nov', usage: 41, color: 'from-teal-400 to-teal-500' },
                  { month: 'Dec', usage: 38, color: 'from-green-400 to-green-500' },
                  {
                    month: 'Jan', usage: selectedUsageConnection === "all"
                      ? userConnections.reduce((sum: number, conn: any) => sum + (conn.consumption || 0), 0)
                      : userConnections.find((conn: any) => conn.id === selectedUsageConnection)?.consumption || 0
                    , color: 'from-emerald-400 to-emerald-500'
                  },
                ].map((data, index) => (
                  <motion.div
                    key={data.month}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-xs text-gray-600 w-8 font-medium">{data.month}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.usage}%` }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.6, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${data.color} rounded-full flex items-center justify-end pr-2`}
                      >
                        <span className="text-xs text-white font-semibold">{data.usage} KL</span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-3 sm:p-4 shadow-lg border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg text-gray-900 font-bold">Recent Activity</h3>
                  <p className="text-xs text-gray-600">Latest Updates</p>
                </div>
              </div>
              {/* <Button
                variant="ghost"
                size="sm"
                className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-100"
              >
                View All
              </Button> */}
            </div>
            <div className="space-y-3">
              {/* Bill Payment Activity */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-3 border-2 border-green-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">Bill Payment</p>
                    <p className="text-xs text-gray-600 truncate">Paid ₹982 for WC-2025-002</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
              </motion.div>
              {/* Connection Active Activity */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-3 border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">Connection Active</p>
                    <p className="text-xs text-gray-600 truncate">WC-2025-002 activated</p>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>
              </motion.div>
              {/* New Bill Generated Activity */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-3 border-2 border-orange-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">New Bill Generated</p>
                    <p className="text-xs text-gray-600 truncate">Bill #BILL-2025-001 - ₹1,275</p>
                    <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </Card>
        </div>
      </div>

      {/* Passbook Section - Uncomment to use
      <div className="mt-8">
        <WaterBillPassbook connections={user.connections || []} />
      </div>
      */}

      {/* New Connection Drawer */}
      <Drawer
        open={showNewConnectionDialog}
        onClose={() => setShowNewConnectionDialog(false)}
        title={
          <div className="flex items-center gap-2 text-xl font-bold text-blue-700">
            <Building className="w-6 h-6" />
            New Water Connection
          </div>
        }
        width="xl"
      >
        <NewConnectionFormContent
          data-testid="new-connection-form"
          user={user}
          selectedProperty={user.allProperties.find((p: any) => p.propertyNumber === currentProperty)}
          onBack={() => setShowNewConnectionDialog(false)}
          onSubmitSuccess={() => setShowNewConnectionDialog(false)}
        />
      </Drawer>
      {/* New Connection Dialog */}
      <Dialog open={showNewConnectionDialog}>
        <DialogContent className="max-w-4xl">
          <NewConnectionFormContent
            data-testid="new-connection-form"
            user={user}
            selectedProperty={user.allProperties.find((p: any) => p.propertyNumber === currentProperty)}
            onBack={() => setShowNewConnectionDialog(false)}
            onSubmitSuccess={() => setShowNewConnectionDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Track Status Drawer */}
      <TrackStatus 
        open={showTrackStatusDrawer}
        onOpenChange={setShowTrackStatusDrawer}
      />

      {/* New Grievance Form */}
      <NewGrievanceForm
        open={showNewGrievanceForm}
        onClose={() => setShowNewGrievanceForm(false)}
        onSubmit={(data) => {
          console.log("New grievance registered:", data);
          setShowNewGrievanceForm(false);
        }}
      />
    </main>
  );
}

// Stats Card Component
function StatsCard({ title, value, change, icon: Icon, color, trend, onClick }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }
      }
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="p-3 sm:p-4 lg:p-5 shadow-lg border bg-white relative overflow-hidden">
        <div
          className={`absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`}
        ></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex items-baseline gap-1.5 sm:gap-2 min-w-0 flex-1">
                <h3 className="text-sm sm:text-base text-gray-600 whitespace-nowrap">
                  {title}:
                </h3>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-900 font-bold truncate">
                  {value}
                </p>
              </div>
            </div>
            {trend === "up" && (
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
            )}
            {trend === "down" && (
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
            )}
          </div>
        </div>
      </Card>
    </motion.div >
  );
}
