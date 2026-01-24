"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  Input,
  Button,
} from "@/components/common/Water.Citizen";
import {
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  AlertCircle,
} from "lucide-react";
import { TrackStatus } from "./TrackStatus";
import { NewGrievanceForm } from "./NewGrievanceForm";

interface GrievancesScreenProps {
  onNavigate: (screen: string) => void;
}

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-blue-500";
    case "In Progress":
      return "bg-yellow-500";
    case "Resolved":
      return "bg-green-500";
    case "Rejected":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-500";
    case "Medium":
      return "bg-orange-500";
    case "Low":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

export function GrievancesScreen({ onNavigate }: GrievancesScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewGrievance, setShowNewGrievance] = useState(false);
  const [showTrackDialog, setShowTrackDialog] = useState(false);
  const [selectedTrackingId, setSelectedTrackingId] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const grievances = [
    {
      id: "GRV-2026-023",
      connectionId: "CON-2026-001",
      connectionType: "Commercial",
      connectionCategory: "Meter",
      propertyNo: "PROP-2026-001",
      category: "Billing Issue",
      subject: "Incorrect meter reading in bill",
      description:
        "The meter reading shown in last month bill is incorrect. Actual reading is 1200 but bill shows 1350.",
      status: "In Progress",
      priority: "High",
      submittedDate: "Jan 2, 2026",
      lastUpdate: "Jan 5, 2026",
      assignedTo: "Officer - Priya Sharma",
      updates: [
        {
          date: "Jan 5, 2026",
          by: "Priya Sharma",
          message:
            "We have verified your complaint and found the discrepancy. A field officer will visit your property for meter verification within 2 days.",
        },
        {
          date: "Jan 3, 2026",
          by: "System",
          message: "Grievance assigned to Water Tax Officer - Ward 5",
        },
        {
          date: "Jan 2, 2026",
          by: "Rajesh Kumar",
          message: "Grievance submitted",
        },
      ],
      expectedResolution: "Jan 12, 2026",
    },
    {
      id: "GRV-2025-018",
      connectionId: "CON-2026-002",
      connectionType: "Domestic",
      connectionCategory: "Non-Meter",
      propertyNo: "PROP-2026-001",
      category: "Water Supply",
      subject: "Low water pressure",
      description:
        "Water pressure is very low during morning hours (6 AM to 9 AM). Unable to fill overhead tank.",
      status: "Resolved",
      priority: "Medium",
      submittedDate: "Dec 25, 2025",
      lastUpdate: "Dec 29, 2025",
      assignedTo: "Officer - Amit Patel",
      resolvedDate: "Dec 29, 2025",
      resolution:
        "Main pipeline pressure issue was identified and fixed. Water pressure has been restored to normal levels.",
      updates: [
        {
          date: "Dec 29, 2025",
          by: "Amit Patel",
          message:
            "Issue resolved. Main pipeline pressure adjusted. Please check and confirm.",
        },
        {
          date: "Dec 27, 2025",
          by: "Amit Patel",
          message:
            "Field inspection completed. Issue identified in main pipeline pressure. Maintenance scheduled for Dec 29.",
        },
        {
          date: "Dec 25, 2025",
          by: "System",
          message: "Grievance assigned to Water Supply Officer - Ward 8",
        },
        {
          date: "Dec 25, 2025",
          by: "Rajesh Kumar",
          message: "Grievance submitted",
        },
      ],
    },
    {
      id: "GRV-2025-015",
      connectionId: "CON-2026-001",
      connectionType: "Commercial",
      connectionCategory: "Meter",
      propertyNo: "PROP-2026-001",
      category: "Connection",
      subject: "Water leakage at meter point",
      description:
        "There is continuous water leakage at the meter connection point. Water is being wasted.",
      status: "Resolved",
      priority: "High",
      submittedDate: "Dec 20, 2025",
      lastUpdate: "Dec 23, 2025",
      assignedTo: "Officer - Priya Sharma",
      resolvedDate: "Dec 22, 2025",
      resolution:
        "Meter connection replaced. Leakage stopped. No charges for wasted water.",
      updates: [
        {
          date: "Dec 23, 2025",
          by: "System",
          message: "Grievance closed after confirmation",
        },
        {
          date: "Dec 22, 2025",
          by: "Priya Sharma",
          message: "Meter connection replaced. Issue resolved. Please verify.",
        },
        {
          date: "Dec 21, 2025",
          by: "Priya Sharma",
          message: "Field team dispatched for immediate repair",
        },
        {
          date: "Dec 20, 2025",
          by: "System",
          message: "Grievance marked as urgent and assigned",
        },
        {
          date: "Dec 20, 2025",
          by: "Rajesh Kumar",
          message: "Grievance submitted",
        },
      ],
    },
  ];

  const filteredGrievances = grievances.filter(
    (grv) =>
      grv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grv.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grv.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openGrievances = filteredGrievances.filter(
    (g) => g.status === "Open" || g.status === "In Progress"
  );
  const resolvedGrievances = filteredGrievances.filter(
    (g) => g.status === "Resolved"
  );
  const rejectedGrievances = filteredGrievances.filter(
    (g) => g.status === "Rejected"
  );

  const displayGrievances =
    activeTab === "all"
      ? filteredGrievances
      : activeTab === "open"
        ? openGrievances
        : activeTab === "resolved"
          ? resolvedGrievances
          : rejectedGrievances;

  return (
    <div className="h-[calc(100vh-8rem)] sm:h-[calc(100vh-8rem)] overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 pt-4 sm:mt-[75px] pb-16 sm:pb-0">
      {/* Animated Background Elements */}
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

      <div className="relative z-10 w-full h-full flex flex-col px-3 sm:px-6 py-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">My Grievances</h2>
            <p className="text-xs text-gray-600">
              Submit and track your complaints
            </p>
          </div>
          <Button
            onClick={() => setShowNewGrievance(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            New Grievance
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-2">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => setActiveTab("all")}
          >
            <Card
              className={`p-3 sm:p-4 lg:p-5 shadow-lg border ${
                activeTab === "all"
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200"
              } bg-white relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex items-baseline gap-1.5 sm:gap-2 min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xs lg:text-xl text-gray-600 whitespace-nowrap">
                        Total:
                      </h3>
                      <p className="text-lg sm:text-xs lg:text-xl text-gray-900 font-semibold truncate">
                        {grievances.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => setActiveTab("open")}
          >
            <Card
              className={`p-3 sm:p-4 lg:p-5 shadow-lg border ${
                activeTab === "open"
                  ? "border-yellow-500 ring-2 ring-yellow-200"
                  : "border-gray-200"
              } bg-white relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex items-baseline gap-1.5 sm:gap-2 min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xs lg:text-xl text-gray-600 whitespace-nowrap">
                        In Progress:
                      </h3>
                      <p className="text-lg sm:text-xs lg:text-xl text-gray-900 font-semibold truncate">
                        {
                          grievances.filter((g) => g.status === "In Progress")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => setActiveTab("resolved")}
          >
            <Card
              className={`p-3 sm:p-4 lg:p-5 shadow-lg border ${
                activeTab === "resolved"
                  ? "border-green-500 ring-2 ring-green-200"
                  : "border-gray-200"
              } bg-white relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-teal-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex items-baseline gap-1.5 sm:gap-2 min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xs lg:text-xl text-gray-600 whitespace-nowrap">
                        Resolved:
                      </h3>
                      <p className="text-lg sm:text-xs lg:text-xl text-gray-900 font-semibold truncate">
                        {resolvedGrievances.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => setActiveTab("closed")}
          >
            <Card
              className={`p-3 sm:p-4 lg:p-5 shadow-lg border ${
                activeTab === "closed"
                  ? "border-gray-500 ring-2 ring-gray-300"
                  : "border-gray-200"
              } bg-white relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-500 to-gray-600 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex items-baseline gap-1.5 sm:gap-2 min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xs lg:text-xl text-gray-600 whitespace-nowrap">
                        Rejected:
                      </h3>
                      <p className="text-lg sm:text-xs lg:text-xl text-gray-900 font-semibold truncate">
                        {rejectedGrievances.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Search */}
        <Card className="p-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search grievances by ID, subject, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-8 text-sm bg-white"
            />
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-2">
          <Button
            onClick={() => setActiveTab("all")}
            variant={activeTab === "all" ? "default" : "outline"}
            className={`flex-1 h-9 text-xs ${
              activeTab === "all"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                : ""
            }`}
          >
            All ({grievances.length})
          </Button>
          <Button
            onClick={() => setActiveTab("open")}
            variant={activeTab === "open" ? "default" : "outline"}
            className={`flex-1 h-9 text-xs ${
              activeTab === "open"
                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                : ""
            }`}
          >
            Open ({openGrievances.length})
          </Button>
          <Button
            onClick={() => setActiveTab("resolved")}
            variant={activeTab === "resolved" ? "default" : "outline"}
            className={`flex-1 h-9 text-xs ${
              activeTab === "resolved"
                ? "bg-gradient-to-r from-green-500 to-teal-500"
                : ""
            }`}
          >
            Resolved ({resolvedGrievances.length})
          </Button>
          <Button
            onClick={() => setActiveTab("closed")}
            variant={activeTab === "closed" ? "default" : "outline"}
            className={`flex-1 h-9 text-xs ${
              activeTab === "closed"
                ? "bg-gradient-to-r from-gray-500 to-gray-600"
                : ""
            }`}
          >
            Rejected ({rejectedGrievances.length})
          </Button>
        </div>

        {/* Grievances Table */}
        <div className="flex-1 overflow-hidden">
          <Card className="p-0 shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <table className="w-full">
                <thead
                  className={`text-white sticky top-0 z-10 ${
                    activeTab === "all"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-600"
                      : activeTab === "open"
                        ? "bg-gradient-to-r from-yellow-500 to-orange-600"
                        : activeTab === "resolved"
                          ? "bg-gradient-to-r from-green-500 to-teal-600"
                          : "bg-gradient-to-r from-gray-500 to-gray-600"
                  }`}
                >
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Grievance ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Connection Details
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Submitted
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Last Update
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Assigned To
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayGrievances.map((grievance, index) => (
                    <motion.tr
                      key={grievance.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b border-gray-200 hover:bg-blue-50/50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {grievance.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-500">
                              Consumer:
                            </span>
                            <span className="text-xs font-semibold text-blue-700">
                              {grievance.connectionId}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-500">
                              Type:
                            </span>
                            <span className="text-xs text-gray-700">
                              {grievance.connectionType} -{" "}
                              {grievance.connectionCategory}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-[250px]">
                        {grievance.subject}
                        {grievance.status === "Resolved" &&
                          grievance.resolution && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-xs font-semibold text-green-700 mb-1">
                                Resolution:
                              </p>
                              <p className="text-xs text-gray-600">
                                {grievance.resolution}
                              </p>
                            </div>
                          )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {grievance.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {grievance.submittedDate}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {grievance.lastUpdate}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {grievance.assignedTo}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`${getStatusColor(grievance.status)} text-white border-0 px-2 py-1 text-xs rounded-md inline-block`}
                        >
                          {grievance.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`${getPriorityColor(grievance.priority)} text-white border-0 px-2 py-1 text-xs rounded-md inline-block`}
                        >
                          {grievance.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTrackingId(grievance.id);
                              setShowTrackDialog(true);
                            }}
                            className="h-8 px-3 text-xs bg-white hover:bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                          >
                            Track
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {filteredGrievances.length === 0 && (
          <Card className="p-12 text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm mt-4">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">
              No grievances found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or submit a new grievance
            </p>
            <Button
              onClick={() => setShowNewGrievance(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit New Grievance
            </Button>
          </Card>
        )}
      </div>

      {/* Track Status Dialog */}
      <TrackStatus
        open={showTrackDialog}
        onOpenChange={setShowTrackDialog}
        initialId={selectedTrackingId}
        grievances={grievances}
      />

      {/* New Grievance Form */}
      <NewGrievanceForm
        open={showNewGrievance}
        onClose={() => setShowNewGrievance(false)}
        onSubmit={(data) => {
          console.log("New grievance registered:", data);
          setShowNewGrievance(false);
        }}
      />
    </div>
  );
}
