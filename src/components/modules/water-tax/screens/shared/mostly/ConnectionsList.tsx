'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Droplets, CreditCard } from 'lucide-react';
import { ConnectionCard } from './ConnectionCard';

interface Connection {
    id: string;
    [key: string]: any;
}

interface ConnectionsListProps {
    connections: Connection[];
    propertyNumber: string;
    onPaySelected: (connectionIds: string[], totalAmount: number) => void;
    onViewDetails: (connection: Connection) => void;
}

/**
 * ConnectionsList - Client Component
 * 
 * Displays list of connections with selection state management.
 * Includes "Pay Now" button for selected connections.
 * Fully responsive for mobile and desktop.
 */
export function ConnectionsList({
    connections,
    propertyNumber,
    onPaySelected,
    onViewDetails,
}: ConnectionsListProps) {
    const [selectedConnections, setSelectedConnections] = useState<string[]>([]);

    // Get payable connections (those with billAmount > 0)
    const payableConnections = connections.filter((c) => (c.billAmount || 0) > 0);
    const payableIds = payableConnections.map((c) => c.id);

    // Auto-select all payable connections on mount
    useEffect(() => {
        setSelectedConnections(payableIds);
    }, [propertyNumber, connections.length]);

    // Handle individual connection checkbox
    const handleConnectionSelect = (connectionId: string, checked: boolean) => {
        if (checked) {
            setSelectedConnections((prev) => Array.from(new Set([...prev, connectionId])));
        } else {
            setSelectedConnections((prev) => prev.filter((id) => id !== connectionId));
        }
    };

    // Calculate total selected amount
    const totalSelectedAmount = selectedConnections.reduce((sum, id) => {
        const conn = connections.find((c) => c.id === id);
        return sum + (conn?.billAmount || conn?.currentDemand || conn?.dueAmount || 0);
    }, 0);

    return (
        <Card className="p-3 sm:p-4 lg:p-5 shadow-lg border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                    <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="text-base sm:text-lg text-gray-900 font-bold">My Connections</h3>
                    <p className="text-xs text-gray-600">Property {propertyNumber}</p>
                </div>
            </div>

            {/* Selected Amount Card */}
            {selectedConnections.length > 0 && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-3 sm:mb-4"
                    >
                        <Card className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex-1">
                                    <p className="text-xs opacity-90">
                                        {selectedConnections.length} connection(s) selected
                                    </p>
                                    <p className="text-xl sm:text-2xl font-bold">
                                        ₹{totalSelectedAmount.toLocaleString()}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => onPaySelected(selectedConnections, totalSelectedAmount)}
                                    className="bg-white text-green-600 hover:bg-gray-100 h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4 font-semibold"
                                >
                                    <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    Pay Now
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Connections List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 sm:pr-2">
                {connections.length === 0 ? (
                    <div className="text-center text-gray-400 py-10 text-sm sm:text-base">
                        No connections found for this property.
                    </div>
                ) : (
                    connections.map((connection) => (
                        <ConnectionCard
                            key={connection.id}
                            connection={connection}
                            isSelected={selectedConnections.includes(connection.id)}
                            onSelect={(checked) => handleConnectionSelect(connection.id, checked)}
                            onViewDetails={() => onViewDetails(connection)}
                        />
                    ))
                )}
            </div>
        </Card>
    );
}
