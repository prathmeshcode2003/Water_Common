'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { FileText, Activity, MessageSquare } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface QuickAction {
    label: string;
    icon: LucideIcon;
    color: string;
    action: () => void;
}

interface QuickActionsProps {
    onNewConnection: () => void;
    onTrackStatus: () => void;
    onRaiseComplaint: () => void;
}

/**
 * QuickActions - Client Component
 * 
 * Three action buttons for quick access to common tasks.
 * Mobile: Stacked horizontal scroll, Desktop: Row layout
 */
export function QuickActions({
    onNewConnection,
    onTrackStatus,
    onRaiseComplaint,
}: QuickActionsProps) {
    const actions: QuickAction[] = [
        {
            label: 'New Connection',
            icon: FileText,
            color: 'from-blue-500 to-blue-500',
            action: onNewConnection,
        },
        {
            label: 'Track Status',
            icon: Activity,
            color: 'from-blue-500 to-blue-500',
            action: onTrackStatus,
        },
        {
            label: 'Raise Complaints',
            icon: MessageSquare,
            color: 'from-blue-500 to-blue-500',
            action: onRaiseComplaint,
        },
    ];

    return (
        <div className="w-full lg:w-auto flex flex-wrap gap-2 lg:gap-2 flex-shrink-0 p-0">
            {actions.map((action, index) => (
                <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                        type: 'spring',
                        stiffness: 300,
                    }}
                >
                    <Button
                        className={`w-auto px-3 py-3 sm:py-4 rounded-xl bg-gradient-to-r ${action.color} border-0 shadow-lg hover:shadow-2xl text-white transition-all relative overflow-hidden group h-auto`}
                        onClick={action.action}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '200%' }}
                            transition={{ duration: 0.6 }}
                        />
                        <div className="flex items-center justify-center gap-2 relative z-10">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-lg flex items-center justify-center">
                                <action.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="text-xs font-bold">
                                {action.label}
                            </span>
                        </div>
                    </Button>
                </motion.div>
            ))}
        </div>
    );
}
