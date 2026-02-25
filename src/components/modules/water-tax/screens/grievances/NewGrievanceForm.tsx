"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Drawer } from "@/components/common/Drawer";
import { Card } from "@/components/common/Card";
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import {
  UserCircle2,
  MapPin,
  Building2,
  Home,
  Hash,
  FileText,
  Phone,
  CheckCircle,
  User,
  Plug,
  Calendar,
  Upload,
  Eye,
  Trash2,
  Loader2,
  X,
  Check,
  Droplets,
} from "lucide-react";
import { toast } from "sonner";

interface NewGrievanceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function NewGrievanceForm({
  open,
  onClose,
  onSubmit,
}: NewGrievanceFormProps) {
  // TODO: API Integration - Fetch user's connections from backend
  // This mock data should be replaced with actual API call to get connections list
  // API Endpoint: GET /api/water-tax/citizen/connections
  const [availableConnections] = useState([
    {
      id: "CON-2026-001",
      consumerNo: "CON-2026-001",
      upicId: "UPIC123456789",
      propertyNo: "PROP-2026-001",
      address: "123, MG Road, Sector 12, Bangalore - 560001",
      zoneNo: "Zone A",
      wardNo: "5",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      connectionType: "Commercial",
      category: "Meter",
      status: "Active",
      tapSize: "25mm (1 inch)",
    },
    {
      id: "CON-2026-002",
      consumerNo: "CON-2026-002",
      upicId: "UPIC123456789",
      propertyNo: "PROP-2026-001",
      address: "123, MG Road, Sector 12, Bangalore - 560001",
      zoneNo: "Zone A",
      wardNo: "5",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      connectionType: "Domestic",
      category: "Non-Meter",
      status: "Active",
      tapSize: "15mm (1/2 inch)",
    },
    {
      id: "CON-2026-003",
      consumerNo: "CON-2026-003",
      upicId: "UPIC123456789",
      propertyNo: "PROP-2026-001",
      address: "123, MG Road, Sector 12, Bangalore - 560001",
      zoneNo: "Zone A",
      wardNo: "5",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      connectionType: "Industrial",
      category: "Meter",
      status: "Active",
      tapSize: "50mm (2 inch)",
    },
  ]);

  const [selectedConnectionId, setSelectedConnectionId] = useState("");
  const [selectedConsumer, setSelectedConsumer] = useState<any>(null);
  const [editableMobileNumber, setEditableMobileNumber] = useState("243424");
  const [applicationType, setApplicationType] = useState("");
  const [applicationDate, setApplicationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reason, setReason] = useState("");
  const [documentUploads, setDocumentUploads] = useState<{
    [key: string]: { file: File | null; status: string };
  }>({});
  const [viewingDocument, setViewingDocument] = useState<{
    name: string;
    file: File;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [grievanceNumber, setGrievanceNumber] = useState("");

  const handleConnectionSelect = async (connectionId: string) => {
    setSelectedConnectionId(connectionId);

    // TODO: API Integration - Fetch detailed consumer/property details for selected connection
    // This should make an API call to get complete details including:
    // - Consumer details (name, email, mobile, etc.)
    // - Property details (zone, ward, property no, address, etc.)
    // - Connection details (type, category, tap size, status, etc.)
    // API Endpoint: GET /api/water-tax/citizen/connection-details/{connectionId}
    // Response should include all editable and non-editable fields

    // For now, using mock data from local state
    const connection = availableConnections.find(
      (conn) => conn.id === connectionId
    );
    if (connection) {
      setSelectedConsumer(connection);
      toast.success(`Connection ${connection.consumerNo} selected`);
    }

    // Future implementation:
    // try {
    //   const response = await fetch(`/api/water-tax/citizen/connection-details/${connectionId}`);
    //   const data = await response.json();
    //   setSelectedConsumer(data);
    //   setEditableMobileNumber(data.mobile || '');
    //   toast.success(`Connection ${data.consumerNo} selected`);
    // } catch (error) {
    //   toast.error('Failed to fetch connection details');
    // }
  };

  const handleSubmit = async () => {
    if (!selectedConnectionId) {
      toast.error("Please select a connection");
      return;
    }
    if (!applicationType) {
      toast.error("Please select an application type");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please enter a remark");
      return;
    }
    if (!editableMobileNumber || editableMobileNumber.length < 6) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: API Integration - Submit grievance to backend
      // API Endpoint: POST /api/water-tax/citizen/grievances
      // Request Body: {
      //   connectionId: selectedConnectionId,
      //   consumerDetails: selectedConsumer,
      //   applicationType,
      //   applicationDate,
      //   reason,
      //   mobileNumber: editableMobileNumber,
      //   documents: documentUploads (as FormData with file uploads)
      // }
      // Response: { grievanceNumber, status, message }

      // Simulating API call with timeout (remove this in production)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const grvNumber = `GRV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
      setGrievanceNumber(grvNumber);

      toast.success("Grievance submitted successfully!");
      setShowSuccessDialog(true);

      if (onSubmit) {
        onSubmit({
          grievanceNumber: grvNumber,
          applicationType,
          applicationDate,
          reason,
          consumerDetails: selectedConsumer,
          mobileNumber: editableMobileNumber,
          documents: documentUploads,
        });
      }

      setTimeout(() => {
        setShowSuccessDialog(false);
        onClose();
        setApplicationType("");
        setReason("");
        setDocumentUploads({});
        setSelectedConnectionId("");
        setSelectedConsumer(null);
      }, 3000);
    } catch (error) {
      toast.error("Failed to submit grievance. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        title={
          <div className="flex items-center gap-2 text-xl font-bold text-blue-700">
            <FileText className="w-6 h-6" />
            New Grievance Application
          </div>
        }
        width="xl"
      >
        {/* Header Info */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Submit a new grievance regarding your water connection
          </p>
        </div>
        {/* Connection Selector */}
        <div className="mb-4 min-w-[320px] bg-gradient-to-r from-cyan-400 to-teal-500 p-3 rounded-xl shadow-lg border-2 border-cyan-300">
          <label className="text-xs text-white mb-2 block flex items-center gap-1 font-bold">
            <Droplets className="w-4 h-4 text-white" />
            Select Connection <span className="text-red-100">*</span>
          </label>
          <select
            value={selectedConnectionId}
            onChange={(e) => handleConnectionSelect(e.target.value)}
            className="w-full h-10 border-2 border-white/60 bg-white hover:bg-gray-50 transition-colors shadow-md rounded-md px-3"
          >
            <option value="">Choose connection...</option>
            {availableConnections.map((connection) => (
              <option key={connection.id} value={connection.id}>
                {connection.consumerNo} | {connection.connectionType} | {connection.category}
              </option>
            ))}
          </select>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="relative bg-white backdrop-blur-xl rounded-2xl border-2 border-purple-200/50 p-4 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/70 via-pink-50/30 to-blue-50/50 rounded-2xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-400 rounded-t-2xl" />
            <div className="relative z-10 space-y-4">
              {/* Consumer Details */}
              {selectedConsumer && (
                <div className="bg-gradient-to-br from-blue-50/40 via-indigo-50/30 to-purple-50/40 rounded-xl shadow-md border-2 border-blue-200/50 overflow-hidden">
                  <div className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 border-b-2 border-white/30">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <UserCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-white drop-shadow-md font-extrabold">
                        Consumer Details
                      </span>
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    {/* First Row */}
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-1">
                        <label className="text-xs flex items-center gap-1 mb-1 text-blue-700 font-bold">
                          <MapPin className="w-3 h-3 text-blue-600" />
                          Zone
                        </label>
                        <Input
                          type="text"
                          value={selectedConsumer.zoneNo}
                          onChange={(e) =>
                            setSelectedConsumer({
                              ...selectedConsumer,
                              zoneNo: e.target.value,
                            })
                          }
                          className="h-9 text-xs border-2 border-blue-300/60 focus:border-blue-500 bg-white rounded-lg shadow-sm font-semibold"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="text-xs flex items-center gap-1 mb-1 text-indigo-700 font-bold">
                          <Building2 className="w-3 h-3 text-indigo-600" />
                          Ward
                        </label>
                        <Input
                          type="text"
                          value={selectedConsumer.wardNo}
                          onChange={(e) =>
                            setSelectedConsumer({
                              ...selectedConsumer,
                              wardNo: e.target.value,
                            })
                          }
                          className="h-9 text-xs border-2 border-indigo-300/60 focus:border-indigo-500 bg-white rounded-lg shadow-sm font-semibold"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs flex items-center gap-1 mb-1 text-purple-700 font-bold">
                          <Home className="w-3 h-3 text-purple-600" />
                          Property No
                        </label>
                        <Input
                          type="text"
                          value={selectedConsumer.propertyNo}
                          onChange={(e) =>
                            setSelectedConsumer({
                              ...selectedConsumer,
                              propertyNo: e.target.value,
                            })
                          }
                          className="h-9 text-xs border-2 border-purple-300/60 focus:border-purple-500 bg-white rounded-lg shadow-sm font-semibold"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs flex items-center gap-1 mb-1 text-cyan-700 font-bold">
                          <Hash className="w-3 h-3 text-cyan-600" />
                          Consumer No
                        </label>
                        <Input
                          type="text"
                          value={selectedConsumer.consumerNo}
                          disabled
                          className="h-9 text-xs border-2 border-cyan-300/60 bg-cyan-50/50 text-cyan-900 cursor-not-allowed rounded-lg shadow-sm font-semibold"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs flex items-center gap-1 mb-1 text-sky-700 font-bold">
                          <FileText className="w-3 h-3 text-sky-600" />
                          UPIC ID
                        </label>
                        <Input
                          type="text"
                          value={selectedConsumer.upicId}
                          disabled
                          className="h-9 text-xs border-2 border-sky-300/60 bg-sky-50/50 text-sky-900 cursor-not-allowed rounded-lg shadow-sm font-semibold"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs flex items-center gap-1 mb-1 text-emerald-700 font-bold">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          Mobile Number
                        </label>
                        <Input
                          type="text"
                          value={editableMobileNumber}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10);
                            setEditableMobileNumber(value);
                          }}
                          className="h-9 text-xs border-2 border-emerald-300/60 focus:border-emerald-500 bg-white rounded-lg shadow-sm font-semibold"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs flex items-center gap-1 mb-1 text-green-700 font-bold">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          Status
                        </label>
                        <Input
                          type="text"
                          value={selectedConsumer.status}
                          disabled
                          className="h-9 text-xs border-2 border-green-300/60 bg-green-50/50 text-green-900 cursor-not-allowed rounded-lg shadow-sm font-semibold"
                        />
                      </div>
                    </div>
                    {/* Second Row */}
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-2">
                        <label className="text-xs flex items-center gap-1 mb-1 text-blue-700 font-bold">
                          <User className="w-3 h-3 text-blue-600" />
                          Applicant Name
                        </label>
                        <Input
                          type="text"
                          value={selectedConsumer.name}
                          onChange={(e) =>
                            setSelectedConsumer({
                              ...selectedConsumer,
                              name: e.target.value,
                            })
                          }
                          className="h-9 text-xs border-2 border-blue-300/60 focus:border-blue-500 bg-white rounded-lg shadow-sm font-semibold"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs flex items-center gap-1 mb-1 text-teal-700 font-bold">
                          <FileText className="w-3 h-3 text-teal-600" />
                          Email
                        </label>
                        <Input
                          type="email"
                          value={selectedConsumer.email}
                          onChange={(e) =>
                            setSelectedConsumer({
                              ...selectedConsumer,
                              email: e.target.value,
                            })
                          }
                          className="h-9 text-xs border-2 border-teal-300/60 focus:border-teal-500 bg-white rounded-lg shadow-sm font-semibold"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs flex items-center gap-1 mb-1 text-violet-700 font-bold">
                          <Plug className="w-3 h-3 text-violet-600" />
                          Connection Category
                        </label>
                        <select
                          value={selectedConsumer.connectionType}
                          onChange={(e) =>
                            setSelectedConsumer({
                              ...selectedConsumer,
                              connectionType: e.target.value,
                            })
                          }
                          className="h-9 text-xs border-2 border-violet-300/60 focus:border-violet-500 bg-white rounded-lg shadow-sm w-full px-2 font-semibold"
                        >
                          <option value="Commercial">Commercial</option>
                          <option value="Industrial">Industrial</option>
                          <option value="Domestic">Domestic</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs flex items-center gap-1 mb-1 text-pink-700 font-bold">
                          <FileText className="w-3 h-3 text-pink-600" />
                          Connection Type
                        </label>
                        <select
                          value={selectedConsumer.category}
                          onChange={(e) =>
                            setSelectedConsumer({
                              ...selectedConsumer,
                              category: e.target.value,
                            })
                          }
                          className="h-9 text-xs border-2 border-pink-300/60 focus:border-pink-500 bg-white rounded-lg shadow-sm w-full px-2 font-semibold"
                        >
                          <option value="Meter">Meter</option>
                          <option value="Non-Meter">Non-Meter</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs flex items-center gap-1 mb-1 text-amber-700 font-bold">
                          <Droplets className="w-3 h-3 text-amber-600" />
                          Tap Size
                        </label>
                        <select
                          value={selectedConsumer.tapSize}
                          onChange={(e) =>
                            setSelectedConsumer({
                              ...selectedConsumer,
                              tapSize: e.target.value,
                            })
                          }
                          className="h-9 text-xs border-2 border-amber-300/60 focus:border-amber-500 bg-white rounded-lg shadow-sm w-full px-2 font-semibold"
                        >
                          <option value="15mm (1/2 inch)">15mm (1/2 inch)</option>
                          <option value="20mm (3/4 inch)">20mm (3/4 inch)</option>
                          <option value="25mm (1 inch)">25mm (1 inch)</option>
                          <option value="50mm (2 inch)">50mm (2 inch)</option>
                        </select>
                      </div>
                    </div>
                    {/* Third Row - Address */}
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-12">
                        <label className="text-xs flex items-center gap-1 mb-1 text-orange-700 font-bold">
                          <MapPin className="w-3 h-3 text-orange-600" />
                          Address
                        </label>
                        <Input
                          type="text"
                          value={selectedConsumer.address}
                          onChange={(e) =>
                            setSelectedConsumer({
                              ...selectedConsumer,
                              address: e.target.value,
                            })
                          }
                          className="h-9 text-xs border-2 border-orange-300/60 focus:border-orange-500 bg-white rounded-lg shadow-sm font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Application Details */}
              <div className="bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-blue-50/40 rounded-xl shadow-md border-2 border-purple-200/50 overflow-hidden">
                <div className="px-4 py-2.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 border-b-2 border-white/30">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-sm drop-shadow-md font-extrabold">
                      Application Details
                    </span>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="space-y-2 col-span-2">
                      <label className="text-xs flex items-center gap-1.5 font-bold">
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                        Application Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={applicationType}
                        onChange={(e) => setApplicationType(e.target.value)}
                        className="h-9 border-2 border-purple-300/60 focus:border-purple-500 rounded-xl w-full px-2 text-xs"
                      >
                        <option value="">Select type</option>
                        <option value="billing-issue">💰 Billing Issue</option>
                        <option value="water-supply">💧 Water Supply</option>
                        <option value="connection-issue">🔧 Connection Issue</option>
                        <option value="meter-issue">⚙️ Meter Issue</option>
                        <option value="leakage">🚰 Leakage</option>
                        <option value="other">📝 Other</option>
                      </select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-xs flex items-center gap-1.5 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={applicationDate}
                        onChange={(e) => setApplicationDate(e.target.value)}
                        className="h-9 border-2 border-blue-200/70 focus:border-blue-600 rounded-xl px-2 py-1 text-xs"
                      />
                    </div>
                    <div className="space-y-2 col-span-8">
                      <label className="text-xs flex items-center gap-1.5 font-bold">
                        <FileText className="w-3.5 h-3.5 text-orange-600" />
                        Remark <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        placeholder="Enter Remark"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={1}
                        className="w-full min-h-[36px] text-xs border-2 border-orange-200/70 focus:border-orange-600 rounded-xl resize-y px-3 py-2 font-semibold"
                      />
                    </div>
                    {/* Document Uploads */}
                    <div className="space-y-1 col-span-12">
                      <label className="text-xs flex items-center gap-1.5 font-bold text-purple-700">
                        <Upload className="w-4 h-4 text-purple-600" />
                        Upload Documents
                      </label>
                      <div className="bg-white rounded-xl border-2 border-purple-200/60 overflow-hidden shadow-sm">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 border-b-2 border-purple-200/50">
                              <th className="px-2 py-1 text-left text-xs text-purple-900 font-extrabold">Sr. No</th>
                              <th className="px-2 py-1 text-left text-xs text-purple-900 font-extrabold">Document Name</th>
                              <th className="px-2 py-1 text-center text-xs text-purple-900 font-extrabold">Type</th>
                              <th className="px-2 py-1 text-center text-xs text-purple-900 font-extrabold">Status</th>
                              <th className="px-2 py-1 text-center text-xs text-purple-900 font-extrabold">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { id: "aadhar", name: "Aadhar Card", type: "Required" },
                              { id: "property-tax", name: "Property Tax Receipt", type: "Required" },
                              { id: "identity", name: "Identity Proof", type: "Required" },
                              { id: "address", name: "Address Proof", type: "Optional" },
                            ].map((doc, index) => {
                              const uploaded = documentUploads[doc.id];
                              const isUploaded = uploaded && uploaded.file;
                              return (
                                <tr key={index} className="border-b border-purple-100/50 hover:bg-purple-50/30 transition-colors">
                                  <td className="px-2 py-1.5 text-xs text-gray-700 font-semibold">{index + 1}</td>
                                  <td className="px-2 py-1.5 text-xs text-gray-800 font-semibold">
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                                      {doc.name}
                                      {isUploaded && (
                                        <span className="text-[9px] text-gray-500 truncate max-w-[120px]">({uploaded.file?.name})</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-2 py-1.5 text-center">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${doc.type === "Required" ? "bg-red-100 text-red-700 border border-red-300/50" : "bg-blue-100 text-blue-700 border border-blue-300/50"}`}>{doc.type}</span>
                                  </td>
                                  <td className="px-2 py-1.5 text-center">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${isUploaded ? "bg-green-100 text-green-700 border border-green-300/50" : "bg-gray-100 text-gray-700 border border-gray-300/50"}`}>{isUploaded ? "✓ Uploaded" : "Not Uploaded"}</span>
                                  </td>
                                  <td className="px-2 py-1.5 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      {isUploaded ? (
                                        <>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 px-2 border-blue-300 hover:bg-blue-50 text-blue-700 rounded-lg text-[10px]"
                                            onClick={() => {
                                              if (uploaded.file) {
                                                setViewingDocument({ name: doc.name, file: uploaded.file });
                                              }
                                            }}
                                          >
                                            <Eye className="w-3 h-3" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 px-2 border-red-300 hover:bg-red-50 text-red-700 rounded-lg text-[10px]"
                                            onClick={() => {
                                              setDocumentUploads((prev) => {
                                                const newUploads = { ...prev };
                                                delete newUploads[doc.id];
                                                return newUploads;
                                              });
                                              toast.success(`${doc.name} removed`);
                                            }}
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </>
                                      ) : (
                                        <Button
                                          size="sm"
                                          className="h-7 px-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg shadow-sm text-[10px]"
                                          onClick={() => {
                                            const input = document.createElement("input");
                                            input.type = "file";
                                            input.accept = ".pdf,.jpg,.jpeg,.png";
                                            input.onchange = (e: any) => {
                                              if (e.target.files && e.target.files[0]) {
                                                const file = e.target.files[0];
                                                setDocumentUploads((prev) => ({
                                                  ...prev,
                                                  [doc.id]: { file, status: "Uploaded" },
                                                }));
                                                toast.success(`${doc.name} uploaded successfully!`);
                                              }
                                            };
                                            input.click();
                                          }}
                                        >
                                          <Upload className="w-3 h-3 mr-1" />
                                          Upload
                                        </Button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-purple-200 flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !selectedConnectionId ||
                    !applicationType ||
                    !reason.trim() ||
                    !editableMobileNumber ||
                    isSubmitting
                  }
                  className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all px-8 rounded-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Grievance
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Success Drawer */}
        <Drawer
          open={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          title={
            <div className="flex items-center gap-2 text-green-700 font-bold text-lg">
              <Check className="w-6 h-6 text-green-600" />
              Grievance Submitted Successfully!
            </div>
          }
          width="sm"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-600 mb-2">
              Grievance Submitted Successfully!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your grievance has been successfully registered in the system
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                Your grievance has been registered with ID:
              </p>
              <p className="text-xl text-green-700 font-extrabold">
                {grievanceNumber}
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              You will receive updates on your registered mobile number and
              email address.
            </p>
            <div className="flex justify-center mt-6">
              <Button onClick={() => setShowSuccessDialog(false)} className="bg-green-600 text-white px-6 py-2 rounded-lg shadow">
                Close
              </Button>
            </div>
          </div>
        </Drawer>

        {/* Document Viewer Drawer */}
        <Drawer
          open={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
          title={
            <div className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-blue-600" />
              {viewingDocument?.name}
            </div>
          }
          width="md"
        >
          {viewingDocument && (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                File: {viewingDocument.file?.name}
              </p>
              <p className="text-xs text-gray-500">
                Size: {viewingDocument.file ? (viewingDocument.file.size / 1024).toFixed(2) : 0} KB
              </p>
              <p className="text-xs text-gray-500 mt-4">
                Preview not available. Document is ready for submission.
              </p>
            </div>
          )}
        </Drawer>
      </Drawer>
    </>
  );
}