import type { RadioStation } from '../data/stations';

interface StationArtworkProps {
  station: RadioStation;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isPlaying?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<StationArtworkProps['size']>, string> = {
  xs: 'w-11 h-11 rounded-md p-1.5',
  sm: 'w-14 h-14 rounded-lg p-2',
  md: 'w-full aspect-square rounded-xl p-5',
  lg: 'w-44 h-44 sm:w-52 sm:h-52 rounded-2xl p-6',
  xl: 'w-56 h-56 sm:w-64 sm:h-64 rounded-2xl p-7',
};

export function StationArtwork({
  station,
  size = 'md',
  isPlaying = false,
  className = '',
}: StationArtworkProps) {
  const paddingOverride = station.fullBleed ? '!p-0 overflow-hidden' : '';

  return (
    <div
      className={`relative flex items-center justify-center select-none overflow-hidden shadow-lg ring-1 ring-white/10 ${SIZE_CLASSES[size]} ${paddingOverride} ${className}`}
      style={{ background: station.cardBg }}
    >
      {/* Subtle glossy diagonal highlight */}
      {!station.fullBleed && (
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(circle at 22% 18%, rgba(255,255,255,0.45), transparent 58%)',
          }}
        />
      )}

      <img
        src={station.cover}
        alt={station.name}
        loading="lazy"
        draggable={false}
        className={
          station.fullBleed
            ? 'h-full w-full object-cover'
            : 'relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.32)]'
        }
      />

      {isPlaying && (size === 'xs' || size === 'sm') && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 backdrop-blur-[1px]">
          <div className="flex items-end gap-[2.5px] h-3.5">
            <span className="eq-bar eq-bar-1 w-[3px] h-full rounded-full bg-[#1ed760]" />
            <span className="eq-bar eq-bar-2 w-[3px] h-full rounded-full bg-[#1ed760]" />
            <span className="eq-bar eq-bar-3 w-[3px] h-full rounded-full bg-[#1ed760]" />
          </div>
        </div>
      )}
    </div>
  );
}
