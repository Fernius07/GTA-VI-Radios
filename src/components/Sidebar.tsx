import { Disc3, Heart, Home, Radio, X } from 'lucide-react';
import { STATIONS, type RadioStation } from '../data/stations';
import { StationArtwork } from './StationArtwork';

export type SidebarTab = 'home' | 'favorites' | 'dial';

interface SidebarProps {
  activeTab: SidebarTab;
  onChangeTab: (tab: SidebarTab) => void;
  currentStation: RadioStation;
  isPlaying: boolean;
  favorites: string[];
  onSelectStation: (stationId: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  activeTab,
  onChangeTab,
  currentStation,
  isPlaying,
  favorites,
  onSelectStation,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const navItems: { id: SidebarTab; label: string; icon: typeof Home; badge?: number }[] = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'dial', label: 'Modo Dial GTA', icon: Disc3 },
    { id: 'favorites', label: 'Tus Favoritas', icon: Heart, badge: favorites.length },
  ];

  const content = (
    <aside className="flex h-full w-72 flex-col gap-2 bg-[#09090b] p-2 select-none">
      {/* Brand + Main Navigation Card */}
      <div className="rounded-xl bg-[#121216] p-4 ring-1 ring-white/[0.06]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff4d94] via-[#a855f7] to-[#fb923c] shadow-lg shadow-[#ff4d94]/20">
              <Radio className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-display text-lg font-bold tracking-wider leading-none text-white">
                GTA VI <span className="text-[#ff6ba8]">RADIO</span>
              </div>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                The Sound of Leonida
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeTab(item.id);
                  onCloseMobile();
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${active ? 'text-[#1ed760]' : ''}`} />
                  {item.label}
                </span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-zinc-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Stations Library List (Spotify Left Library style) */}
      <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-[#121216] ring-1 ring-white/[0.06]">
        <div className="flex items-center justify-between px-4 pt-4 pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Emisoras FM / AM
          </span>
          <span className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[11px] font-semibold text-zinc-300">
            {STATIONS.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
          {STATIONS.map((station) => {
            const isActive = station.id === currentStation.id;
            const isFav = favorites.includes(station.id);
            return (
              <button
                key={station.id}
                onClick={() => {
                  onSelectStation(station.id);
                  onCloseMobile();
                }}
                className={`group flex w-full items-center gap-3 rounded-lg p-2 text-left transition-all ${
                  isActive
                    ? 'bg-white/[0.11] text-white'
                    : 'text-zinc-300 hover:bg-white/[0.05]'
                }`}
              >
                <StationArtwork
                  station={station}
                  size="xs"
                  isPlaying={isActive && isPlaying}
                  className="shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`truncate text-sm font-semibold ${
                        isActive ? 'text-[#1ed760]' : 'text-zinc-100 group-hover:text-white'
                      }`}
                    >
                      {station.name}
                    </span>
                  </div>
                  <p className="truncate text-xs text-zinc-400">
                    {station.frequency} · {station.styles[0]}
                  </p>
                </div>
                {isFav && (
                  <Heart className="h-3.5 w-3.5 shrink-0 fill-[#1ed760] text-[#1ed760]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop persistent sidebar */}
      <div className="hidden lg:block lg:h-full lg:shrink-0">{content}</div>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full">{content}</div>
        </div>
      )}
    </>
  );
}
