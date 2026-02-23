"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    Plus,
    Search,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronRight,
    Calendar,
    User,
    FileText,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { toast } from "sonner";

interface GrievancesMobileViewProps {
    onNavigate: (screen: string) => void;
}

type GrievanceStatus = "Open" | "In Progress" | "Resolved" | "Rejected";
type GrievancePriority = "High" | "Medium" | "Low";

interface Grievance {
    id: string;
    ticketNo: string;
    subject: string;
    category: string;
    description: string;
    status: GrievanceStatus;
    priority: GrievancePriority;
    dateSubmitted: string;
    lastUpdate: string;
    response?: string;
}

const mockGrievances: Grievance[] = [
    {
        id: "1",
        ticketNo: "GRV-2024-001",
        subject: "Water Supply Issue",
        category: "Supply",
        description: "No water supply for the last 3 days in our area",
        status: "In Progress",
        priority: "High",
        dateSubmitted: "2024-02-08",
        lastUpdate: "2024-02-09",
        response: "Team has been dispatched to check the main pipeline",
    },
    {
        id: "2",
        ticketNo: "GRV-2024-002",
        subject: "Bill Discrepancy",
        category: "Billing",
        description: "Incorrect bill amount charged this month",
        status: "Open",
        priority: "Medium",
        dateSubmitted: "2024-02-10",
        lastUpdate: "2024-02-10",
    },
];

export function GrievancesMobileView({ onNavigate: _onNavigate }: GrievancesMobileViewProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [showNewGrievanceForm, setShowNewGrievanceForm] = useState(false);
    const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);

    const getStatusIcon = (status: GrievanceStatus) => {
        switch (status) {
            case "Open":
                return <AlertCircle className="w-4 h-4" />;
            case "In Progress":
                return <Clock className="w-4 h-4" />;
            case "Resolved":
                return <CheckCircle className="w-4 h-4" />;
            case "Rejected":
                return <XCircle className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: GrievanceStatus) => {
        switch (status) {
            case "Open":
                return "bg-blue-500 text-blue-50";
            case "In Progress":
                return "bg-yellow-500 text-yellow-50";
            case "Resolved":
                return "bg-green-500 text-green-50";
            case "Rejected":
                return "bg-gray-500 text-gray-50";
        }
    };

    const getPriorityColor = (priority: GrievancePriority) => {
        switch (priority) {
            case "High":
                return "bg-red-100 text-red-700 border-red-300";
            case "Medium":
                return "bg-orange-100 text-orange-700 border-orange-300";
            case "Low":
                return "bg-blue-100 text-blue-700 border-blue-300";
        }
    };

    const filteredGrievances = mockGrievances.filter((g) => {
        const matchesSearch =
            g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.ticketNo.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "All" || g.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 shadow-lg sticky top-0 z-20">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Grievances</h1>
                        <p className="text-xs opacity-90">Manage your complaints</p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Search & Filter */}
                <Card className="p-3 border-0 shadow-md bg-white">
                    <div className="space-y-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by ticket or subject..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {["All", "Open", "In Progress", "Resolved", "Rejected"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${filterStatus === status
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* New Grievance Button */}
                <Button
                    onClick={() => {
                        setShowNewGrievanceForm(true);
                        toast.success("Opening new grievance form...");
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 h-12 shadow-lg text-base font-bold rounded-xl"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Submit New Grievance
                </Button>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { label: "Total", value: mockGrievances.length, color: "bg-blue-500" },
                        { label: "Open", value: mockGrievances.filter((g) => g.status === "Open").length, color: "bg-yellow-500" },
                        { label: "Progress", value: mockGrievances.filter((g) => g.status === "In Progress").length, color: "bg-orange-500" },
                        { label: "Resolved", value: mockGrievances.filter((g) => g.status === "Resolved").length, color: "bg-green-500" },
                    ].map((stat) => (
                        <Card key={stat.label} className="p-2 text-center border-0 shadow-sm">
                            <div className={`${stat.color} text-white text-xl font-bold rounded-md py-1 mb-1`}>
                                {stat.value}
                            </div>
                            <p className="text-[10px] text-gray-600 font-medium">{stat.label}</p>
                        </Card>
                    ))}
                </div>

                {/* Grievances List */}
                <div className="space-y-3">
                    {filteredGrievances.length === 0 ? (
                        <Card className="p-8 text-center border-0 shadow-sm bg-white">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <MessageSquare className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-1">No Grievances Found</h3>
                            <p className="text-xs text-gray-500">Try adjusting your search or filter</p>
                        </Card>
                    ) : (
                        filteredGrievances.map((grievance) => (
                            <motion.div
                                key={grievance.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => setSelectedGrievance(grievance)}
                            >
                                <Card className="p-3 border-0 shadow-md bg-white hover:shadow-lg transition-shadow active:scale-[0.98]">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-gray-500">{grievance.ticketNo}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityColor(grievance.priority)}`}>
                                                    {grievance.priority}
                                                </span>
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">{grievance.subject}</h3>
                                        </div>
                                        <div className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${getStatusColor(grievance.status)}`}>
                                            {getStatusIcon(grievance.status)}
                                            <span className="text-[10px]">{grievance.status}</span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{grievance.description}</p>

                                    {/* Meta Info */}
                                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{new Date(grievance.dateSubmitted).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FileText className="w-3 h-3" />
                                                <span>{grievance.category}</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </div>

                                    {/* Response Preview */}
                                    {grievance.response && (
                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                            <div className="flex items-start gap-2">
                                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <User className="w-3 h-3 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[10px] text-gray-500 font-medium mb-0.5">Official Response</p>
                                                    <p className="text-xs text-gray-700 line-clamp-2">{grievance.response}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Grievance Detail Modal */}
            <AnimatePresence>
                {selectedGrievance && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                        onClick={() => setSelectedGrievance(null)}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-t-2xl z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold mb-1">Grievance Details</h2>
                                        <p className="text-xs opacity-90">{selectedGrievance.ticketNo}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedGrievance(null)}
                                        className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 space-y-4">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 mb-2">{selectedGrievance.subject}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(selectedGrievance.status)} flex items-center gap-1`}>
                                            {getStatusIcon(selectedGrievance.status)}
                                            {selectedGrievance.status}
                                        </span>
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getPriorityColor(selectedGrievance.priority)}`}>
                                            {selectedGrievance.priority} Priority
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
                                    <p className="text-sm text-gray-700">{selectedGrievance.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Category</p>
                                        <p className="text-sm text-gray-900 font-semibold">{selectedGrievance.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Date Submitted</p>
                                        <p className="text-sm text-gray-900 font-semibold">
                                            {new Date(selectedGrievance.dateSubmitted).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {selectedGrievance.response && (
                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3">
                                        <div className="flex items-start gap-2 mb-2">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-blue-900">Official Response</p>
                                                <p className="text-[10px] text-blue-600">Last updated: {new Date(selectedGrievance.lastUpdate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700">{selectedGrievance.response}</p>
                                    </div>
                                )}

                                <Button
                                    onClick={() => setSelectedGrievance(null)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 h-11"
                                >
                                    Close
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
