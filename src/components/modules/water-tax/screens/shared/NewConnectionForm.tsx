"use client";

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Water.Citizen/Input';
import { Checkbox } from '@/components/common/Water.Citizen/Checkbox';
import { Drawer } from "@/components/common/Drawer";
import {
  Upload,
  ChevronLeft,
  Check,
  Eye,
  X,
  Loader2,
  FileText,
  CheckCircle2,
  Trash2,
  Building,
} from 'lucide-react';
import { toast } from 'sonner';

interface NewConnectionFormContentProps {
  user?: any;
  onBack?: () => void;
  onSubmitSuccess?: (applicationNumber: string) => void;
  selectedProperty?: any;
}

export function NewConnectionFormContent({ 
  user, 
  onBack, 
  onSubmitSuccess, 
  selectedProperty 
}: NewConnectionFormContentProps) {
  // Connection Details State
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [size, setSize] = useState('');

  // Form State
  const [declaration, setDeclaration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState('');

  // Debug: Log the incoming data
  console.log('NewConnectionForm - user:', user);
  console.log('NewConnectionForm - selectedProperty:', selectedProperty);
  console.log('NewConnectionForm - user.connections:', user?.connections);

  // Get connection details for the selected property
  const selectedConnection = user?.connections?.find(
    (conn: any) => conn.propertyNumber === (selectedProperty?.propertyNumber || user?.propertyNumber)
  );

  console.log('NewConnectionForm - selectedConnection:', selectedConnection);

  // Determine property number and address with proper fallbacks
  const displayPropertyNo = selectedProperty?.propertyNumber || selectedConnection?.propertyNumber || user?.propertyNumber || 'N/A';
  const displayAddress = selectedProperty?.address || selectedConnection?.addressEnglish || selectedConnection?.address || 'N/A';
  const displayOwnerName = selectedConnection?.consumerNameEnglish || selectedConnection?.consumerName || user?.name || 'Citizen';

  // Document uploads state
  const [documentUploads, setDocumentUploads] = useState<{ 
    [key: string]: { file: File; status: string } 
  }>({});
  const [viewingDocument, setViewingDocument] = useState<{ 
    name: string; 
    file: File 
  } | null>(null);

  const handleSubmitForm = () => {
    if (!declaration) {
      toast.error('Please accept the declaration to proceed');
      return;
    }
    
    if (!category || !type || !size) {
      toast.error('Please fill all required connection details');
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      const appNumber = 'WC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setApplicationNumber(appNumber);
      setIsSubmitting(false);
      setShowSuccessDialog(true);
      toast.success('Application submitted successfully!');
      
      if (onSubmitSuccess) {
        onSubmitSuccess(appNumber);
      }
    }, 2000);
  };

  const handleFileUpload = (docId: string, docName: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e: any) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setDocumentUploads(prev => ({
          ...prev,
          [docId]: { file, status: 'Uploaded' }
        }));
        toast.success(`${docName} uploaded successfully!`);
      }
    };
    input.click();
  };

  const handleDeleteDocument = (docId: string, docName: string) => {
    setDocumentUploads(prev => {
      const newUploads = {...prev};
      delete newUploads[docId];
      return newUploads;
    });
    toast.success(`${docName} removed`);
  };

  const documents = [
    { id: 'aadhar', name: 'Aadhar Card', type: 'Required' },
    { id: 'property-tax', name: 'Property Tax Receipt', type: 'Required' },
    { id: 'address', name: 'Address Proof', type: 'Optional' },
    { id: 'noc', name: 'NOC (if applicable)', type: 'Optional' },
  ];

  return (
    <>
      <div className="relative bg-white rounded-2xl border-2 border-purple-200/50 shadow-xl p-2.5">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/70 via-pink-50/30 to-blue-50/50 rounded-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2.5">
          {/* Property Details Section */}
          <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-xl p-2.5 shadow-lg">
            <div className="flex items-center gap-2 mb-1.5">
              <Building className="w-4 h-4 text-white" />
              <h3 className="text-xs font-bold text-white">Confirm Your Property Details</h3>
            </div>
            
            <div className="bg-white rounded-lg p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-600 font-medium">Property No:</span>
                  <span className="text-xs font-bold text-blue-700">
                    {displayPropertyNo}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-600 font-medium">Owner Name:</span>
                  <span className="text-xs font-semibold text-gray-800">
                    {displayOwnerName}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-600 font-medium">Mobile:</span>
                  <span className="text-xs font-semibold text-gray-800">
                    {user?.mobile || 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-600 font-medium">Address:</span>
                <span className="text-xs font-semibold text-gray-800 leading-tight">
                  {displayAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Connection Details Section */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-bold text-cyan-900">Connection Details</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 block">
                  Connection Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 bg-white border-2 border-cyan-200 rounded-lg text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value="">Select Category</option>
                  <option value="Domestic">Domestic</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 block">
                  Connection Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-10 px-3 bg-white border-2 border-cyan-200 rounded-lg text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="Metered">Metered</option>
                  <option value="Non-Metered">Non-Metered</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 block">
                  Tap Size <span className="text-red-500">*</span>
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full h-10 px-3 bg-white border-2 border-cyan-200 rounded-lg text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value="">Select Size</option>
                  <option value="15mm">15mm</option>
                  <option value="20mm">20mm</option>
                  <option value="25mm">25mm</option>
                  <option value="32mm">32mm</option>
                </select>
              </div>
            </div>
          </div>

          {/* Upload Documents Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-bold text-purple-900">Upload Documents</h3>
            </div>

            <div className="bg-white rounded-lg border-2 border-purple-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 border-b-2 border-purple-200">
                      <th className="px-3 py-2.5 text-left text-xs font-bold text-purple-900 w-12">Sr.</th>
                      <th className="px-3 py-2.5 text-left text-xs font-bold text-purple-900">Document Name</th>
                      <th className="px-3 py-2.5 text-center text-xs font-bold text-purple-900 w-20">Type</th>
                      <th className="px-3 py-2.5 text-center text-xs font-bold text-purple-900 w-24">Status</th>
                      <th className="px-3 py-2.5 text-center text-xs font-bold text-purple-900 w-40">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, index) => {
                      const uploaded = documentUploads[doc.id];
                      const isUploaded = uploaded && uploaded.file;
                      
                      return (
                        <tr key={doc.id} className="border-b border-purple-100 hover:bg-purple-50/30 transition-colors">
                          <td className="px-3 py-2.5 text-xs font-semibold text-gray-700">{index + 1}</td>
                          <td className="px-3 py-2.5 text-xs font-semibold text-gray-800">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              <span>{doc.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              doc.type === 'Required' 
                                ? 'bg-red-100 text-red-700 border border-red-300' 
                                : 'bg-blue-100 text-blue-700 border border-blue-300'
                            }`}>
                              {doc.type}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                              isUploaded
                                ? 'bg-green-100 text-green-700 border border-green-300'
                                : 'bg-gray-100 text-gray-700 border border-gray-300'
                            }`}>
                              {isUploaded ? '✓ Uploaded' : 'Not Uploaded'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center justify-center gap-1.5">
                              {isUploaded ? (
                                <>
                                  <Button
                                    onClick={() => {
                                      if (uploaded.file) {
                                        setViewingDocument({name: doc.name, file: uploaded.file});
                                      }
                                    }}
                                    className="h-7 px-2 bg-blue-500 hover:bg-blue-600 text-white text-[10px]"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteDocument(doc.id, doc.name)}
                                    className="h-7 px-2 bg-red-500 hover:bg-red-600 text-white text-[10px]"
                                  >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Delete
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  onClick={() => handleFileUpload(doc.id, doc.name)}
                                  className="h-7 px-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-[10px]"
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

            {/* Declaration & Action Buttons */}
            <div className="mt-4 space-y-3">
              {/* Declaration */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={declaration}
                    onCheckedChange={(checked) => setDeclaration(checked as boolean)}
                    className="mt-0.5"
                    id="declaration"
                  />
                  <label 
                    htmlFor="declaration"
                    className="text-xs text-gray-800 cursor-pointer leading-relaxed font-medium"
                  >
                    I declare that all information provided is true and correct to the best of my knowledge.
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                {onBack && (
                  <Button
                    onClick={onBack}
                    className="h-10 px-5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                )}

                <Button
                  onClick={handleSubmitForm}
                  disabled={isSubmitting || !declaration}
                  className="h-10 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Drawer */}
      <Drawer
        open={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          if (onBack) onBack();
        }}
        title={
          <div className="flex items-center gap-2 text-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            Application Submitted!
          </div>
        }
        width="sm"
      >
        <div className="text-sm pt-2 mb-2">
          Your new water connection application has been submitted successfully.
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-2">
          <p className="text-xs text-gray-600 mb-1">Application Number</p>
          <p className="text-xl font-bold text-blue-600">{applicationNumber}</p>
          <p className="text-xs text-gray-500 mt-2">Please save this number for tracking</p>
        </div>
        <div className="flex justify-end pt-2">
          <Button
            onClick={() => {
              setShowSuccessDialog(false);
              if (onBack) onBack();
            }}
            className="h-10 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm"
          >
            Close
          </Button>
        </div>
      </Drawer>

      {/* Document Viewer Drawer */}
      <Drawer
        open={viewingDocument !== null}
        onClose={() => setViewingDocument(null)}
        title={
          <div className="flex items-center gap-2 text-base">
            <FileText className="w-5 h-5 text-blue-600" />
            Document Preview
          </div>
        }
        width="lg"
      >
        <div className="text-sm mb-2">
          {viewingDocument?.file.name}
        </div>
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-6 min-h-[500px]">
          {viewingDocument?.file && (
            viewingDocument.file.type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(viewingDocument.file)}
                alt={viewingDocument.file.name}
                className="max-w-full max-h-[70vh] object-contain rounded shadow-lg"
              />
            ) : viewingDocument.file.type === 'application/pdf' ? (
              <iframe
                src={URL.createObjectURL(viewingDocument.file)}
                className="w-full h-[70vh] rounded shadow-lg"
                title={viewingDocument.file.name}
              />
            ) : (
              <div className="text-center text-gray-600">
                <FileText className="w-20 h-20 mx-auto mb-4 text-gray-400" />
                <p className="text-sm font-medium">Preview not available</p>
                <p className="text-xs mt-2 text-gray-500">{viewingDocument.file.name}</p>
              </div>
            )
          )}
        </div>
        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={() => setViewingDocument(null)}
            className="h-10 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </Drawer>
    </>
  );
}
