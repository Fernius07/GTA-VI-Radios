import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { STATIONS, type RadioStation } from '../data/stations';
import { StationArtwork } from './StationArtwork';

interface DialViewProps {
  currentStation: RadioStation;
  isPlaying: boolean;
  onSelectStation: (stationId: string) => void;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function DialView({
  currentStation,
  isPlaying,
  onSelectStation,
  onTogglePlay,
  onPrev,
  onNext,
}: DialViewProps) {
  const activeIdx = STATIONS.findIndex((s) => s.id === currentStation.id);

  // Build 5-slot circular carousel centered on activeIdx
  const slots = [-2, -1, 0, 1, 2].map((offset) => {
    const idx = (activeIdx + offset + STATIONS.length) % STATIONS.length;
    return {
      offset,
      station: STATIONS[idx],
    };
  });

  return (
    <section
      className="relative overflow-hidden rounded-2xl px-3 py-6 sm:px-8 sm:py-14 ring-1 ring-white/10 transition-all duration-700"
      style={{
        background: `radial-gradient(circle at 50% 35%, ${currentStation.accentColor}40 0%, #121218 55%, #0a0a0d 100%)`,
      }}
    >
      {/* Top Leonida Header Strip */}
      <div className="mb-6 sm:mb-10 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
        <span>DIAL FM · LEONIDA</span>
        <span>
          {activeIdx + 1} / {STATIONS.length}
        </span>
      </div>

      {/* Horizontal 5-Station Wheel inspired by GTA VI Radio */}
      <div className="flex items-center justify-center gap-3 sm:gap-5">
        {slots.map(({ offset, station }) => {
          const isCenter = offset === 0;
          const isEdge = Math.abs(offset) === 2;
          return (
            <button
              key={`${station.id}-${offset}`}
              onClick={() => (isCenter ? onTogglePlay() : onSelectStation(station.id))}
              className={`group relative transition-all duration-300 focus:outline-none ${
                isCenter
                  ? 'z-20 w-40 sm:w-52 scale-100 opacity-100'
                  : isEdge
                    ? 'hidden md:block w-28 sm:w-32 scale-90 opacity-45 hover:opacity-75'
                    : 'w-24 sm:w-36 scale-95 opacity-65 hover:opacity-90'
              }`}
            >
              <div
                className={`rounded-2xl p-1 transition-all ${
                  isCenter
                    ? 'ring-2 ring-white shadow-2xl shadow-black/70'
                    : 'ring-1 ring-white/10'
                }`}
              >
                <StationArtwork station={station} size="md" />
              </div>
              {isCenter && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/65 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                    {isPlaying ? (
                      <Pause className="h-5 w-5 fill-white" />
                    ) : (
                      <Play className="h-5 w-5 fill-white ml-0.5" />
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* L1 / R1 Style Dial Controls */}
      <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4">
        <button
          onClick={onPrev}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 sm:px-3.5 text-xs font-bold uppercase tracking-wider text-white ring-1 ring-white/15 transition hover:bg-white/20 touch-manipulation"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>

        <div className="h-1.5 w-24 sm:w-44 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-white transition-all duration-300"
            style={{
              width: `${((activeIdx + 1) / STATIONS.length) * 100}%`,
            }}
          />
        </div>

        <button
          onClick={onNext}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 sm:px-3.5 text-xs font-bold uppercase tracking-wider text-white ring-1 ring-white/15 transition hover:bg-white/20 touch-manipulation"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Center Station Details */}
      <div className="mx-auto mt-5 sm:mt-7 max-w-xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-200 ring-1 ring-white/10">
          <span
            className={`h-2 w-2 rounded-full ${
              isPlaying ? 'bg-[#1ed760] animate-pulse' : 'bg-rose-500'
            }`}
          />
          {currentStation.frequency} · En directo
        </div>
        <h2 className="mt-2.5 sm:mt-3 font-display text-2xl sm:text-4xl font-bold uppercase tracking-wide text-white">
          {currentStation.name}
        </h2>
        <p className="mt-1 text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-300">
          {currentStation.styles.join(' · ')}
        </p>
        <p className="mt-2 sm:mt-3 line-clamp-3 sm:line-clamp-none text-xs sm:text-sm leading-relaxed text-zinc-400">
          {currentStation.description}
        </p>

        <button
          onClick={onTogglePlay}
          className="mt-4 sm:mt-6 inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-2.5 sm:py-3 text-sm font-bold text-black shadow-xl transition hover:scale-[1.03] hover:bg-zinc-100 touch-manipulation"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4 fill-black" />
              Pausar señal
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-black ml-0.5" />
              Sintonizar emisora
            </>
          )}
        </button>
      </div>
    </section>
  );
}
