import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getAudioUrl, STATIONS, type RadioStation } from '../data/stations';
import {
  createFreshSession,
  getCurrentTrack,
  getLivePositionSeconds,
  loadOrInitSession,
  saveSession,
  type CurrentTrackInfo,
  type RadioSessionState,
} from '../lib/radioEngine';
import { getStationLockscreenArtwork } from '../lib/mediaArtwork';
import { playFmTuningBurst } from '../lib/fmStatic';

export interface RadioPlayerController {
  session: RadioSessionState;
  currentStation: RadioStation;
  currentTrack: CurrentTrackInfo | null;
  isFirstVisit: boolean;
  awaySeconds: number;
  isPlaying: boolean;
  isBuffering: boolean;
  audioError: string | null;
  livePosition: number;
  effectiveDuration: number;
  isMuted: boolean;
  selectStation: (stationId: string, autoPlay?: boolean) => void;
  togglePlay: () => void;
  nextStation: () => void;
  prevStation: () => void;
  tuneRandomStation: () => void;
  toggleFavorite: (stationId: string) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleFmStatic: () => void;
  resetSessionRandomly: () => void;
  dismissAwayBanner: () => void;
  showAwayBanner: boolean;
}

export function useRadioPlayer(): RadioPlayerController {
  const initial = useMemo(() => loadOrInitSession(), []);
  const [session, setSession] = useState<RadioSessionState>(initial.state);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(initial.isFirstVisit);
  const [awaySeconds, setAwaySeconds] = useState<number>(initial.awaySeconds);
  const [showAwayBanner, setShowAwayBanner] = useState<boolean>(
    !initial.isFirstVisit && initial.awaySeconds >= 5
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [actualDuration, setActualDuration] = useState<number | undefined>(undefined);

  const currentStation = useMemo(
    () => STATIONS.find((s) => s.id === session.currentStationId) ?? STATIONS[0],
    [session.currentStationId]
  );

  const [livePosition, setLivePosition] = useState<number>(() =>
    getLivePositionSeconds(currentStation, initial.state)
  );

  const effectiveDuration = actualDuration ?? currentStation.durationSeconds;

  const currentTrack = useMemo(
    () => getCurrentTrack(currentStation.id, livePosition, effectiveDuration),
    [currentStation.id, livePosition, effectiveDuration]
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sessionRef = useRef<RadioSessionState>(session);
  const currentStationRef = useRef<RadioStation>(currentStation);
  const wantPlayRef = useRef<boolean>(false);
  const needsInitialSeekRef = useRef<boolean>(true);
  const loadedStationIdRef = useRef<string | null>(null);

  sessionRef.current = session;
  currentStationRef.current = currentStation;

  // Persist session changes to localStorage
  useEffect(() => {
    saveSession(session);
  }, [session]);

  // Periodically update lastSeenAt + on page hide/unload so returning later accurately reflects time away
  useEffect(() => {
    const touchLastSeen = () => saveSession(sessionRef.current);
    const interval = window.setInterval(touchLastSeen, 10000);
    window.addEventListener('beforeunload', touchLastSeen);
    document.addEventListener('visibilitychange', touchLastSeen);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('beforeunload', touchLastSeen);
      document.removeEventListener('visibilitychange', touchLastSeen);
    };
  }, []);

  // Create and bind single HTMLAudioElement once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.loop = true;
    audio.volume = sessionRef.current.volume;
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('x-webkit-airplay', 'allow');
    audioRef.current = audio;

    const applyLiveSeekAndPlay = () => {
      const station = currentStationRef.current;
      const st = sessionRef.current;
      const dur =
        Number.isFinite(audio.duration) && audio.duration > 0
          ? audio.duration
          : station.durationSeconds;

      setActualDuration(dur);

      if (needsInitialSeekRef.current) {
        const target = getLivePositionSeconds(station, st, dur);
        needsInitialSeekRef.current = false;
        try {
          audio.currentTime = target;
          setLivePosition(target);
        } catch {
          // Will retry on canplay if seekable range wasn't ready
          needsInitialSeekRef.current = true;
        }
      }

      if (wantPlayRef.current) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
            setAudioError(null);
          })
          .catch(() => {
            // Browser autoplay policy blocked playback until explicit user click
            setIsPlaying(false);
            setIsBuffering(false);
          });
      }
    };

    const onLoadedMetadata = () => applyLiveSeekAndPlay();
    const onCanPlay = () => {
      if (needsInitialSeekRef.current) {
        applyLiveSeekAndPlay();
      } else {
        setIsBuffering(false);
      }
    };
    const onWaiting = () => {
      if (wantPlayRef.current) setIsBuffering(true);
    };
    const onPlaying = () => {
      setIsPlaying(true);
      setIsBuffering(false);
      setAudioError(null);
    };
    const onPause = () => {
      setIsPlaying(false);
      setIsBuffering(false);
    };
    const onEnded = () => {
      // Loop seamlessly from 0
      audio.currentTime = 0;
      if (wantPlayRef.current) {
        void audio.play();
      }
    };
    const onError = () => {
      setIsBuffering(false);
      setIsPlaying(false);
      wantPlayRef.current = false;
      setAudioError(
        'No se pudo cargar el audio de esta emisora. En local asegúrate de tener los MP3 en local-audio/ y en Vercel configura VITE_AUDIO_BASE_URL.'
      );
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    // Load initial station metadata without forcing autoplay before user gesture
    const initStation = currentStationRef.current;
    loadedStationIdRef.current = initStation.id;
    needsInitialSeekRef.current = true;
    audio.src = getAudioUrl(initStation);
    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.src = '';
    };
  }, []);

  // Keep live position ticker running every 500ms so the broadcast clock always advances smoothly
  useEffect(() => {
    const tick = () => {
      const audio = audioRef.current;
      const station = currentStationRef.current;
      const st = sessionRef.current;
      const dur =
        audio && Number.isFinite(audio.duration) && audio.duration > 0
          ? audio.duration
          : station.durationSeconds;

      if (audio && !audio.paused && !audio.seeking) {
        setLivePosition(audio.currentTime);
      } else {
        // Even while paused, the simulated live radio broadcast keeps advancing!
        setLivePosition(getLivePositionSeconds(station, st, dur));
      }
    };

    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, []);

  // Sync volume & mute to audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
    audio.volume = session.volume;
  }, [session.volume, isMuted]);

  const loadStationInAudio = useCallback(
    (station: RadioStation, shouldPlay: boolean, withStatic: boolean) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (withStatic && sessionRef.current.fmStaticEnabled && !isMuted) {
        playFmTuningBurst(sessionRef.current.volume);
      }

      setAudioError(null);
      setActualDuration(undefined);
      wantPlayRef.current = shouldPlay;
      needsInitialSeekRef.current = true;
      loadedStationIdRef.current = station.id;

      const approxPos = getLivePositionSeconds(station, sessionRef.current);
      setLivePosition(approxPos);

      if (shouldPlay) {
        setIsBuffering(true);
      }

      audio.pause();
      audio.src = getAudioUrl(station);
      audio.load();
    },
    [isMuted]
  );

  const selectStation = useCallback(
    (stationId: string, autoPlay = true) => {
      const target = STATIONS.find((s) => s.id === stationId);
      if (!target) return;

      const isSame = stationId === currentStationRef.current.id;
      if (isSame) {
        // Toggle play/pause if clicking the active station
        if (autoPlay && !isPlaying) {
          const audio = audioRef.current;
          if (!audio) return;
          wantPlayRef.current = true;
          const dur =
            Number.isFinite(audio.duration) && audio.duration > 0
              ? audio.duration
              : target.durationSeconds;
          // Re-sync to live broadcast timestamp whenever tuning back in!
          const livePos = getLivePositionSeconds(target, sessionRef.current, dur);
          if (audio.readyState >= 1) {
            try {
              audio.currentTime = livePos;
              setLivePosition(livePos);
            } catch {
              needsInitialSeekRef.current = true;
            }
            setIsBuffering(true);
            audio
              .play()
              .then(() => {
                setIsPlaying(true);
                setIsBuffering(false);
              })
              .catch(() => {
                setIsBuffering(false);
              });
          } else {
            loadStationInAudio(target, true, false);
          }
        }
        return;
      }

      setSession((prev) => ({
        ...prev,
        currentStationId: target.id,
      }));
      loadStationInAudio(target, autoPlay, true);
    },
    [isPlaying, loadStationInAudio]
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    const station = currentStationRef.current;
    if (!audio) return;

    if (isPlaying || wantPlayRef.current) {
      wantPlayRef.current = false;
      audio.pause();
      setIsPlaying(false);
      setIsBuffering(false);
      return;
    }

    wantPlayRef.current = true;
    setAudioError(null);

    if (loadedStationIdRef.current !== station.id) {
      loadStationInAudio(station, true, false);
      return;
    }

    const dur =
      Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : station.durationSeconds;
    // Jump directly to current live broadcast time (simulating real live radio!)
    const livePos = getLivePositionSeconds(station, sessionRef.current, dur);

    if (audio.readyState >= 1) {
      try {
        audio.currentTime = livePos;
        setLivePosition(livePos);
        needsInitialSeekRef.current = false;
      } catch {
        needsInitialSeekRef.current = true;
      }
      setIsBuffering(true);
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch(() => {
          setIsBuffering(false);
        });
    } else {
      needsInitialSeekRef.current = true;
      setIsBuffering(true);
      audio.load();
    }
  }, [isPlaying, loadStationInAudio]);

  const nextStation = useCallback(() => {
    const idx = STATIONS.findIndex((s) => s.id === currentStationRef.current.id);
    const next = STATIONS[(idx + 1) % STATIONS.length];
    selectStation(next.id, true);
  }, [selectStation]);

  const prevStation = useCallback(() => {
    const idx = STATIONS.findIndex((s) => s.id === currentStationRef.current.id);
    const prev = STATIONS[(idx - 1 + STATIONS.length) % STATIONS.length];
    selectStation(prev.id, true);
  }, [selectStation]);

  const tuneRandomStation = useCallback(() => {
    const others = STATIONS.filter((s) => s.id !== currentStationRef.current.id);
    const pick = others[Math.floor(Math.random() * others.length)] ?? STATIONS[0];
    selectStation(pick.id, true);
  }, [selectStation]);

  const toggleFavorite = useCallback((stationId: string) => {
    setSession((prev) => {
      const exists = prev.favorites.includes(stationId);
      return {
        ...prev,
        favorites: exists
          ? prev.favorites.filter((id) => id !== stationId)
          : [...prev.favorites, stationId],
      };
    });
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.min(1, Math.max(0, vol));
    setIsMuted(clamped === 0);
    setSession((prev) => ({
      ...prev,
      volume: clamped,
    }));
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleFmStatic = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      fmStaticEnabled: !prev.fmStaticEnabled,
    }));
  }, []);

  const resetSessionRandomly = useCallback(() => {
    const fresh = createFreshSession({
      favorites: sessionRef.current.favorites,
      volume: sessionRef.current.volume,
      fmStaticEnabled: sessionRef.current.fmStaticEnabled,
    });
    sessionRef.current = fresh;
    setSession(fresh);
    setIsFirstVisit(true);
    setAwaySeconds(0);
    setShowAwayBanner(false);
    const newStation = STATIONS.find((s) => s.id === fresh.currentStationId) ?? STATIONS[0];
    loadStationInAudio(newStation, isPlaying, true);
  }, [isPlaying, loadStationInAudio]);

  const dismissAwayBanner = useCallback(() => {
    setShowAwayBanner(false);
  }, []);

  const currentTrackTitle = currentTrack?.track.title ?? '';
  const currentTrackArtist = currentTrack?.track.artist ?? '';
  const currentTrackDuration = currentTrack?.trackDuration ?? 0;
  const currentTrackElapsed = currentTrack?.trackElapsed ?? 0;

  // Keep browser tab title reflecting what is currently playing
  useEffect(() => {
    if (!isPlaying) {
      document.title = 'GTA VI Radio — The Sound of Leonida';
      return;
    }
    if (currentTrackTitle) {
      document.title = `${currentTrackTitle} · ${currentStation.name} — GTA VI Radio`;
    } else {
      document.title = `${currentStation.name} — GTA VI Radio`;
    }
  }, [isPlaying, currentStation.name, currentTrackTitle]);

  // Pre-generate opaque 512x512 PNG artwork for iOS Lock Screen, Apple CarPlay & Bluetooth
  const [lockscreenArtwork, setLockscreenArtwork] = useState<string>('');
  useEffect(() => {
    let cancelled = false;
    void getStationLockscreenArtwork(currentStation).then((pngUrl) => {
      if (!cancelled) setLockscreenArtwork(pngUrl);
    });
    return () => {
      cancelled = true;
    };
  }, [currentStation]);

  // Sync iPhone Lock Screen, Apple CarPlay & Bluetooth AVRCP MediaSession controls & metadata
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      const fallbackUrl = `${window.location.origin}${currentStation.cover}`;
      const artworkSrc = lockscreenArtwork || fallbackUrl;
      const artworkType = artworkSrc.startsWith('data:image/png') ? 'image/png' : 'image/webp';

      const title = currentTrackTitle || currentStation.name;
      const artist = currentTrackTitle
        ? currentTrackArtist
          ? `${currentTrackArtist} — ${currentStation.name}`
          : currentStation.name
        : `${currentStation.frequency} · En directo`;

      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist,
        album: `${currentStation.name} · ${currentStation.frequency}`,
        artwork: [
          {
            src: artworkSrc,
            sizes: '512x512',
            type: artworkType,
          },
        ],
      });

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      // Show LIVE badge instead of the 5-hour MP3 duration on iOS Lock Screen & CarPlay
      try {
        navigator.mediaSession.setPositionState({ duration: Infinity });
      } catch {
        if (currentTrackDuration > 0) {
          try {
            navigator.mediaSession.setPositionState({
              duration: currentTrackDuration,
              playbackRate: isPlaying ? 1 : 0,
              position: Math.min(currentTrackDuration, currentTrackElapsed),
            });
          } catch {
            // Ignore unsupported browsers
          }
        }
      }

      navigator.mediaSession.setActionHandler('play', () => {
        if (!isPlaying) togglePlay();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (isPlaying) togglePlay();
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        if (isPlaying) togglePlay();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => prevStation());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextStation());
      // Clear seek handlers so CarPlay / steering wheel buttons switch stations instead of scrubbing
      navigator.mediaSession.setActionHandler('seekto', null);
      navigator.mediaSession.setActionHandler('seekbackward', null);
      navigator.mediaSession.setActionHandler('seekforward', null);
    } catch {
      // Ignore unsupported MediaSession environments
    }
  }, [
    currentStation,
    currentTrackTitle,
    currentTrackArtist,
    currentTrackDuration,
    isPlaying,
    lockscreenArtwork,
    togglePlay,
    prevStation,
    nextStation,
  ]);

  return {
    session,
    currentStation,
    currentTrack,
    isFirstVisit,
    awaySeconds,
    isPlaying,
    isBuffering,
    audioError,
    livePosition,
    effectiveDuration,
    isMuted,
    selectStation,
    togglePlay,
    nextStation,
    prevStation,
    tuneRandomStation,
    toggleFavorite,
    setVolume,
    toggleMute,
    toggleFmStatic,
    resetSessionRandomly,
    dismissAwayBanner,
    showAwayBanner,
  };
}
