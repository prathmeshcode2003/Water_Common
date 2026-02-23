"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MessageSquare, 
  FileText, 
  Camera, 
  Calculator,
  Menu,
  X,
} from 'lucide-react';
import { Badge } from '@/components/common/Water.Citizen';

interface Hub {
  id: string;
  label: string;
  icon: any;
  gradient: string;
  badge?: string;
  badgeColor?: string;
}

interface CivicRibbonProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

const hubs: Hub[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, gradient: 'from-[#5A6472] to-[#09223B]' },
  { id: 'passbook', label: 'Passbook', icon: FileText, gradient: 'from-[#06A6A1] to-[#0A66A6]' },
  { id: 'submitReading', label: 'Meter Reading', icon: Camera, gradient: 'from-[#1B5E20] to-[#2E7D32]' },
  { id: 'grievances', label: 'Grievances', icon: MessageSquare, gradient: 'from-[#DA7A00] to-[#B86500]'},
  { id: 'calculator', label: 'Bill Calculator', icon: Calculator, gradient: 'from-[#7B1FA2] to-[#4A148C]' },
];

export default function CivicRibbon({ currentScreen, onNavigate }: CivicRibbonProps) {
  const [isCompact, setIsCompact] = useState(false);
  const [expandedHub, setExpandedHub] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (screen: string) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation - Horizontal Ribbon */}
      <motion.nav
        className="fixed top-20 left-1/2 -translate-x-1/2 z-40 hidden md:block"
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          scale: isCompact ? 0.92 : 1,
        }}
        transition={{ 
          duration: 0.4,
          ease: [0.2, 0.8, 0.2, 1]
        }}
      >
        {/* Curved Ribbon Background - Glass Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-full px-3 py-3 shadow-lg border border-blue-200/50">
          <div className="flex items-center gap-2">
            {hubs.map((hub) => {
              const Icon = hub.icon;
              const isActive = currentScreen === hub.id;
              const isExpanded = expandedHub === hub.id;

              return (
                <motion.button
                  key={hub.id}
                  onClick={() => handleNavigate(hub.id)}
                  onMouseEnter={() => setExpandedHub(hub.id)}
                  onMouseLeave={() => setExpandedHub(null)}
                  className={`
                    relative flex items-center gap-2 rounded-full px-4 py-2.5
                    transition-all duration-300
                    ${isActive 
                      ? `bg-gradient-to-r ${hub.gradient} text-white shadow-md` 
                      : 'bg-transparent text-gray-700 hover:bg-white/50'
                    }
                  `}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Icon */}
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                  
                  {/* Label - Always visible on active, show on hover for others */}
                  <AnimatePresence>
                    {(isActive || isExpanded || !isCompact) && (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs font-medium whitespace-nowrap overflow-hidden"
                      >
                        {hub.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Badge */}
                  {hub.badge && isActive && (
                    <span className={`${hub.badgeColor} text-white text-[10px] px-1.5 py-0.5 ml-1 rounded-full`}>
                      {hub.badge}
                    </span>
                  )}

                  {/* Active Indicator Glow */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.3), 0 0 12px rgba(10, 102, 166, 0.4)',
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation - Bottom Navigation Bar */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-lg border-t-2 border-blue-200 shadow-lg"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
          {hubs.map((hub) => {
            const Icon = hub.icon;
            const isActive = currentScreen === hub.id;

            return (
              <motion.button
                key={hub.id}
                onClick={() => handleNavigate(hub.id)}
                className={`
                  relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl min-w-[60px]
                  transition-all duration-200
                  ${isActive 
                    ? `bg-gradient-to-r ${hub.gradient} text-white shadow-md` 
                    : 'bg-transparent text-gray-600'
                  }
                `}
                whileTap={{ scale: 0.95 }}
              >
                {/* Badge Indicator */}
                {hub.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {hub.badge}
                  </span>
                )}

                {/* Icon */}
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                
                {/* Label */}
                <span className={`text-[10px] font-medium text-center leading-tight ${isActive ? 'text-white' : 'text-gray-700'}`}>
                  {hub.label.split(' ')[0]}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.3), 0 0 8px rgba(10, 102, 166, 0.3)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.nav>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
