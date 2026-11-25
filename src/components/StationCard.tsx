import { Heart, Pause, Play } from 'lucide-react';
import type { RadioStation } from '../data/stations';
import { GENRE_LABELS, UI_TEXT, type Language } from '../lib/i18n';
import { StationArtwork } from './StationArtwork';

interface StationCardProps {
  station: RadioStation;
  isActive: boolean;
  isPlaying: boolean;
  isFavorite: boolean;
  lang: Language;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

export function StationCard({
  station,
  isActive,
  isPlaying,
  isFavorite,
  lang,
  onSelect,
  onToggleFavorite,
}: StationCardProps) {
  const t = UI_TEXT[lang];
  const genreLabel = GENRE_LABELS[lang][station.category];

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative flex cursor-pointer flex-col rounded-xl p-2.5 sm:p-3.5 transition-all duration-200 active:scale-[0.98] touch-manipulation ${
        isActive
          ? 'bg-[#202028] ring-1 ring-[#1ed760]/45 shadow-xl shadow-black/40'
          : 'bg-[#16161b] hover:bg-[#202028] ring-1 ring-white/[0.04] hover:ring-white/10'
      }`}
    >
      {/* Square Cover + Floating Spotify Play Button */}
      <div className="relative mb-2.5 sm:mb-3.5">
        <StationArtwork station={station} size="md" />

        {/* Live indicator pill when active */}
        {isActive && (
          <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-20 inline-flex items-center gap-1 rounded-full bg-black/75 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isPlaying ? 'bg-[#1ed760] animate-pulse' : 'bg-zinc-400'
              }`}
            />
            {isPlaying ? t.grid.playingBadge : t.grid.tunedBadge}
          </span>
        )}

        {/* Favorite subtle button top-right (always shown if favorited, otherwise desktop hover only) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 items-center justify-center rounded-full bg-black/55 backdrop-blur-md transition-all h-7 w-7 sm:h-8 sm:w-8 ${
            isFavorite
              ? 'flex opacity-100 text-[#1ed760]'
              : 'hidden sm:flex opacity-0 group-hover:opacity-100 text-white/80 hover:text-white'
          }`}
          aria-label={isFavorite ? t.hero.removeFavorite : t.grid.saveFavorite}
        >
          <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFavorite ? 'fill-[#1ed760]' : ''}`} />
        </button>

        {/* Floating Spotify Play Button */}
        <div
          className={`absolute right-2 bottom-2 sm:right-2.5 sm:bottom-2.5 z-20 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-xl shadow-black/50 transition-all duration-200 ${
            isActive
              ? 'translate-y-0 opacity-100'
              : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
          } hover:scale-105 hover:bg-[#3be477]`}
        >
          {isActive && isPlaying ? (
            <Pause className="h-4 w-4 sm:h-5 sm:w-5 fill-black" />
          ) : (
            <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-black ml-0.5" />
          )}
        </div>
      </div>

      {/* Title & Frequency */}
      <div className="flex items-start justify-between gap-1.5">
        <h3
          className={`truncate text-sm sm:text-[15px] font-bold ${
            isActive ? 'text-[#1ed760]' : 'text-white'
          }`}
        >
          {station.name}
        </h3>
        <span className="shrink-0 rounded bg-white/[0.06] px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-zinc-400">
          {station.frequency}
        </span>
      </div>

      {/* Styles / Genre tags */}
      <p className="mt-0.5 sm:mt-1 truncate text-[11px] sm:text-xs font-medium text-zinc-300">
        {station.styles.slice(0, 3).join(' · ')}
      </p>

      {/* Description */}
      <p className="mt-1 sm:mt-1.5 line-clamp-2 text-[11px] sm:text-xs leading-relaxed text-zinc-400">
        {station.description}
      </p>

      {/* Footer category (desktop/tablet) */}
      <div className="hidden sm:flex mt-auto pt-3 items-center text-[11px] text-zinc-500">
        <span>{genreLabel}</span>
      </div>
    </div>
  );
}
