import { Disc3, Heart, Home } from 'lucide-react';
import type { SidebarTab } from './Sidebar';

interface MobileNavProps {
  activeTab: SidebarTab;
  favoritesCount: number;
  onChangeTab: (tab: SidebarTab) => void;
}

export function MobileNav({
  activeTab,
  favoritesCount,
  onChangeTab,
}: MobileNavProps) {
  const items: { id: SidebarTab; label: string; icon: typeof Home; badge?: number }[] = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'dial', label: 'Dial GTA', icon: Disc3 },
    { id: 'favorites', label: 'Favoritas', icon: Heart, badge: favoritesCount },
  ];

  return (
    <nav
      className="z-30 shrink-0 border-t border-white/[0.08] bg-[#09090b]/95 px-4 pt-1.5 pb-[max(0.45rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
      aria-label="Navegación móvil"
    >
      <div className="mx-auto grid max-w-md grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-1.5 text-[11px] font-semibold transition-colors touch-manipulation ${
                active ? 'text-white' : 'text-zinc-500 active:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform ${
                    active ? 'scale-105 text-[#1ed760]' : ''
                  }`}
                />
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1ed760] px-1 text-[9px] font-extrabold text-black">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
