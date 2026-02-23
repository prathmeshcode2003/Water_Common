"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, FileText, CheckCircle, Clock, AlertCircle,
  MapPin, User, Calendar, Phone, Mail, Download,
  MessageSquare, Package, Droplet, ChevronRight, Copy,
  Shield, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from "@/components/common/Card";
import { Badge } from '@/components/common/Water.Citizen/Badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/common/Water.Citizen/Dialog';
import { toast } from 'sonner';

interface TrackStatusProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialId?: string;
}

export function TrackStatus({ open, onOpenChange, initialId = '' }: TrackStatusProps) {
  const [trackingId, setTrackingId] = useState(initialId);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Mock data for both applications and grievances
  const mockTrackingData: Record<string, any> = {
    // New Connection Applications
    'APP-2025-001': {
      type: 'application',
      id: 'APP-2025-001',
      category: 'New Water Connection',
      applicantName: 'Rajesh Kumar',
      propertyNumber: 'A1-1',
      status: 'Under Review',
      submittedDate: 'Nov 20, 2025',
      currentStep: 2,
      totalSteps: 5,
      timeline: [
        {
          step: 'Application Submitted',
          status: 'completed',
          date: 'Nov 20, 2025',
          time: '10:30 AM',
          officer: 'System',
          note: 'Application received successfully'
        },
        {
          step: 'Document Verification',
          status: 'in-progress',
          date: 'Nov 22, 2025',
          time: '02:15 PM',
          officer: 'Priya Sharma - Document Officer',
          note: 'Documents under verification. All documents found valid.'
        },
        {
          step: 'Site Inspection',
          status: 'pending',
          date: 'Expected: Nov 28, 2025',
          officer: 'To be assigned',
          note: 'Field officer will visit the site'
        },
        {
          step: 'Fee Assessment',
          status: 'pending',
          officer: 'To be assigned',
          note: 'Connection fee will be calculated'
        },
        {
          step: 'Approval & Consumer ID',
          status: 'pending',
          officer: 'To be assigned',
          note: 'Final approval and ID generation'
        }
      ],
      estimatedCompletion: 'Dec 05, 2025',
      contactOfficer: {
        name: 'Priya Sharma',
        designation: 'Water Tax Officer - Ward 5',
        phone: '9876543210',
        email: 'priya.sharma@municipal.gov.in'
      }
    },
    'APP-2025-002': {
      type: 'application',
      id: 'APP-2025-002',
      category: 'New Water Connection',
      applicantName: 'Amit Patel',
      propertyNumber: 'B2-5',
      status: 'Approved',
      submittedDate: 'Nov 10, 2025',
      approvedDate: 'Nov 24, 2025',
      consumerNumber: 'WC-2025-101',
      currentStep: 5,
      totalSteps: 5,
      timeline: [
        {
          step: 'Application Submitted',
          status: 'completed',
          date: 'Nov 10, 2025',
          time: '09:15 AM',
          officer: 'System',
          note: 'Application received successfully'
        },
        {
          step: 'Document Verification',
          status: 'completed',
          date: 'Nov 12, 2025',
          time: '11:30 AM',
          officer: 'Priya Sharma - Document Officer',
          note: 'All documents verified and approved'
        },
        {
          step: 'Site Inspection',
          status: 'completed',
          date: 'Nov 15, 2025',
          time: '03:45 PM',
          officer: 'Rajesh Verma - Field Officer',
          note: 'Site inspection completed. Connection feasible.'
        },
        {
          step: 'Fee Assessment',
          status: 'completed',
          date: 'Nov 18, 2025',
          time: '10:00 AM',
          officer: 'Anjali Desai - Accounts Officer',
          note: 'Connection fee: ₹1,500. Payment received.'
        },
        {
          step: 'Approval & Consumer ID',
          status: 'completed',
          date: 'Nov 24, 2025',
          time: '04:30 PM',
          officer: 'Suresh Kumar - Approving Authority',
          note: 'Application approved. Consumer ID: WC-2025-101'
        }
      ],
      estimatedCompletion: 'Completed',
      contactOfficer: {
        name: 'Suresh Kumar',
        designation: 'Senior Water Tax Officer',
        phone: '9876543211',
        email: 'suresh.kumar@municipal.gov.in'
      }
    },

    // Water New Connection Applications (First Connection - No Login)
    'WNC-2025-180652': {
      type: 'application',
      id: 'WNC-2025-180652',
      category: 'First Water Connection',
      applicantName: 'Sneha Deshmukh',
      propertyNumber: 'C3-12',
      status: 'Under Review',
      submittedDate: 'Nov 25, 2025',
      currentStep: 1,
      totalSteps: 5,
      timeline: [
        {
          step: 'Application Submitted',
          status: 'completed',
          date: 'Nov 25, 2025',
          time: '03:45 PM',
          officer: 'System',
          note: 'First water connection application received successfully'
        },
        {
          step: 'Document Verification',
          status: 'pending',
          date: 'Expected: Nov 28, 2025',
          officer: 'To be assigned',
          note: 'Documents will be verified by our team'
        },
        {
          step: 'Site Inspection',
          status: 'pending',
          officer: 'To be assigned',
          note: 'Field officer will visit the property'
        },
        {
          step: 'Fee Payment',
          status: 'pending',
          officer: 'To be assigned',
          note: 'Connection fee will be calculated and payment required'
        },
        {
          step: 'Connection Installation',
          status: 'pending',
          officer: 'To be assigned',
          note: 'Water connection will be installed and Consumer ID generated'
        }
      ],
      estimatedCompletion: 'Dec 10, 2025',
      contactOfficer: {
        name: 'Vikram Singh',
        designation: 'New Connection Officer - Ward 3',
        phone: '9876543215',
        email: 'vikram.singh@municipal.gov.in'
      }
    },
    'WNC-2025-180651': {
      type: 'application',
      id: 'WNC-2025-180651',
      category: 'First Water Connection',
      applicantName: 'Rahul Mehta',
      propertyNumber: 'D4-8',
      status: 'Approved',
      submittedDate: 'Nov 15, 2025',
      approvedDate: 'Nov 28, 2025',
      consumerNumber: 'WC-2025-125',
      currentStep: 5,
      totalSteps: 5,
      timeline: [
        {
          step: 'Application Submitted',
          status: 'completed',
          date: 'Nov 15, 2025',
          time: '10:20 AM',
          officer: 'System',
          note: 'First water connection application received successfully'
        },
        {
          step: 'Document Verification',
          status: 'completed',
          date: 'Nov 18, 2025',
          time: '02:30 PM',
          officer: 'Priya Sharma - Document Officer',
          note: 'All documents verified and approved'
        },
        {
          step: 'Site Inspection',
          status: 'completed',
          date: 'Nov 20, 2025',
          time: '11:15 AM',
          officer: 'Rajesh Verma - Field Officer',
          note: 'Site inspection completed. Property is eligible for water connection.'
        },
        {
          step: 'Fee Payment',
          status: 'completed',
          date: 'Nov 22, 2025',
          time: '09:00 AM',
          officer: 'Payment System',
          note: 'Connection fee: ₹2,500. Payment received successfully via UPI.'
        },
        {
          step: 'Connection Installation',
          status: 'completed',
          date: 'Nov 28, 2025',
          time: '04:00 PM',
          officer: 'Installation Team - Team Leader: Amit Kumar',
          note: 'Water connection installed successfully. Consumer ID: WC-2025-125. Login credentials sent to registered mobile.'
        }
      ],
      estimatedCompletion: 'Completed',
      contactOfficer: {
        name: 'Vikram Singh',
        designation: 'New Connection Officer - Ward 3',
        phone: '9876543215',
        email: 'vikram.singh@municipal.gov.in'
      }
    },

    // Grievances
    'GRV-2025-023': {
      type: 'grievance',
      id: 'GRV-2025-023',
      category: 'Billing Issue',
      subject: 'Incorrect meter reading in bill',
      applicantName: 'Rajesh Kumar',
      consumerNumber: 'WC-2025-001',
      propertyNumber: 'A1-1',
      status: 'In Progress',
      priority: 'High',
      submittedDate: 'Dec 15, 2025',
      currentStep: 2,
      totalSteps: 4,
      timeline: [
        {
          step: 'Grievance Submitted',
          status: 'completed',
          date: 'Dec 15, 2025',
          time: '11:20 AM',
          officer: 'System',
          note: 'Your grievance has been registered successfully'
        },
        {
          step: 'Assigned to Officer',
          status: 'completed',
          date: 'Dec 16, 2025',
          time: '09:45 AM',
          officer: 'Auto-Assignment System',
          note: 'Assigned to Priya Sharma - Water Tax Officer'
        },
        {
          step: 'Investigation in Progress',
          status: 'in-progress',
          date: 'Dec 18, 2025',
          time: '02:30 PM',
          officer: 'Priya Sharma',
          note: 'We have verified your complaint and found the discrepancy. A field officer will visit your property for meter verification within 2 days.'
        },
        {
          step: 'Resolution & Closure',
          status: 'pending',
          officer: 'To be completed',
          note: 'Grievance will be resolved and closed'
        }
      ],
      estimatedResolution: 'Dec 25, 2025',
      contactOfficer: {
        name: 'Priya Sharma',
        designation: 'Water Tax Officer - Ward 5',
        phone: '9876543210',
        email: 'priya.sharma@municipal.gov.in'
      }
    },
    'GRV-2025-018': {
      type: 'grievance',
      id: 'GRV-2025-018',
      category: 'Water Supply',
      subject: 'Low water pressure',
      applicantName: 'Rajesh Kumar',
      consumerNumber: 'WC-2025-002',
      propertyNumber: 'A1-1',
      status: 'Resolved',
      priority: 'Medium',
      submittedDate: 'Dec 10, 2025',
      resolvedDate: 'Dec 14, 2025',
      currentStep: 4,
      totalSteps: 4,
      timeline: [
        {
          step: 'Grievance Submitted',
          status: 'completed',
          date: 'Dec 10, 2025',
          time: '08:15 AM',
          officer: 'System',
          note: 'Your grievance has been registered successfully'
        },
        {
          step: 'Assigned to Officer',
          status: 'completed',
          date: 'Dec 10, 2025',
          time: '10:30 AM',
          officer: 'Auto-Assignment System',
          note: 'Assigned to Amit Patel - Water Supply Officer'
        },
        {
          step: 'Investigation Completed',
          status: 'completed',
          date: 'Dec 12, 2025',
          time: '03:00 PM',
          officer: 'Amit Patel',
          note: 'Field inspection completed. Issue identified in main pipeline pressure. Maintenance scheduled for Dec 14.'
        },
        {
          step: 'Resolution & Closure',
          status: 'completed',
          date: 'Dec 14, 2025',
          time: '05:45 PM',
          officer: 'Amit Patel',
          note: 'Issue resolved. Main pipeline pressure adjusted. Please check and confirm.'
        }
      ],
      resolution: 'Main pipeline pressure issue was identified and fixed. Water pressure has been restored to normal levels.',
      estimatedResolution: 'Completed',
      contactOfficer: {
        name: 'Amit Patel',
        designation: 'Water Supply Officer - Ward 8',
        phone: '9876543212',
        email: 'amit.patel@municipal.gov.in'
      }
    }
  };

  const handleSearch = () => {
    const upperTrackingId = trackingId.toUpperCase().trim();

    if (!upperTrackingId) {
      toast.error('Please enter a tracking ID');
      return;
    }

    setIsSearching(true);

    setTimeout(() => {
      if (mockTrackingData[upperTrackingId]) {
        setTrackingData(mockTrackingData[upperTrackingId]);
        toast.success('Tracking information found!');
      } else {
        setTrackingData({ notFound: true });
        toast.error('No record found for this ID');
      }
      setIsSearching(false);
    }, 800);
  };

  const handleReset = () => {
    setTrackingId('');
    setTrackingData(null);
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(trackingData.id);
      toast.success('ID copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy ID');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500';
      case 'under review':
      case 'in progress':
        return 'bg-blue-500';
      case 'resolved':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            Track Application / Grievance Status
          </DialogTitle>
          <DialogDescription className="text-xs">
            Enter your Application ID or Grievance ID to track status
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
          {/* Search Section */}
          <Card className="p-4 bg-white/80 backdrop-blur-sm border-blue-200">
            <div className="space-y-3">
              <div>
                <div className="flex gap-2">
                  <Input
                    placeholder="APP-2025-XXX, WNC-2025-XXX or GRV-2025-XXX"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 focus:border-blue-400 focus:ring-blue-300"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    {isSearching ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Track
                      </>
                    )}
                  </Button>
                  {trackingData && (
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Sample IDs */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800 font-medium mb-2">Sample IDs for testing:</p>
                <div className="flex flex-wrap gap-2">
                  {['APP-2025-001', 'APP-2025-002', 'WNC-2025-180652', 'WNC-2025-180651', 'GRV-2025-023', 'GRV-2025-018'].map((id) => (
                    <Badge
                      key={id}
                      className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setTrackingId(id);
                        setTimeout(() => handleSearch(), 100);
                      }}
                    >
                      {id}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Results */}
          <AnimatePresence mode="wait">
            {trackingData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {trackingData.notFound ? (
                  <Card className="p-8 text-center bg-red-50 border-red-200">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg text-gray-900 mb-2">No Record Found</h3>
                    <p className="text-sm text-gray-600">
                      The tracking ID <strong>{trackingId}</strong> does not exist in our system.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Please check the ID and try again.
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {/* Header Card */}
                    <Card className="p-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-white/20 text-white border-white/30">
                              {trackingData.type === 'application' ? 'Application' : 'Grievance'}
                            </Badge>
                            <Badge className={`${getStatusColor(trackingData.status)} text-white`}>
                              {trackingData.status}
                            </Badge>
                            {trackingData.priority && (
                              <Badge className={`${getPriorityColor(trackingData.priority)} text-white`}>
                                {trackingData.priority} Priority
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl">{trackingData.id}</h3>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCopyId}
                              className="h-6 w-6 p-0 hover:bg-white/20"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-white/90 mt-1">{trackingData.category}</p>
                          {trackingData.subject && (
                            <p className="text-sm text-white/80 mt-0.5">{trackingData.subject}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <Droplet className="w-12 h-12 text-white/30 mb-2" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-white/70 text-xs">Applicant</p>
                          <p className="font-medium">{trackingData.applicantName}</p>
                        </div>
                        <div>
                          <p className="text-white/70 text-xs">Property</p>
                          <p className="font-medium">{trackingData.propertyNumber}</p>
                        </div>
                        <div>
                          <p className="text-white/70 text-xs">Submitted</p>
                          <p className="font-medium">{trackingData.submittedDate}</p>
                        </div>
                        <div>
                          <p className="text-white/70 text-xs">Expected Completion</p>
                          <p className="font-medium">{trackingData.estimatedCompletion || trackingData.estimatedResolution}</p>
                        </div>
                      </div>

                      {trackingData.consumerNumber && (
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <p className="text-white/70 text-xs mb-1">Consumer Number</p>
                          <p className="text-lg font-medium">{trackingData.consumerNumber}</p>
                        </div>
                      )}
                    </Card>

                    {/* Progress Bar */}
                    <Card className="p-4 bg-white/80 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">Progress</h4>
                        <span className="text-xs text-gray-600">
                          Step {trackingData.currentStep} of {trackingData.totalSteps}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(trackingData.currentStep / trackingData.totalSteps) * 100}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                    </Card>

                    {/* Timeline */}
                    <Card className="p-4 bg-white/80 backdrop-blur-sm">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        {trackingData.type === 'application' ? 'Application' : 'Grievance'} Timeline
                      </h4>
                      <div className="space-y-4">
                        {trackingData.timeline.map((item: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-3"
                          >
                            <div className="flex flex-col items-center">
                              {getStatusIcon(item.status)}
                              {index < trackingData.timeline.length - 1 && (
                                <div className={`w-0.5 h-full mt-2 ${item.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                                  }`} />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-start justify-between mb-1">
                                <h5 className={`text-sm font-medium ${item.status === 'completed' ? 'text-green-700' :
                                    item.status === 'in-progress' ? 'text-blue-700' :
                                      'text-gray-500'
                                  }`}>
                                  {item.step}
                                </h5>
                                {item.date && (
                                  <span className="text-xs text-gray-500">{item.date}</span>
                                )}
                              </div>
                              {item.time && (
                                <p className="text-xs text-gray-500 mb-1">{item.time}</p>
                              )}
                              <p className="text-xs text-gray-600 mb-1">
                                <User className="w-3 h-3 inline mr-1" />
                                {item.officer}
                              </p>
                              {item.note && (
                                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-2">
                                  {item.note}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </Card>

                    {/* Resolution (for resolved grievances) */}
                    {trackingData.resolution && (
                      <Card className="p-4 bg-green-50 border-green-200">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-green-900 mb-1">Resolution</h4>
                            <p className="text-sm text-green-800">{trackingData.resolution}</p>
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Contact Officer */}
                    {trackingData.contactOfficer && (
                      <Card className="p-4 bg-white/80 backdrop-blur-sm">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Officer</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-900 font-medium">{trackingData.contactOfficer.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{trackingData.contactOfficer.designation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-600" />
                            <a href={`tel:${trackingData.contactOfficer.phone}`} className="text-blue-600 hover:underline">
                              {trackingData.contactOfficer.phone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-orange-600" />
                            <a href={`mailto:${trackingData.contactOfficer.email}`} className="text-blue-600 hover:underline text-xs">
                              {trackingData.contactOfficer.email}
                            </a>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!trackingData && (
            <Card className="p-8 text-center bg-white/60 border-dashed border-2 border-blue-300">
              <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg text-gray-900 mb-2">Track Your Status</h3>
              <p className="text-sm text-gray-600">
                Enter your Application ID or Grievance ID above to view detailed tracking information
              </p>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
