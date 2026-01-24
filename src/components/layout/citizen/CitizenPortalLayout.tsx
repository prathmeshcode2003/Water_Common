import Link from "next/link";
import type { ReactNode } from "react";
import type { WaterPortalBranding } from "@/types/water-tax.types";
import { Badge } from "@/components/common/Water.Citizen";
import { Droplets, Phone } from "lucide-react";
// Add these imports for popover, avatar, and icons
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/common/Water.Citizen/Popover";
import { Avatar, AvatarFallback } from "@/components/common/Water.Citizen/Avatar";
import { Bell, X, Clock, ArrowRight, LogOut, Building, MapPin, User, Mail } from "lucide-react";
import { Button } from "@/components/common/Water.Citizen/Button";
import { useEffect, useState } from "react";
export function CitizenPortalLayout({
  branding,
  children,
  showPortalButtons = true,
}: {
  branding: WaterPortalBranding;
  children: ReactNode;
  // showPortalButtons: controls visibility of 'Officer Login' and 'Citizen Portal'
  showPortalButtons?: boolean;
}) {
  // --- Get user from sessionStorage if available, else fallback to empty object ---
  let user: any = {};
  if (typeof window !== "undefined") {
    try {
      const stored = window.sessionStorage.getItem("waterTaxSelectedConsumer");
      if (stored) user = JSON.parse(stored);
    } catch {}
  }

  // Fallback for SSR/initial render (will be hydrated on client)
  user = user && Object.keys(user).length > 0 ? user : {
    name: "",
    mobile: "",
    wardNo: "",
    propertyNumber: "",
    address: "",
    email: "",
  };

  // Static notifications (or fetch from session if you store them)
  // const notifications = [
  //   {
  //     id: "1",
  //     title: "Bill Payment Successful",
  //     message: "You paid ₹982 for WC-2025-002.",
  //     time: "2 hours ago",
  //     read: false,
  //     color: "bg-green-100",
  //     icon: Bell,
  //   },
  //   {
  //     id: "2",
  //     title: "New Bill Generated",
  //     message: "Bill #BILL-2025-001 - ₹1,275 is due.",
  //     time: "3 days ago",
  //     read: true,
  //     color: "bg-orange-100",
  //     icon: Bell,
  //   },
  // ];
  // const unreadCount = notifications.filter((n) => !n.read).length;

  // Notification handlers (static, no API)
  const markAllAsRead = () => {};
  const deleteNotification = (_id: string) => {};
  const handleNotificationClick = (_notification: any) => {};

  // Helper: detect if we are on landing, login, or otp screen
  const isPublicScreen = (() => {
    // If children is a React element, check its type name
    if (
      children &&
      typeof children === "object" &&
      "type" in children &&
      typeof children.type === "function"
    ) {
      const typeName = children.type.name;
      return (
        typeName === "LandingScreen" ||
        typeName === "LoginScreen" ||
        typeName === "OtpScreen"
      );
    }
    return false;
  })();

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden"> {/* h-screen and overflow-hidden */}
      {/* Central aqua header - replaces previous compact header */}
      <nav className="relative z-20 bg-gradient-to-r from-[#005AA7] via-[#005AA7] to-[#005AA7] border-b border-blue-400/30 shadow-lg sticky top-0 flex-shrink-0">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <Droplets className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-white font-bold">{branding.portalName || "Panvel Municipal Corporation"}</h1>
                <p className="text-sm text-white/90">{branding.corporationName || "Water Bill"}</p>
              </div>
            </div>

            {/* --- Show user header after login, not on landing/login/otp screens --- */}
            {!isPublicScreen && (
              <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
                
                {/* User Profile */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-center gap-2 sm:gap-3 px-2 py-1.5 sm:px-3 sm:py-2 bg-white/20 backdrop-blur-sm rounded-lg cursor-pointer hover:bg-white/30 transition-colors border border-white/30">
                      <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                        <AvatarFallback className="bg-white text-blue-600 text-xs sm:text-sm font-semibold">
                          {user.consumerNameEnglish?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block">
                        <p className="text-xs sm:text-sm text-white font-medium">
                          {user.consumerNameEnglish}
                        </p>
                        <p className="text-[10px] sm:text-xs text-white/80">
                          {user.mobileNo}
                        </p>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-80 sm:w-96 p-0 mr-2 sm:mr-4" 
                    align="end"
                  >
                    <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
                      {/* Profile Details */}
                      <div className="p-4 max-h-[60vh] overflow-y-auto">
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">User Profile Information</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {/* Ward No. */}
                          <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm hover:shadow transition-shadow">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-gray-500">Ward No.</p>
                              <p className="text-xs font-semibold text-gray-900 truncate">
                                {user.wardNo || user.wardName || "N/A"}
                              </p>
                            </div>
                          </div>
                          {/* Property No. */}
                          <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm hover:shadow transition-shadow">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                              <Building className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-gray-500">Property No.</p>
                              <p className="text-xs font-semibold text-gray-900 truncate">
                                {user.propertyNo || "N/A"}
                              </p>
                            </div>
                          </div>
                          {/* Name */}
                          <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm hover:shadow transition-shadow col-span-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-gray-500">Name</p>
                              <p className="text-xs font-semibold text-gray-900 truncate">{user.consumerNameEnglish || "N/A"}</p>
                            </div>
                          </div>
                          {/* Address */}
                          <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm hover:shadow transition-shadow col-span-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-gray-500">Address</p>
                              <p className="text-xs font-semibold text-gray-900 truncate">{user.addressEnglish || "N/A"}</p>
                            </div>
                          </div>
                          {/* Mobile */}
                          <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm hover:shadow transition-shadow">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                              <Phone className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-gray-500">Mobile</p>
                              <p className="text-xs font-semibold text-gray-900 truncate">{user.mobileNo || "N/A"}</p>
                            </div>
                          </div>
                          {/* Email */}
                          <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm hover:shadow transition-shadow">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 ">
                            <Mail className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-gray-500">Email</p>
                              <p className="text-xs font-semibold text-gray-900 truncate">{user.emailID || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Footer Actions */}
                      <div className="p-3 border-t border-blue-200 bg-white/80 backdrop-blur-sm">
                        {/* Add account settings or logout here if needed */}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    window.location.href = "/water-tax/citizen?view=login";
                  }}
                  className="flex items-center gap-2 sm:gap-3 px-2 py-1.5 sm:px-3 sm:py-2 bg-white/20 backdrop-blur-sm rounded-lg cursor-pointer hover:bg-white/30 transition-colors border border-white/30"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2 text-white" />
                  <span className="hidden md:inline text-white">Logout</span>
                </Button>
              </div>
            )}
            {/* ...existing code for landing/login/otp header buttons... */}
            {isPublicScreen && (
              <div className="flex items-center gap-4">
                {/* ...existing code... */}
                {showPortalButtons && (
                  <>
                    <Link
                      href="/water-tax/officer"
                      className="hidden sm:inline-flex items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-white/20 hover:border-white/50 transition-all"
                    >
                      Officer Login
                    </Link>
                    <Link
                      href="/water-tax/citizen?view=login"
                      className="hidden sm:inline-flex items-center justify-center rounded-xl bg-white text-[#005AA7] hover:bg-white/90 shadow-lg font-semibold px-4 py-2"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Citizen Portal
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile controls: show status + portal buttons on small screens */}
      <div className="md:hidden bg-gradient-to-r from-[#005AA7] via-[#0077B6] to-[#00C6FF] border-b border-blue-400/20 flex-shrink-0">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant={branding.systemStatus === "Aqua" ? "success" : "danger"}>
                {branding.systemStatus}
              </Badge>
            </div>

            {showPortalButtons && (
              <div className="flex items-center gap-2">
                <Link
                  href="/water-tax/officer"
                  className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/8 px-3 py-1 text-sm text-white hover:bg-white/20 transition"
                >
                  Officer
                </Link>
                <Link
                  href="/water-tax/citizen?view=login"
                  className="inline-flex items-center justify-center rounded-md bg-white text-[#005AA7] px-3 py-1 text-sm font-semibold shadow-sm"
                >
                  Citizen
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content fills viewport, scrolls if needed */}
      <main className="flex-1 min-h-0 overflow-auto">{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gradient-to-r from-[#005AA7] via-[#005AA7] to-[#005AA7] flex-shrink-0">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white">
            <div>{branding.corporationName}</div>
            <div>© {new Date().getFullYear()} Water Tax Management</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
