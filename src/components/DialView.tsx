import { useRef, type CSSProperties, type TouchEvent } from 'react';
import { ChevronLeft, ChevronRight, Music2, Pause, Play } from 'lucide-react';
import { STATIONS, type RadioStation } from '../data/stations';
import type { CurrentTrackInfo } from '../lib/radioEngine';
import { UI_TEXT, type Language } from '../lib/i18n';
import { StationArtwork } from './StationArtwork';
import { MarqueeText } from './MarqueeText';

interface DialViewProps {
  currentStation: RadioStation;
  currentTrack: CurrentTrackInfo | null;
  isPlaying: boolean;
  lang: Language;
  onSelectStation: (stationId: string) => void;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function DialView({
  currentStation,
  currentTrack,
  isPlaying,
  lang,
  onSelectStation,
  onTogglePlay,
  onPrev,
  onNext,
}: DialViewProps) {
  const t = UI_TEXT[lang].dial;
  const activeIdx = STATIONS.findIndex((s) => s.id === currentStation.id);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: TouchEvent<HTMLElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: TouchEvent<HTMLElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) < 32 || Math.abs(dx) <= Math.abs(dy)) return;
    if (dx < 0) {
      onNext();
    } else {
      onPrev();
    }
  };

  const n = STATIONS.length;

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-hidden rounded-2xl px-3 py-6 sm:px-8 sm:py-14 ring-1 ring-white/10 transition-all duration-700 touch-pan-y select-none"
      style={{
        background: `radial-gradient(circle at 50% 35%, ${currentStation.accentColor}40 0%, #121218 55%, #0a0a0d 100%)`,
      }}
    >
      {/* Top Leonida Header Strip */}
      <div className="mb-6 sm:mb-10 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
        <span>{t.header}</span>
        <span>
          {activeIdx + 1} / {n}
        </span>
      </div>

      {/* Smooth Sliding Horizontal Station Wheel inspired by GTA VI Radio */}
      <div className="dial-stage relative mx-auto flex h-48 sm:h-56 md:h-60 w-full max-w-[860px] items-center justify-center overflow-hidden">
        {STATIONS.map((station, idx) => {
          let delta = idx - activeIdx;
          if (delta > n / 2) delta -= n;
          if (delta < -n / 2) delta += n;

          const absDelta = Math.abs(delta);
          const isCenter = delta === 0;
          const isVisible = absDelta <= 3;

          let translateX = '0px';
          let scale = 1;
          let zIndex = 1;
          let opacityClass = 'opacity-0 pointer-events-none';

          if (delta === 0) {
            translateX = '0px';
            scale = 1;
            zIndex = 30;
            opacityClass = 'opacity-100 cursor-pointer';
          } else if (absDelta === 1) {
            translateX = delta > 0 ? 'var(--dial-x1)' : 'calc(-1 * var(--dial-x1))';
            scale = 0.72;
            zIndex = 20;
            opacityClass = 'opacity-70 hover:opacity-95 cursor-pointer';
          } else if (absDelta === 2) {
            translateX = delta > 0 ? 'var(--dial-x2)' : 'calc(-1 * var(--dial-x2))';
            scale = 0.56;
            zIndex = 10;
            opacityClass = 'opacity-0 md:opacity-45 md:hover:opacity-75 pointer-events-none md:pointer-events-auto cursor-pointer';
          } else if (absDelta === 3) {
            translateX = delta > 0 ? 'var(--dial-x3)' : 'calc(-1 * var(--dial-x3))';
            scale = 0.45;
            zIndex = 5;
            opacityClass = 'opacity-0 pointer-events-none';
          } else {
            translateX = delta > 0 ? 'var(--dial-x3)' : 'calc(-1 * var(--dial-x3))';
            scale = 0.45;
            zIndex = 1;
            opacityClass = 'opacity-0 pointer-events-none';
          }

          const itemStyle: CSSProperties = {
            transform: `translate3d(${translateX}, 0, 0) scale(${scale})`,
            zIndex,
            transition: isVisible
              ? 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1), opacity 340ms ease'
              : 'none',
            willChange: isVisible ? 'transform, opacity' : 'auto',
          };

          return (
            <button
              key={station.id}
              onClick={() => (isCenter ? onTogglePlay() : onSelectStation(station.id))}
              style={itemStyle}
              tabIndex={absDelta <= 2 ? 0 : -1}
              aria-hidden={absDelta > 2}
              aria-label={station.name}
              className={`group absolute w-40 sm:w-48 md:w-52 focus:outline-none ${opacityClass}`}
            >
              <div
                className={`rounded-2xl p-1 transition-all duration-300 ${
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

      {/* Arrow-only Dial Controls */}
      <div className="mt-6 sm:mt-8 flex items-center justify-center gap-4">
        <button
          onClick={onPrev}
          aria-label={t.prevStation}
          title={t.prevStation}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/20 active:scale-95 touch-manipulation"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="h-1.5 w-28 sm:w-44 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-white transition-all duration-300"
            style={{
              width: `${((activeIdx + 1) / n) * 100}%`,
            }}
          />
        </div>

        <button
          onClick={onNext}
          aria-label={t.nextStation}
          title={t.nextStation}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/20 active:scale-95 touch-manipulation"
        >
          <ChevronRight className="h-5 w-5" />
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
          {currentStation.frequency} · {t.live}
        </div>
        <h2 className="mt-2.5 sm:mt-3 font-display text-2xl sm:text-4xl font-bold uppercase tracking-wide text-white">
          {currentStation.name}
        </h2>
        <p className="mt-1 text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-300">
          {currentStation.styles.join(' · ')}
        </p>
        {currentStation.hosts && (
          <p className="mt-1 text-xs font-medium text-zinc-400">
            {t.hostedBy} {currentStation.hosts}
          </p>
        )}
        <p className="mt-2 sm:mt-3 line-clamp-3 sm:line-clamp-none text-xs sm:text-sm leading-relaxed text-zinc-400">
          {currentStation.description}
        </p>

        {currentTrack && (
          <div className="mt-3.5 flex justify-center">
            <div className="inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full bg-black/45 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/10">
              <Music2 className="h-3.5 w-3.5 shrink-0 text-[#1ed760]" />
              <div className="min-w-0 flex-1">
                <MarqueeText
                  watchKey={`${currentTrack.track.title}-${currentTrack.track.artist}`}
                >
                  {currentTrack.track.title}
                  {currentTrack.track.artist ? ` — ${currentTrack.track.artist}` : ''}
                </MarqueeText>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onTogglePlay}
          className="mt-4 sm:mt-6 inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-2.5 sm:py-3 text-sm font-bold text-black shadow-xl transition hover:scale-[1.03] hover:bg-zinc-100 touch-manipulation"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4 fill-black" />
              {t.pauseSignal}
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-black ml-0.5" />
              {t.tuneStation}
            </>
          )}
        </button>
      </div>
    </section>
  );
}
