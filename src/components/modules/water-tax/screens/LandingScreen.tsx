'use client';

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { Button } from '@/components/common/Water.Citizen/Button';
import { Card } from '@/components/common/Water.Citizen/Card';
import { TrackStatus } from "../screens/TrackStatus";
import {
  Droplets,
  CreditCard,
  FileText,
  MessageSquare,
  Shield,
  Clock,
  CheckCircle,
  Smartphone,
  Search,
  TrendingDown,
  Award,
  Users,
  ArrowRight,
  Zap,
  Sparkles,
  Waves,
  Phone,
  AlertCircle,
  Package,
  CheckCircle2,
  Plus,
  Calendar,
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Activity,
  Star,
  Rocket,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  FloatingBubbles,
  WaterWaves,
  WaterParticles,
} from "./WaterTheme";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/common/Water.Citizen/Dialog';
// import panvel.png from '/water-tax/panvel.png';
import { Input } from '@/components/common/Water.Citizen/Input';
import { Badge } from '@/components/common/Water.Citizen/Badge';
const bgImage = '/water-tax/77f96d1e7b98424fa9f7ce62d8a4e0c5fe534199.png';

interface CitizenLandingProps {
  onNavigateToLogin: () => void;
  onNavigateToFirstConnection?: () => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  options?: string[];
}

// Counter animation component
function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const animation = animate(count, value, {
      duration: 2,
      ease: "easeOut",
    });

    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });

    return () => {
      animation.stop();
      unsubscribe();
    };
  }, [value, count, rounded]);

  return (
    <>
      {displayValue}
      {suffix}
    </>
  );
}

export function LandingScreen({
  onNavigateToLogin,
  onNavigateToFirstConnection,
}: CitizenLandingProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(
    null,
  );
  const [showTrackDialog, setShowTrackDialog] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  // Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    ChatMessage[]
  >([
    {
      id: "1",
      role: "bot",
      content:
        "👋 Hello! I'm your Water Services Assistant. I can help you with:\n\n• Apply for new water connection\n• Pay your water bills\n• Track application status\n• Submit meter readings\n• Raise grievances\n• General queries\n\nHow can I assist you today?",
      timestamp: new Date(),
      options: [
        "Apply for New Connection",
        "Pay Bills",
        "Track Application",
        "Submit Meter Reading",
        "Raise Grievance",
        "General Query",
      ],
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [conversationContext, setConversationContext] =
    useState<string>("initial");
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatMessages]);

  // Auto-scroll when chat opens
  useEffect(() => {
    if (
      isChatOpen &&
      !isChatMinimized &&
      chatMessagesEndRef.current
    ) {
      setTimeout(() => {
        chatMessagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    }
  }, [isChatOpen, isChatMinimized]);

  const resetTrackDialog = () => {
    setShowTrackDialog(false);
    setTrackingId("");
  };

  // Chatbot functions
  const handleChatSubmit = (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    setTimeout(() => {
      let botResponse: ChatMessage;
      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes("new connection") ||
        lowerMessage.includes("apply")
      ) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content:
            "Great! To apply for a new water connection, I'll need some information:\n\n1. Property details (address, property ID)\n2. Owner information\n3. Connection type (Residential/Commercial)\n4. Required documents\n\nWould you like to:\n• Start the application process (requires login)\n• Know about required documents\n• Check eligibility criteria",
          timestamp: new Date(),
          options: [
            "Start Application (Login Required)",
            "Required Documents",
            "Eligibility Criteria",
          ],
        };
      } else if (
        lowerMessage.includes("track") ||
        lowerMessage.includes("status")
      ) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content:
            "You can track your application or grievance status by entering your Tracking ID.\\n\\nTracking ID formats:\\n• APP-YYYY-XXX (Logged-in user applications)\\n• WNC-YYYY-XXXXXX (First water connection)\\n• GRV-YYYY-XXX (Grievances)\\n\\nWould you like to track now?",
          timestamp: new Date(),
          options: ["Track Application", "Sample Tracking IDs"],
        };
      } else if (lowerMessage.includes("sample")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content:
            "Sample Tracking IDs for testing:\\n\\n• APP-2025-001 (Under Review)\\n• APP-2025-002 (Approved)\\n• WNC-2025-180652 (First Connection - Under Review)\\n• GRV-2025-023 (Grievance - In Progress)\\n\\nTry tracking any of these!",
          timestamp: new Date(),
          options: [
            "Track APP-2025-001",
            "Track WNC-2025-180652",
            "Track GRV-2025-023",
          ],
        };
      } else if (lowerMessage.includes("login")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content:
            "🔐 To proceed, please login using:\n\n• Mobile Number + OTP\n• Consumer ID + OTP\n\nNo password required!",
          timestamp: new Date(),
          options: ["Go to Login Page"],
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content:
            "I can help you with:\n\n• New water connections\n• Bill payments\n• Application tracking\n• Meter readings\n• Grievances\n\nWhat would you like to know more about?",
          timestamp: new Date(),
          options: [
            "New Connection",
            "Pay Bills",
            "Track Application",
          ],
        };
      }

      setChatMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const handleOptionClick = (option: string) => {
    handleChatSubmit(option);

    if (
      option === "Go to Login Page" ||
      option.includes("Login Required")
    ) {
      setTimeout(() => {
        onNavigateToLogin();
      }, 1000);
    } else if (
      option === "Track Application" ||
      option.startsWith("Track APP-") ||
      option.startsWith("Track WNC-") ||
      option.startsWith("Track GRV-")
    ) {
      setTimeout(() => {
        setShowTrackDialog(true);
        setIsChatOpen(false);
        if (option.startsWith("Track ")) {
          const appId = option.replace("Track ", "");
          setTrackingId(appId);
        }
      }, 500);
    }
  };

  const quickServices = [
    {
      icon: FileText,
      title: "Apply for Connection",
      description: "New water connection request",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconColor: "text-blue-600",
      glowColor: "shadow-blue-500/20",
    },
    {
      icon: Plus,
      title: "First Connection",
      description: "Apply without login",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      iconColor: "text-green-600",
      glowColor: "shadow-green-500/20",
      badge: "New",
    },
    {
      icon: CreditCard,
      title: "Pay Bills",
      description: "Quick bill payment",
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50",
      iconColor: "text-orange-600",
      glowColor: "shadow-orange-500/20",
    },
    {
      icon: MessageSquare,
      title: "Raise Grievance",
      description: "Report an issue",
      gradient: "from-rose-500 to-pink-500",
      bgGradient: "from-rose-50 to-pink-50",
      iconColor: "text-rose-600",
      glowColor: "shadow-rose-500/20",
    },
    {
      icon: Search,
      title: "Track Application",
      description: "Check application status",
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50",
      iconColor: "text-purple-600",
      glowColor: "shadow-purple-500/20",
    },
    {
      icon: Activity,
      title: "Submit Reading",
      description: "Meter reading submission",
      gradient: "from-teal-500 to-cyan-500",
      bgGradient: "from-teal-50 to-cyan-50",
      iconColor: "text-teal-600",
      glowColor: "shadow-teal-500/20",
    },
  ];

  const features = [
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Access services anytime, anywhere",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Your data is protected",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Zap,
      title: "Quick Processing",
      description: "Fast application processing",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Optimized for all devices",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const stats = [
    {
      label: "Active Citizens",
      value: 5000,
      suffix: "+",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Bills Paid",
      value: 2000,
      suffix: "+",
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      label: "Avg. Processing",
      value: 2,
      suffix: " Days",
      icon: TrendingDown,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      label: "Satisfaction",
      value: 4.8,
      suffix: "/5",
      icon: Award,
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  // Add a redirect handler for login
  const handleLoginRedirect = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/water-tax/citizen?view=login";
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 h-full"> {/* h-full, no min-h-screen */}
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

    
      

      {/* Hero Section */}
      <section className="relative z-10 pt-8 pb-0 px-0">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center"> {/* Reduced gap-12 to gap-8 */}
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center h-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full mb-4 border-2 border-blue-200 shadow-lg"
              > {/* px-5 py-2.5 mb-6 -> px-4 py-2 mb-4 */}
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">
                  Next-Gen Water Management System
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  ease: "easeOut",
                }}
                className="text-4xl md:text-6xl text-gray-900 mb-4 leading-tight font-bold"
              > {/* text-5xl md:text-7xl mb-6 -> text-4xl md:text-6xl mb-4 */}
                Transform Your
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent"
                >
                  Water Services
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 0.6,
                    duration: 0.6,
                  }}
                  className="block"
                >
                  Experience
                </motion.span>
              </motion.h1>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {/* text-xl mb-8 -> text-lg mb-6 */}
                Seamlessly manage water connections, pay bills
                instantly, and track everything in real-time.
                Join 50,000+ citizens enjoying hassle-free water
                management.
              </p>

              <div className="flex flex-wrap gap-3"> {/* gap-4 -> gap-3 */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={handleLoginRedirect}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl shadow-blue-500/30 text-lg px-6 h-12"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Get Started Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleLoginRedirect}
                    className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 text-lg px-6 h-12"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Track Application
                  </Button>
                </motion.div>
              </div>

              {/* Animated Running Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                {/* grid-cols-4 gap-4 mt-12 -> grid-cols-2 sm:grid-cols-4 gap-3 mt-8 */}
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="relative group"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl`}
                    ></div>
                    <div className="relative bg-white rounded-2xl p-4 border-2 border-blue-100 group-hover:border-blue-300 transition-all shadow-lg text-center">
                      <stat.icon
                        className={`w-8 h-8 mx-auto mb-2 bg-gradient-to-r ${stat.gradient} p-1.5 rounded-lg text-white`}
                      />
                      <motion.p
                        className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                      >
                        <AnimatedCounter
                          value={stat.value}
                          suffix={stat.suffix}
                        />
                      </motion.p>
                      <p className="text-xs text-gray-600 font-medium mt-1">
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - 3D Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Glowing background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-3xl blur-3xl"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                  }}
                ></motion.div>

                {/* Main card */}
                <motion.div
                  className="relative bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-100"
                  whileHover={{ y: -10 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                  }}
                >
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="sticky top-0 z-50 bg-white text-white border-b-4 border-white/20 backdrop-blur-xl">
                      {/* <motion.div
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
                        animate={{ rotate: 0 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <img className="w-15 h-12 text-white" src="/water-tax/panvel.png" alt="Panvel Logo" />
                      </motion.div> */}
                      <div className="bg-white">
                        <h3 className="text-2xl text-gray-900 font-bold">
                          Welcome Citizen,<br/>
                          <span>पनवेल महानगरपालिकेमध्ये आपले स्वागत आहे!</span>
                        </h3>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-2 gap-3">
                      {quickServices
                        .slice(0, 4)
                        .map((service, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05, y: -5 }}
                            onClick={() => {
                              if (
                                service.title ===
                                  "First Connection" &&
                                onNavigateToFirstConnection
                              ) {
                                onNavigateToFirstConnection();
                              } else if (
                                service.title ===
                                "Track Application"
                              ) {
                                setShowTrackDialog(true);
                              } else {
                                onNavigateToLogin();
                              }
                            }}
                            className={`p-4 bg-gradient-to-br ${service.bgGradient} rounded-xl cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all shadow-md hover:shadow-xl`}
                          >
                            <div
                              className={`bg-white w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-md`}
                            >
                              <service.icon
                                className={`w-6 h-6 ${service.iconColor}`}
                              />
                            </div>
                            <p className="text-sm text-gray-900 font-semibold">
                              {service.title}
                            </p>
                          </motion.div>
                        ))}
                    </div>

                    {/* Stats */}
                    {/* <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-blue-100">
                      <div>
                        <p className="text-3xl text-blue-600 font-bold">
                          3
                        </p>
                        <p className="text-xs text-gray-600">
                          Connections
                        </p>
                      </div>
                      <div>
                        <p className="text-3xl text-green-600 font-bold">
                          ₹0
                        </p>
                        <p className="text-xs text-gray-600">
                          Pending
                        </p>
                      </div>
                      <div>
                        <p className="text-3xl text-purple-600 font-bold">
                          0
                        </p>
                        <p className="text-xs text-gray-600">
                          Issues
                        </p>
                      </div>
                    </div> */}
                  </div>
                </motion.div>

                {/* Floating elements */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-24 h-24 bg-gradient-to-br ${
                      i === 0
                        ? "from-blue-300/40 to-cyan-300/40 -top-12 -right-12"
                        : i === 1
                          ? "from-purple-300/40 to-pink-300/40 -bottom-12 -left-12"
                          : "from-green-300/40 to-emerald-300/40 top-1/2 -right-16"
                    } rounded-full blur-2xl`}
                    animate={{
                      y: [0, -20, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reduce space below stats by removing extra margin/padding */}
      {/* Remove or reduce any margin-bottom or padding-bottom after the section */}
      {/* Track Application Dialog */}
      <TrackStatus
        open={showTrackDialog}
        onOpenChange={(open) => {
          setShowTrackDialog(open);
          if (!open) resetTrackDialog();
        }}
        initialId={trackingId}
      />

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full shadow-2xl shadow-blue-500/50 flex items-center justify-center z-50 transition-transform hover:scale-110"
        >
          <Bot className="h-7 w-7" />
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] z-50"
        >
          <Card className="shadow-2xl overflow-hidden border-2 border-blue-200 bg-white">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold">
                    AquaFlow Assistant
                  </h4>
                  <p className="text-cyan-100 text-xs">
                    Online • Ready to help
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setIsChatMinimized(!isChatMinimized)
                  }
                  className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                >
                  {isChatMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChatOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {!isChatMinimized && (
              <>
                <div className="h-96 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.role === "bot" && (
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div className="max-w-[75%]">
                          <div
                            className={`rounded-2xl px-4 py-2 shadow-md ${
                              message.role === "user"
                                ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white"
                                : "bg-white text-gray-800 border-2 border-blue-100"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-line">
                              {message.content}
                            </p>
                            <p
                              className={`text-xs mt-1 ${message.role === "user" ? "text-cyan-100" : "text-gray-500"}`}
                            >
                              {message.timestamp.toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                          {message.options &&
                            message.options.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {message.options.map(
                                  (option, idx) => (
                                    <Button
                                      key={idx}
                                      size="sm"
                                      onClick={() =>
                                        handleOptionClick(
                                          option,
                                        )
                                      }
                                      className="text-xs bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-200"
                                    >
                                      {option}
                                    </Button>
                                  ),
                                )}
                              </div>
                            )}
                        </div>
                      </motion.div>
                    ))}
                    <div ref={chatMessagesEndRef} />
                  </div>
                </div>

                <div className="bg-white p-4 border-t-2 border-blue-100 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) =>
                      setChatInput(e.target.value)
                    }
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      handleChatSubmit(chatInput)
                    }
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border-2 border-blue-200 rounded-full text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <Button
                    onClick={() => handleChatSubmit(chatInput)}
                    disabled={!chatInput.trim()}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full h-10 w-10 p-0 shadow-lg"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
}

export default LandingScreen;