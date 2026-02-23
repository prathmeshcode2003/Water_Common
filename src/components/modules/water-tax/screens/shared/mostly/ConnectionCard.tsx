'use client';

import { Badge } from '@/components/common/Water.Citizen/Badge';
import { Checkbox } from '@/components/common/Water.Citizen/Checkbox';
import { Button } from '@/components/common/Button';
import { MapPin, Droplets, Activity, Eye } from 'lucide-react';

interface Connection {
    id: string;
    consumerNo?: string;
    consumerNumber?: string;
    consumerID?: string;
    propertyNo?: string;
    propertyNumber?: string;
    propertyId?: string;
    categoryName?: string;
    connectionTypeName?: string;
    status?: string;
    isActive?: boolean;
    sizeName?: string;
    size?: string;
    billAmount?: number;
    consumption?: number;
    currentDemand?: number;
    addressEnglish?: string;
    address?: string;
    zoneName?: string;
    zoneNo?: string;
    wardName?: string;
    wardNo?: string;
    meterType?: string;
    meterNumber?: string;
    dueDate?: string;
}

interface ConnectionCardProps {
    connection: Connection;
    isSelected: boolean;
    onSelect: (checked: boolean) => void;
    onViewDetails: () => void;
}

/**
 * ConnectionCard - Client Component
 * 
 * Displays individual connection with checkbox, details, and actions.
 * Fully responsive for mobile and desktop.
 */
export function ConnectionCard({
    connection,
    isSelected,
    onSelect,
    onViewDetails,
}: ConnectionCardProps) {
    const id = connection.id || connection.consumerID || connection.consumerNo || '';
    const consumerNumber = connection.consumerNo || connection.consumerNumber || connection.consumerID || 'N/A';
    const propertyNumber = connection.propertyNo || connection.propertyNumber || connection.propertyId || 'N/A';
    const category = connection.categoryName || 'N/A';
    const size = connection.sizeName || connection.size || 'N/A';
    const status = connection.status || (connection.isActive ? 'Active' : 'Inactive');
    const billAmount = connection.billAmount || 0;
    const consumption = connection.consumption || 0;
    const address = connection.addressEnglish || connection.address || 'N/A';
    const zone = connection.zoneName || connection.zoneNo || 'N/A';
    const ward = connection.wardName || connection.wardNo || 'N/A';
    const dueDate = connection.dueDate || 'N/A';

    return (
        <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Header - Always Visible */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between border-b-2 border-blue-100">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    {/* Checkbox for payment selection */}
                    <Checkbox
                        id={`conn-${id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => onSelect(checked as boolean)}
                        onClick={(e) => e.stopPropagation()}
                        className="data-[state=checked]:bg-green-500 bg-white border-2 border-gray-300 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <h3 className="text-gray-900 font-bold text-xs sm:text-sm md:text-base truncate">
                                {consumerNumber}
                            </h3>
                            <Badge
                                className={
                                    connection.connectionTypeName === 'Residential'
                                        ? 'bg-blue-100 text-blue-700 border-blue-200 text-[10px] sm:text-xs'
                                        : connection.connectionTypeName === 'Commercial'
                                            ? 'bg-purple-100 text-purple-700 border-purple-200 text-[10px] sm:text-xs'
                                            : 'bg-orange-100 text-orange-700 border-orange-200 text-[10px] sm:text-xs'
                                }
                            >
                                {category}
                            </Badge>
                            <Badge
                                className={
                                    status === 'Active' || connection.isActive
                                        ? 'bg-green-100 text-green-700 border-green-200 text-[10px] sm:text-xs'
                                        : 'bg-red-100 text-red-700 border-red-200 text-[10px] sm:text-xs'
                                }
                            >
                                {status}
                            </Badge>
                        </div>
                        <p className="text-gray-600 text-[10px] sm:text-xs mt-0.5 truncate">
                            Property: {propertyNumber} • Size: {size}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    {billAmount > 0 ? (
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            {/* Pending Demand */}
                            <div className="bg-blue-100 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 border-2 border-blue-200">
                                <p className="text-blue-700 text-[8px] sm:text-[10px] font-medium">Pending</p>
                                <p className="text-blue-900 font-bold text-xs sm:text-sm">
                                    ₹{((consumption || 0) * 12).toLocaleString()}
                                </p>
                            </div>
                            {/* Current Demand */}
                            <div className="bg-orange-100 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 border-2 border-orange-200">
                                <p className="text-orange-700 text-[8px] sm:text-[10px] font-medium">Current</p>
                                <p className="text-orange-900 font-bold text-xs sm:text-sm">
                                    ₹{billAmount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-green-100 px-2 sm:px-3 py-1 rounded-full border-2 border-green-200">
                            <p className="text-green-700 text-[10px] sm:text-xs font-semibold">No Dues</p>
                        </div>
                    )}
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails();
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition-all shadow-sm"
                    >
                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">View</span>
                    </Button>
                </div>
            </div>

            {/* Quick Info Bar */}
            <div className="bg-gray-50 px-3 sm:px-4 py-2">
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-[10px] sm:text-xs">
                    <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 line-clamp-1">{address}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                        <span className="text-gray-700 line-clamp-1">{zone}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                        <span className="text-gray-700 line-clamp-1">{ward}</span>
                    </div>
                    {connection.meterType === 'meter' && (
                        <>
                            <div className="flex items-center gap-1 sm:gap-1.5">
                                <Droplets className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-600" />
                                <span className="text-gray-700">{consumption} KL</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-1.5">
                                <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-600" />
                                <span className="text-gray-700">Meter: {connection.meterNumber || 'N/A'}</span>
                            </div>
                        </>
                    )}
                    {billAmount > 0 && (
                        <div className="ml-auto">
                            <span className="text-orange-600 font-medium">Due: {dueDate}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
