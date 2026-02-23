"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Building,
    Droplets,
    CreditCard,
    Activity,
    MapPin,
    Home,
    Megaphone,
    Calculator,
    FileText,
    MessageSquare,
    Plus,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { toast } from "sonner";

interface DashboardMobileViewProps {
    user: any;
    onNavigate: (screen: string) => void;
}

export function DashboardMobileView({ user, onNavigate }: DashboardMobileViewProps) {
    const [currentProperty, setCurrentProperty] = useState<string>(
        user?.selectedProperty || user?.propertyNumber || ""
    );
    const [selectedConnections, setSelectedConnections] = useState<string[]>([]);

    // Auto-select property if only one exists
    useEffect(() => {
        if (user?.allProperties?.length === 1 && !currentProperty) {
            setCurrentProperty(user.allProperties[0].propertyNumber);
        }
    }, [user?.allProperties, currentProperty]);

    const selectedPropertyNumber = currentProperty || user?.propertyNumber || user?.selectedProperty;
    const allConnectionDetails = user.connections || [];
    const userConnections = allConnectionDetails.filter((conn: any) =>
        conn.propertyNumber === selectedPropertyNumber ||
        conn.propertyNo === selectedPropertyNumber
    );

    const payableConnections = userConnections.filter((c: any) => c.billAmount > 0);
    const payableIds = payableConnections.map((c: any) => c.id);

    const totalDue = userConnections.reduce(
        (sum: number, conn: any) => sum + (conn.currentDemand || conn.billAmount || conn.dueAmount || 0),
        0
    );
    const pendingBillsCount = userConnections.filter(
        (conn: any) => (conn.currentDemand || conn.billAmount || conn.dueAmount || 0) > 0
    ).length;
    const totalConsumption = userConnections.reduce((sum: number, conn: any) => sum + (conn.consumption || 0), 0);

    useEffect(() => {
        setSelectedConnections(payableIds);
    }, [selectedPropertyNumber, userConnections.length]);

    const quickActions = [
        { icon: Droplets, label: "Track Status", color: "from-blue-500 to-cyan-600", action: () => onNavigate("submitReading") },
        { icon: FileText, label: "Passbook", color: "from-purple-500 to-pink-600", action: () => onNavigate("passbook") },
        { icon: MessageSquare, label: "Grievances", color: "from-orange-500 to-red-600", action: () => onNavigate("grievances") },
        { icon: Calculator, label: "Calculator", color: "from-green-500 to-emerald-600", action: () => onNavigate("calculator") },
    ];

    const handlePaySelected = () => {
        toast.success("Payment initiated!");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-4 shadow-lg sticky top-0 z-20">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Droplets className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold">Dashboard</h1>
                        <p className="text-xs opacity-90">Water Tax Portal</p>
                    </div>
                </div>

                {/* Property Selector */}
                <select
                    value={currentProperty}
                    onChange={(e) => setCurrentProperty(e.target.value)}
                    className="w-full bg-white text-gray-900 rounded-lg px-3 py-2.5 text-sm font-semibold shadow-md"
                >
                    {user.allProperties?.map((property: any) => (
                        <option key={property.propertyNumber} value={property.propertyNumber}>
                            {property.propertyNumber} - {property.address}
                        </option>
                    ))}
                </select>
            </div>

            <div className="p-4 space-y-4">
                {/* News Marquee */}
                <Card className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 border-2 border-blue-300 shadow-lg overflow-hidden p-0">
                    <div className="flex items-center gap-3 p-3">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                            <Megaphone className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div
                                className="whitespace-nowrap text-white text-sm font-medium"
                                style={{
                                    animation: "marquee 25s linear infinite",
                                }}
                            >
                                🎉 Free Meter Installation &nbsp;&nbsp;•&nbsp;&nbsp; 💧 Rainwater Harvesting Subsidy &nbsp;&nbsp;•&nbsp;&nbsp; 💳 Digital Payment Bonus
                            </div>
                            <style jsx>{`
                @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
              `}</style>
                        </div>
                    </div>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action, index) => (
                        <motion.div
                            key={index}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                onClick={action.action}
                                className={`w-full h-24 bg-gradient-to-br ${action.color} text-white shadow-lg border-0 flex flex-col items-center justify-center gap-2`}
                            >
                                <action.icon className="w-8 h-8" />
                                <span className="text-xs font-semibold">{action.label}</span>
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-0">
                    <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <span className="text-xs opacity-90">Total Due</span>
                        </div>
                        <p className="text-2xl font-bold">₹{totalDue.toLocaleString()}</p>
                        <p className="text-xs opacity-75 mt-1">{pendingBillsCount} bills</p>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Droplets className="w-5 h-5" />
                            </div>
                            <span className="text-xs opacity-90">Usage</span>
                        </div>
                        <p className="text-2xl font-bold">{totalConsumption} KL</p>
                        <p className="text-xs opacity-75 mt-1">This month</p>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Activity className="w-5 h-5" />
                            </div>
                            <span className="text-xs opacity-90">Connections</span>
                        </div>
                        <p className="text-2xl font-bold">{userConnections.length}</p>
                        <p className="text-xs opacity-75 mt-1">Active</p>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <span className="text-xs opacity-90">Grievances</span>
                        </div>
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-xs opacity-75 mt-1">Open</p>
                    </Card>
                </div>

                {/* Payment Summary */}
                {selectedConnections.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-xs opacity-90">{selectedConnections.length} connection(s) selected</p>
                                    <p className="text-2xl font-bold">
                                        ₹{selectedConnections.reduce((sum, id) => {
                                            const conn = userConnections.find((c: any) => c.id === id);
                                            return sum + (conn?.currentDemand || conn?.billAmount || conn?.dueAmount || 0);
                                        }, 0).toLocaleString()}
                                    </p>
                                </div>
                                <Button
                                    onClick={handlePaySelected}
                                    className="bg-white text-green-600 hover:bg-gray-100 h-10 px-4 shadow-md"
                                >
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Pay Now
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Connections List */}
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-2 border-blue-200">
                    <div className="p-4 border-b-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <Building className="w-5 h-5 text-blue-600" />
                            My Connections
                        </h2>
                        <p className="text-xs text-gray-600 mt-1">Property: {selectedPropertyNumber}</p>
                    </div>

                    <div className="p-3 space-y-3">
                        {userConnections.length === 0 ? (
                            <div className="text-center py-8">
                                <Building className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">No connections found for this property.</p>
                            </div>
                        ) : (
                            userConnections.map((conn: any) => (
                                <Card key={conn.id} className="border-2 border-gray-200 p-3">
                                    {/* Connection checkbox */}
                                    {conn.billAmount > 0 && (
                                        <div className="flex items-center mb-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedConnections.includes(conn.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedConnections(prev => [...prev, conn.id]);
                                                    } else {
                                                        setSelectedConnections(prev => prev.filter(id => id !== conn.id));
                                                    }
                                                }}
                                                className="w-5 h-5 text-blue-600 rounded"
                                            />
                                            <label className="ml-2 text-sm font-semibold text-gray-900">
                                                Select for payment
                                            </label>
                                        </div>
                                    )}

                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Droplets className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-bold text-gray-900">
                                                    {conn.consumerNo || conn.consumerNumber || conn.consumerID}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600">{conn.categoryName}</p>
                                        </div>
                                        {conn.billAmount > 0 ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-700 border border-red-300 font-semibold">
                                                Due: ₹{conn.billAmount}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-700 border border-green-300 font-semibold">
                                                Paid
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-gray-500" />
                                            <span className="text-gray-700">Zone: {conn.zoneNo || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Home className="w-3 h-3 text-gray-500" />
                                            <span className="text-gray-700">Ward: {conn.wardNo || "N/A"}</span>
                                        </div>
                                        {conn.consumption && (
                                            <div className="flex items-center gap-1">
                                                <Activity className="w-3 h-3 text-gray-500" />
                                                <span className="text-gray-700">{conn.consumption} KL</span>
                                            </div>
                                        )}
                                        {conn.meterNumber && (
                                            <div className="flex items-center gap-1">
                                                <Activity className="w-3 h-3 text-gray-500" />
                                                <span className="text-gray-700">M: {conn.meterNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </Card>

                {/* New Connection Button */}
                <Button
                    onClick={() => toast.info("Add new connection feature coming soon!")}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white h-12 shadow-lg"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Connection
                </Button>
            </div>
        </div>
    );
}
