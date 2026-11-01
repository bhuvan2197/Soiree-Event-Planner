import React from 'react';
import {
  LayoutDashboard,
  PieChart,
  CalendarClock,
  Store,
  Lightbulb,
  Users,
  ShieldAlert,
  Bot
} from 'lucide-react';

export default function SubNav({ activeTab, onChangeTab, unreadChatCount = 0 }) {
  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'budget', label: 'Smart Budget', icon: PieChart },
    { id: 'timeline', label: 'Timeline & Run-of-Show', icon: CalendarClock },
    { id: 'vendors', label: 'Vendor Playbook', icon: Store },
    { id: 'ideas', label: 'Ideas Studio', icon: Lightbulb },
    { id: 'guests', label: 'Guests & RSVP', icon: Users },
    { id: 'risks', label: 'Risk Shield', icon: ShieldAlert },
    { id: 'chat', label: 'AI Co-Planner', icon: Bot, isChat: true },
  ];

  return (
    <div className="bg-soiree-cream border-b border-soiree-sand sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none" aria-label="Event planning sections">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={tab.label}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-soiree-burgundy text-[#FAF5EC] shadow-sm font-semibold'
                    : 'text-soiree-ink hover:text-soiree-burgundyDeep hover:bg-soiree-sand/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FAF5EC]' : 'text-soiree-rose'}`} aria-hidden="true" />
                <span>{tab.label}</span>
                {tab.isChat && unreadChatCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-soiree-gold animate-ping" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
