import React from 'react';
import { TAB_COLORS, type TabId } from '../data/constants';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  hasScriptData: boolean;
}

const TABS: { id: TabId; icon: string; title: string; subtitle: string }[] = [
  { id: 'spy', icon: 'fa-solid fa-magnifying-glass-chart', title: '1. TREND SCOUT', subtitle: 'Phân Tích Kênh Eco-Art' },
  { id: 'script', icon: 'fa-solid fa-scroll', title: '2. STORY WEAVER', subtitle: 'Viết Kịch Bản Cổ Tích' },
  { id: 'studio', icon: 'fa-solid fa-palette', title: '3. CRAFT STUDIO', subtitle: 'Xưởng Sáng Tạo' },
  { id: 'seo', icon: 'fa-solid fa-seedling', title: '4. ECO SEO', subtitle: 'Tối Ưu Viral' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, hasScriptData }) => {
  return (
    <div className="w-full md:w-64 flex md:flex-col gap-2 shrink-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        const isStudioDisabled = tab.id === 'studio' && !hasScriptData && !isActive;
        const colors = TAB_COLORS[tab.id];

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            disabled={isStudioDisabled}
            className={`p-4 rounded-xl text-left border transition-all shrink-0 min-w-[200px] md:min-w-0 ${
              isActive
                ? `${colors.bg} ${colors.border} ${colors.text} ${colors.shadow}`
                : `bg-transparent border-transparent text-emerald-500/50 hover:bg-[#0a1f15] hover:text-emerald-200 ${isStudioDisabled ? 'opacity-30 cursor-not-allowed' : ''}`
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <i className={`${tab.icon} text-lg`}></i>
              <span className="font-bold text-sm">{tab.title}</span>
            </div>
            <p className="text-[10px] opacity-60">{tab.subtitle}</p>
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;