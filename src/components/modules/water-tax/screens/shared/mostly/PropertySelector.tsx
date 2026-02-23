'use client';

import { Home, MapPin, Droplets, CheckCircle, Building } from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/common/Water.Citizen/Select';
import { Card } from '@/components/common/Card';

interface Property {
    propertyNumber: string;
    address: string;
    connectionCount: number;
}

interface PropertySelectorProps {
    properties: Property[];
    currentProperty: string;
    onPropertyChange: (propertyNumber: string) => void;
}

/**
 * PropertySelector - Client Component
 * 
 * Dropdown to select and switch between user properties.
 * Manages local dropdown state and fires onChange callback.
 */
export function PropertySelector({
    properties,
    currentProperty,
    onPropertyChange,
}: PropertySelectorProps) {
    return (
        <Card className="w-full lg:w-[260px] bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-3 shadow-md flex-shrink-0 px-[12px] py-[2px]">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-medium text-gray-600 mb-0.5 block">
                        Select Property
                    </label>
                    <Select value={currentProperty} onValueChange={onPropertyChange}>
                        <SelectTrigger className="h-9 bg-white border-2 border-blue-300 hover:border-blue-400 focus:border-blue-500 font-semibold text-blue-900 rounded-lg shadow-sm">
                            <SelectValue>
                                {(() => {
                                    const selectedProp = properties.find((p) => p.propertyNumber === currentProperty);
                                    if (selectedProp) {
                                        return (
                                            <div className="flex items-center gap-2">
                                                <Home className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                                <span className="font-bold text-blue-900 text-sm flex-shrink-0">
                                                    {selectedProp.propertyNumber}
                                                </span>
                                                <span className="text-gray-400 flex-shrink-0">•</span>
                                                <span className="text-xs text-gray-600 truncate">
                                                    {selectedProp.address}
                                                </span>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div className="flex items-center gap-2">
                                            <Home className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                            <span className="font-bold text-blue-900 text-sm flex-shrink-0">
                                                Select a property
                                            </span>
                                        </div>
                                    );
                                })()}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-blue-200 rounded-lg shadow-lg p-1">
                            {properties.map((property) => (
                                <SelectItem
                                    key={property.propertyNumber}
                                    value={property.propertyNumber}
                                    className="hover:bg-blue-50 rounded-lg transition"
                                >
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
                                                <span className="font-medium">
                                                    {property.connectionCount} {property.connectionCount === 1 ? 'Connection' : 'Connections'}
                                                </span>
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
    );
}
