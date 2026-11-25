import {
  Heart,
  Loader2,
  Music2,
  Pause,
  Play,
  Radio,
  Shuffle,
  Sparkles,
} from 'lucide-react';
import type { RadioStation } from '../data/stations';
import type { CurrentTrackInfo } from '../lib/radioEngine';
import { GENRE_LABELS, UI_TEXT, type Language } from '../lib/i18n';
import { StationArtwork } from './StationArtwork';
import { MarqueeText } from './MarqueeText';

interface HeroBannerProps {
  station: RadioStation;
  currentTrack: CurrentTrackInfo | null;
  isPlaying: boolean;
  isBuffering: boolean;
  isFavorite: boolean;
  isFirstVisit: boolean;
  lang: Language;
  onTogglePlay: () => void;
  onToggleFavorite: () => void;
  onRandomStation: () => void;
}

export function HeroBanner({
  station,
  currentTrack,
  isPlaying,
  isBuffering,
  isFavorite,
  isFirstVisit,
  lang,
  onTogglePlay,
  onToggleFavorite,
  onRandomStation,
}: HeroBannerProps) {
  const t = UI_TEXT[lang].hero;
  const genreLabel = GENRE_LABELS[lang][station.category];

  return (
    <section
      className="relative overflow-hidden rounded-2xl p-4 md:p-8 ring-1 ring-white/[0.08] transition-all duration-700"
      style={{
        background: `linear-gradient(155deg, ${station.accentColor}44 0%, #16161c 52%, #111115 100%)`,
      }}
    >
      {/* Subtle radial aura */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full opacity-25 blur-3xl transition-colors duration-700"
        style={{ backgroundColor: station.accentColor }}
      />

      {/* Compact Spotify-Mobile "Now Tuned" Card (< md) */}
      <div className="relative z-10 flex flex-col gap-3.5 md:hidden">
        <div className="flex items-center gap-3.5">
          <StationArtwork
            station={station}
            size="mobileHero"
            className="shrink-0 shadow-xl shadow-black/50"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ring-1 ring-white/10">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isPlaying ? 'bg-[#1ed760] animate-pulse' : 'bg-rose-500'
                  }`}
                />
                {t.live} · {station.frequency}
              </span>
            </div>
            <h1 className="mt-1.5 truncate text-xl font-black tracking-tight text-white">
              {station.name}
            </h1>
            <p className="mt-0.5 line-clamp-1 text-xs font-medium text-zinc-200">
              {station.tagline}
            </p>
            {station.hosts && (
              <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-zinc-400">
                {t.hostedBy} {station.hosts}
              </p>
            )}
          </div>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-300/90">
          {station.description}
        </p>

        {currentTrack && (
          <div className="flex items-center gap-2.5 rounded-xl bg-black/35 px-3 py-2 ring-1 ring-white/10 backdrop-blur-md">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1ed760]/15 text-[#1ed760]">
              <Music2 className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {t.nowPlaying}
              </p>
              <MarqueeText
                watchKey={`${currentTrack.track.title}-${currentTrack.track.artist}`}
                className="text-xs font-bold text-white"
              >
                {currentTrack.track.title}
                {currentTrack.track.artist ? (
                  <span className="font-normal text-zinc-300">
                    {' '}· {currentTrack.track.artist}
                  </span>
                ) : null}
              </MarqueeText>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          {station.styles.slice(0, 3).map((style) => (
            <span
              key={style}
              className="rounded-md bg-white/[0.08] px-2 py-0.5 text-[11px] font-medium text-zinc-200"
            >
              {style}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={onTogglePlay}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1ed760] px-4 py-2.5 text-xs font-bold text-black shadow-lg shadow-[#1ed760]/25 transition active:scale-[0.98] touch-manipulation"
          >
            {isBuffering ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4 fill-black" />
            ) : (
              <Play className="h-4 w-4 fill-black ml-0.5" />
            )}
            {isBuffering ? t.tuning : isPlaying ? t.pauseShort : t.tuneShort}
          </button>

          <button
            onClick={onRandomStation}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white/10 px-4 py-2.5 text-xs font-semibold text-white ring-1 ring-white/10 transition active:scale-[0.98] touch-manipulation"
          >
            <Shuffle className="h-3.5 w-3.5" />
            {t.randomShort}
          </button>

          <button
            onClick={onToggleFavorite}
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 transition active:scale-95 touch-manipulation ${
              isFavorite
                ? 'bg-[#1ed760]/15 text-[#1ed760] ring-[#1ed760]/40'
                : 'bg-white/[0.07] text-zinc-300 ring-white/10'
            }`}
            title={isFavorite ? t.removeFavorite : t.addFavorite}
            aria-label={isFavorite ? t.removeFavorite : t.addFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-[#1ed760]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Full Desktop Hero (>= md) */}
      <div className="relative z-10 hidden md:flex md:flex-row md:items-center md:gap-8">
        {/* Artwork Tile */}
        <StationArtwork
          station={station}
          size="xl"
          className="shrink-0 shadow-2xl shadow-black/60"
        />

        {/* Info & Actions */}
        <div className="flex min-w-0 flex-1 flex-col text-left">
          <div className="flex flex-wrap items-center justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white ring-1 ring-white/10">
              <span
                className={`h-2 w-2 rounded-full ${
                  isPlaying ? 'bg-[#1ed760] animate-pulse' : 'bg-rose-500'
                }`}
              />
              {t.live} · {station.frequency}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.08] px-3 py-1 text-[11px] font-semibold text-zinc-200">
              <Radio className="h-3 w-3 text-zinc-300" />
              {genreLabel}
            </span>
            {isFirstVisit && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ff4d94]/20 px-2.5 py-1 text-[11px] font-semibold text-pink-200 ring-1 ring-pink-400/25">
                <Sparkles className="h-3 w-3" />
                {t.initialRandom}
              </span>
            )}
          </div>

          <h1 className="mt-2.5 text-4xl font-black tracking-tight text-white lg:text-5xl">
            {station.name}
          </h1>

          <p className="mt-1 text-base font-medium text-zinc-200">
            {station.tagline}
          </p>

          {station.hosts && (
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {t.hostedBy} {station.hosts}
            </p>
          )}

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300/90">
            {station.description}
          </p>

          {currentTrack && (
            <div className="mt-3 inline-flex max-w-full sm:max-w-xl items-center gap-3 self-start rounded-xl bg-black/35 px-3.5 py-2 ring-1 ring-white/10 backdrop-blur-md">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1ed760]/15 text-[#1ed760]">
                <Music2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {t.nowPlaying}
                </p>
                <MarqueeText
                  watchKey={`${currentTrack.track.title}-${currentTrack.track.artist}`}
                  className="text-sm font-bold text-white"
                >
                  {currentTrack.track.title}
                  {currentTrack.track.artist ? (
                    <span className="font-medium text-zinc-300">
                      {' '}— {currentTrack.track.artist}
                    </span>
                  ) : null}
                </MarqueeText>
              </div>
            </div>
          )}

          {/* Style pills */}
          <div className="mt-3 flex flex-wrap items-center justify-start gap-2">
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
          <div className="mt-4 flex flex-wrap items-center justify-start gap-3">
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
                ? t.tuning
                : isPlaying
                  ? t.pauseRadio
                  : t.tuneInLive}
            </button>

            <button
              onClick={onRandomStation}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/15"
            >
              <Shuffle className="h-4 w-4" />
              {t.changeRandom}
            </button>

            <button
              onClick={onToggleFavorite}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 transition-all ${
                isFavorite
                  ? 'bg-[#1ed760]/15 text-[#1ed760] ring-[#1ed760]/40'
                  : 'bg-white/[0.07] text-zinc-300 ring-white/10 hover:bg-white/15 hover:text-white'
              }`}
              title={isFavorite ? t.removeFavorite : t.addFavorite}
              aria-label={isFavorite ? t.removeFavorite : t.addFavorite}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-[#1ed760]' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
