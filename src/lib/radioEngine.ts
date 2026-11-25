import { STATIONS, type RadioStation } from '../data/stations';

const STORAGE_KEY = 'gta6_radio_live_session_v1';

export interface RadioSessionState {
  /** Unix ms timestamp when this listener's persistent radio world started */
  anchorTimestamp: number;
  /** Random initial offset (seconds) for every station at anchorTimestamp */
  stationOffsets: Record<string, number>;
  /** Currently / last selected station id */
  currentStationId: string;
  /** Saved favorite station ids */
  favorites: string[];
  /** Volume between 0 and 1 */
  volume: number;
  /** Whether subtle FM dial static burst plays when switching stations */
  fmStaticEnabled: boolean;
  /** Timestamp of the user's previous visit (used to show "away" badge) */
  lastSeenAt: number;
}

export interface SessionInitResult {
  state: RadioSessionState;
  isFirstVisit: boolean;
  /** Seconds elapsed since the user last closed/left the page */
  awaySeconds: number;
}

function generateRandomOffsets(): Record<string, number> {
  const offsets: Record<string, number> = {};
  for (const station of STATIONS) {
    // Pick a random point inside the full broadcast, avoiding the last 10s edge
    const safeMax = Math.max(1, station.durationSeconds - 10);
    offsets[station.id] = Math.floor(Math.random() * safeMax);
  }
  return offsets;
}

function pickRandomStationId(): string {
  const idx = Math.floor(Math.random() * STATIONS.length);
  return STATIONS[idx].id;
}

export function createFreshSession(existingPrefs?: Partial<Pick<RadioSessionState, 'favorites' | 'volume' | 'fmStaticEnabled'>>): RadioSessionState {
  const now = Date.now();
  return {
    anchorTimestamp: now,
    stationOffsets: generateRandomOffsets(),
    currentStationId: pickRandomStationId(),
    favorites: existingPrefs?.favorites ?? [],
    volume: existingPrefs?.volume ?? 0.8,
    fmStaticEnabled: existingPrefs?.fmStaticEnabled ?? true,
    lastSeenAt: now,
  };
}

export function loadOrInitSession(): SessionInitResult {
  const now = Date.now();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<RadioSessionState>;
      if (
        typeof parsed.anchorTimestamp === 'number' &&
        parsed.stationOffsets &&
        typeof parsed.currentStationId === 'string' &&
        STATIONS.some((s) => s.id === parsed.currentStationId)
      ) {
        // Ensure any newly added stations also get a deterministic random offset
        const mergedOffsets: Record<string, number> = { ...parsed.stationOffsets };
        for (const s of STATIONS) {
          if (typeof mergedOffsets[s.id] !== 'number') {
            mergedOffsets[s.id] = Math.floor(Math.random() * Math.max(1, s.durationSeconds - 10));
          }
        }
        const awaySeconds =
          typeof parsed.lastSeenAt === 'number'
            ? Math.max(0, Math.floor((now - parsed.lastSeenAt) / 1000))
            : 0;

        const hydrated: RadioSessionState = {
          anchorTimestamp: parsed.anchorTimestamp,
          stationOffsets: mergedOffsets,
          currentStationId: parsed.currentStationId,
          favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
          volume: typeof parsed.volume === 'number' ? Math.min(1, Math.max(0, parsed.volume)) : 0.8,
          fmStaticEnabled: typeof parsed.fmStaticEnabled === 'boolean' ? parsed.fmStaticEnabled : true,
          lastSeenAt: now,
        };
        saveSession(hydrated);
        return {
          state: hydrated,
          isFirstVisit: false,
          awaySeconds,
        };
      }
    }
  } catch {
    // Ignore corrupt localStorage and start fresh
  }

  const fresh = createFreshSession();
  saveSession(fresh);
  return {
    state: fresh,
    isFirstVisit: true,
    awaySeconds: 0,
  };
}

export function saveSession(state: RadioSessionState): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        lastSeenAt: Date.now(),
      })
    );
  } catch {
    // Storage quota or private browsing fallback
  }
}

/**
 * Computes the exact simulated live broadcast timestamp (in seconds)
 * for a given station at `nowMs`. Because every station advances continuously
 * from `anchorTimestamp`, returning hours or days later places the listener
 * further ahead in the broadcast, wrapping seamlessly around the audio duration.
 */
export function getLivePositionSeconds(
  station: RadioStation,
  state: RadioSessionState,
  actualDurationSeconds?: number,
  nowMs: number = Date.now()
): number {
  const duration =
    actualDurationSeconds && Number.isFinite(actualDurationSeconds) && actualDurationSeconds > 0
      ? actualDurationSeconds
      : station.durationSeconds;

  const baseOffset = state.stationOffsets[station.id] ?? 0;
  const elapsedSeconds = Math.max(0, (nowMs - state.anchorTimestamp) / 1000);
  const rawPos = (baseOffset + elapsedSeconds) % duration;
  return rawPos < 0 ? 0 : rawPos;
}

export function formatBroadcastTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  if (hrs > 0) {
    return `${hrs}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

export function formatDurationHuman(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  if (hrs > 0) {
    return `${hrs} h ${mins} min`;
  }
  return `${mins} min`;
}

export function formatElapsedAway(seconds: number): string {
  if (seconds < 60) return `${seconds} s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hrs < 24) return remMins > 0 ? `${hrs} h ${remMins} min` : `${hrs} h`;
  const days = Math.floor(hrs / 24);
  const remHrs = hrs % 24;
  return remHrs > 0 ? `${days} d ${remHrs} h` : `${days} d`;
}
