import {
  Clock,
  Heart,
  Loader2,
  Pause,
  Play,
  Radio,
  Shuffle,
  Sparkles,
  X,
} from 'lucide-react';
import type { RadioStation } from '../data/stations';
import { formatElapsedAway } from '../lib/radioEngine';
import { StationArtwork } from './StationArtwork';

interface HeroBannerProps {
  station: RadioStation;
  isPlaying: boolean;
  isBuffering: boolean;
  isFavorite: boolean;
  showAwayBanner: boolean;
  awaySeconds: number;
  isFirstVisit: boolean;
  onTogglePlay: () => void;
  onToggleFavorite: () => void;
  onRandomStation: () => void;
  onDismissAwayBanner: () => void;
}

export function HeroBanner({
  station,
  isPlaying,
  isBuffering,
  isFavorite,
  showAwayBanner,
  awaySeconds,
  isFirstVisit,
  onTogglePlay,
  onToggleFavorite,
  onRandomStation,
  onDismissAwayBanner,
}: HeroBannerProps) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl p-5 sm:p-8 ring-1 ring-white/[0.08] transition-all duration-700"
      style={{
        background: `linear-gradient(155deg, ${station.accentColor}44 0%, #16161c 52%, #111115 100%)`,
      }}
    >
      {/* Subtle radial aura */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full opacity-25 blur-3xl transition-colors duration-700"
        style={{ backgroundColor: station.accentColor }}
      />

      {/* Returning listener live-continuity notification */}
      {showAwayBanner && awaySeconds >= 5 && (
        <div className="relative z-10 mb-5 flex items-center justify-between gap-3 rounded-xl bg-black/35 px-4 py-2.5 text-xs sm:text-sm text-zinc-200 ring-1 ring-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 shrink-0 text-[#1ed760]" />
            <span>
              Bienvenido de vuelta a Leonida. Mientras estuviste fuera (
              <strong className="text-white">{formatElapsedAway(awaySeconds)}</strong>), todas las
              emisoras siguieron emitiendo en directo.
            </span>
          </div>
          <button
            onClick={onDismissAwayBanner}
            className="rounded-md p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
            aria-label="Cerrar aviso"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end">
        {/* Artwork Tile */}
        <StationArtwork
          station={station}
          size="lg"
          className="mx-auto shrink-0 shadow-2xl shadow-black/60 md:mx-0"
        />

        {/* Info & Actions */}
        <div className="flex min-w-0 flex-1 flex-col text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white ring-1 ring-white/10">
              <span
                className={`h-2 w-2 rounded-full ${
                  isPlaying ? 'bg-[#1ed760] animate-pulse' : 'bg-rose-500'
                }`}
              />
              En directo · {station.frequency}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.08] px-3 py-1 text-[11px] font-semibold text-zinc-200">
              <Radio className="h-3 w-3 text-zinc-300" />
              {station.category}
            </span>
            {isFirstVisit && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ff4d94]/20 px-2.5 py-1 text-[11px] font-semibold text-pink-200 ring-1 ring-pink-400/25">
                <Sparkles className="h-3 w-3" />
                Emisora aleatoria inicial
              </span>
            )}
          </div>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
            {station.name}
          </h1>

          <p className="mt-1.5 text-sm font-medium text-zinc-200 sm:text-base">
            {station.tagline}
          </p>

          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-zinc-300/90">
            {station.description}
          </p>

          {/* Style pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            {station.styles.map((style) => (
              <span
                key={style}
                className="rounded-md bg-white/[0.08] px-2.5 py-1 text-xs font-medium text-zinc-200"
              >
                {style}
              </span>
            ))}
          </div>

          {/* Primary Spotify-style Action Row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <button
              onClick={onTogglePlay}
              className="inline-flex items-center gap-2.5 rounded-full bg-[#1ed760] px-7 py-3 text-sm font-bold text-black shadow-lg shadow-[#1ed760]/25 transition-all hover:scale-[1.03] hover:bg-[#3be477] active:scale-[0.98]"
            >
              {isBuffering ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5 fill-black" />
              ) : (
                <Play className="h-5 w-5 fill-black ml-0.5" />
              )}
              {isBuffering
                ? 'Sintonizando...'
                : isPlaying
                  ? 'Pausar radio'
                  : 'Sintonizar en directo'}
            </button>

            <button
              onClick={onRandomStation}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/15"
            >
              <Shuffle className="h-4 w-4" />
              Cambiar aleatoria
            </button>

            <button
              onClick={onToggleFavorite}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 transition-all ${
                isFavorite
                  ? 'bg-[#1ed760]/15 text-[#1ed760] ring-[#1ed760]/40'
                  : 'bg-white/[0.07] text-zinc-300 ring-white/10 hover:bg-white/15 hover:text-white'
              }`}
              title={isFavorite ? 'Quitar de favoritas' : 'Añadir a favoritas'}
              aria-label={isFavorite ? 'Quitar de favoritas' : 'Añadir a favoritas'}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-[#1ed760]' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
