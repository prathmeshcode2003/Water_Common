'use client';

import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Water.Citizen/Badge';
import { Megaphone } from 'lucide-react';

interface NewsItem {
    text: string;
    badge?: string;
}

/**
 * NewsMarquee - Client Component
 * 
 * Scrolling news marquee with announcements.
 * Hidden on mobile, visible on desktop (lg+).
 */
export function NewsMarquee() {
    const newsItems: NewsItem[] = [
        { text: '🎉 Free Meter Installation - Starting January 2026', badge: 'New' },
        { text: '💧 Rainwater Harvesting - Subsidy up to ₹10,000', badge: 'New' },
        { text: '💳 Digital Payments Bonus - Cashback on online bills', badge: 'New' },
        { text: '🏠 Low-Income Housing - 50% connection fee waiver', badge: 'New' },
    ];

    // Duplicate items for seamless loop
    const allItems = [...newsItems, ...newsItems];

    return (
        <Card className="hidden lg:block lg:flex-1 lg:min-w-0 h-fit bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 border-2 border-blue-300 shadow-md overflow-hidden p-0">
            <div className="flex items-center gap-3 h-fit p-3 px-0 py-0 mx-0 my-[1px]">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                    <Megaphone className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 overflow-hidden">
                    {/* Continuous marquee animation */}
                    <div
                        className="flex items-center gap-6 whitespace-nowrap"
                        style={{
                            animation: 'marquee 25s linear infinite',
                            minWidth: 'max-content',
                        }}
                    >
                        {allItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="text-white text-sm font-medium">{item.text}</span>
                                {item.badge && (
                                    <Badge className="bg-white/20 text-white border-0 text-[10px] px-2 py-0.5">
                                        {item.badge}
                                    </Badge>
                                )}
                                {index < allItems.length - 1 && (
                                    <span className="text-white/40 text-lg">•</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* CSS Keyframes for marquee animation */}
                    <style jsx global>{`
            @keyframes marquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}</style>
                </div>
            </div>
        </Card>
    );
}
