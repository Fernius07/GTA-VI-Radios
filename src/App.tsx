import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Disc3,
  Heart,
  LayoutGrid,
  Menu,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import {
  GENRE_CATEGORIES,
  STATIONS,
  type GenreCategory,
} from './data/stations';
import { localizeStation } from './data/stationsEn';
import {
  GENRE_LABELS,
  loadInitialLanguage,
  saveLanguage,
  UI_TEXT,
  type Language,
} from './lib/i18n';
import { useRadioPlayer } from './hooks/useRadioPlayer';
import { Sidebar, type SidebarTab } from './components/Sidebar';
import { HeroBanner } from './components/HeroBanner';
import { StationCard } from './components/StationCard';
import { DialView } from './components/DialView';
import { PlayerBar } from './components/PlayerBar';
import { MobileNav } from './components/MobileNav';

export default function App() {
  const [lang, setLang] = useState<Language>(() => loadInitialLanguage());
  const player = useRadioPlayer(lang);
  const [activeTab, setActiveTab] = useState<SidebarTab>('home');
  const [selectedGenre, setSelectedGenre] = useState<GenreCategory>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const t = UI_TEXT[lang];

  useEffect(() => {
    saveLanguage(lang);
  }, [lang]);

  const currentStation = useMemo(
    () => localizeStation(player.currentStation, lang),
    [player.currentStation, lang]
  );

  // Global keyboard shortcuts (Space, Left/Right arrows, M, R)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        player.togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        player.nextStation();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        player.prevStation();
      } else if (e.key.toLowerCase() === 'm') {
        player.toggleMute();
      } else if (e.key.toLowerCase() === 'r') {
        player.tuneRandomStation();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [player]);

  const filteredStations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return STATIONS.map((base) => ({
      base,
      localized: localizeStation(base, lang),
    }))
      .filter(({ base, localized }) => {
        if (activeTab === 'favorites' && !player.session.favorites.includes(base.id)) {
          return false;
        }
        if (selectedGenre !== 'Todas' && base.category !== selectedGenre) {
          return false;
        }
        if (!q) return true;
        const genreDisplay = GENRE_LABELS[lang][base.category].toLowerCase();
        return (
          localized.name.toLowerCase().includes(q) ||
          localized.description.toLowerCase().includes(q) ||
          localized.tagline.toLowerCase().includes(q) ||
          (localized.hosts?.toLowerCase().includes(q) ?? false) ||
          genreDisplay.includes(q) ||
          base.category.toLowerCase().includes(q) ||
          base.frequency.toLowerCase().includes(q) ||
          localized.styles.some((s) => s.toLowerCase().includes(q)) ||
          base.styles.some((s) => s.toLowerCase().includes(q))
        );
      })
      .map(({ localized }) => localized);
  }, [activeTab, selectedGenre, searchQuery, player.session.favorites, lang]);

  const handleCardSelect = (stationId: string) => {
    if (stationId === player.currentStation.id) {
      player.togglePlay();
    } else {
      player.selectStation(stationId, true);
    }
  };

  const handleTabChange = (tab: SidebarTab) => {
    setActiveTab(tab);
    if (tab === 'home') setSelectedGenre('Todas');
  };

  const languageSwitcher = (
    <div
      className="inline-flex rounded-full bg-white/[0.06] p-0.5 ring-1 ring-white/[0.08]"
      role="group"
      aria-label={t.header.languageSwitch}
    >
      <button
        onClick={() => setLang('es')}
        className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide transition touch-manipulation ${
          lang === 'es'
            ? 'bg-white text-black shadow-xs'
            : 'text-zinc-300 hover:text-white'
        }`}
        aria-pressed={lang === 'es'}
      >
        ES
      </button>
      <button
        onClick={() => setLang('en')}
        className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide transition touch-manipulation ${
          lang === 'en'
            ? 'bg-white text-black shadow-xs'
            : 'text-zinc-300 hover:text-white'
        }`}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#09090b] text-white">
      {/* Upper Shell: Sidebar + Main Scrollable View */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          lang={lang}
          onChangeTab={handleTabChange}
          currentStation={currentStation}
          isPlaying={player.isPlaying}
          favorites={player.session.favorites}
          onSelectStation={(id) => player.selectStation(id, true)}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Surface (Edge-to-edge on mobile, rounded Spotify panel on md+) */}
        <main className="flex min-w-0 flex-1 flex-col p-0 md:p-2 lg:pl-0">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none md:rounded-xl bg-[#121216] md:ring-1 md:ring-white/[0.06]">
            {/* Sticky Top Bar */}
            <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#121216]/90 px-3 py-2.5 backdrop-blur-xl sm:px-6 md:py-3">
              {/* Compact Mobile Header (< md) */}
              <div className="flex items-center justify-between gap-2 md:hidden">
                <div className="flex items-center gap-2">
                  <img
                    src="/gta6-logo.webp"
                    alt="GTA VI"
                    className="h-8 w-auto object-contain shrink-0 drop-shadow-[0_2px_6px_rgba(255,77,148,0.25)]"
                    draggable={false}
                  />
                  <span className="font-display text-base font-bold tracking-wider leading-none text-[#ff6ba8]">
                    RADIO
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {languageSwitcher}

                  <button
                    onClick={() => {
                      setMobileSearchOpen((prev) => {
                        if (prev) setSearchQuery('');
                        return !prev;
                      });
                    }}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition touch-manipulation ${
                      mobileSearchOpen || searchQuery
                        ? 'bg-white text-black'
                        : 'bg-white/[0.07] text-zinc-200 active:bg-white/15'
                    }`}
                    aria-label={mobileSearchOpen ? t.header.searchClose : t.header.searchOpen}
                  >
                    {mobileSearchOpen ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={player.resetSessionRandomly}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.07] text-zinc-200 transition active:bg-white/15 touch-manipulation"
                    title={t.header.newSessionTitle}
                    aria-label={t.header.newSessionAria}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Expandable Mobile Search Input */}
              {mobileSearchOpen && (
                <div className="relative mt-2.5 md:hidden">
                  <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activeTab === 'dial') setActiveTab('home');
                    }}
                    placeholder={t.header.searchPlaceholder}
                    className="w-full rounded-full bg-white/[0.09] py-2 pr-9 pl-10 text-sm text-white placeholder-zinc-400 outline-none ring-1 ring-white/15 focus:ring-white/30"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-white"
                      aria-label={t.header.clearSearch}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Desktop / Tablet Header (>= md) */}
              <div className="hidden md:flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-1 items-center gap-3 min-w-[200px]">
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="rounded-lg p-2 text-zinc-300 hover:bg-white/10 hover:text-white lg:hidden"
                    aria-label={t.nav.openStations}
                  >
                    <Menu className="h-5 w-5" />
                  </button>

                  {/* Search Input */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (activeTab === 'dial') setActiveTab('home');
                      }}
                      placeholder={t.header.searchPlaceholder}
                      className="w-full rounded-full bg-white/[0.07] py-2 pr-9 pl-10 text-sm text-white placeholder-zinc-400 outline-none ring-1 ring-transparent transition focus:bg-white/[0.11] focus:ring-white/20"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-white"
                        aria-label={t.header.clearSearch}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Header Actions */}
                <div className="flex items-center gap-2">
                  {/* ES / EN Language Toggle right beside Explorar */}
                  {languageSwitcher}

                  {/* Quick View Switcher (Spotify Grid vs GTA Dial) */}
                  <div className="inline-flex rounded-full bg-white/[0.06] p-1 ring-1 ring-white/[0.06]">
                    <button
                      onClick={() => setActiveTab('home')}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                        activeTab !== 'dial'
                          ? 'bg-white text-black'
                          : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                      <span>{t.nav.explore}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('dial')}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                        activeTab === 'dial'
                          ? 'bg-white text-black'
                          : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      <Disc3 className="h-3.5 w-3.5" />
                      <span>{t.nav.dialShort}</span>
                    </button>
                  </div>

                  {/* Reset Session Button */}
                  <button
                    onClick={player.resetSessionRandomly}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-zinc-300 ring-1 ring-white/[0.08] transition hover:bg-white/[0.12] hover:text-white"
                    title={t.header.newSessionTitle}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>{t.header.newSession}</span>
                  </button>
                </div>
              </div>
            </header>

            {/* Scrollable Inner Canvas */}
            <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-6">
              {/* Audio Load Error Banner (if any) */}
              {player.audioError && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <span>{player.audioError}</span>
                </div>
              )}

              {activeTab === 'dial' ? (
                <DialView
                  currentStation={currentStation}
                  currentTrack={player.currentTrack}
                  isPlaying={player.isPlaying}
                  lang={lang}
                  onSelectStation={(id) => player.selectStation(id, true)}
                  onTogglePlay={player.togglePlay}
                  onPrev={player.prevStation}
                  onNext={player.nextStation}
                />
              ) : (
                <>
                  {/* Spotify-style Active Station Hero */}
                  {activeTab === 'home' && !searchQuery && (
                    <HeroBanner
                      station={currentStation}
                      currentTrack={player.currentTrack}
                      isPlaying={player.isPlaying}
                      isBuffering={player.isBuffering}
                      isFavorite={player.session.favorites.includes(
                        currentStation.id
                      )}
                      isFirstVisit={player.isFirstVisit}
                      lang={lang}
                      onTogglePlay={player.togglePlay}
                      onToggleFavorite={() =>
                        player.toggleFavorite(currentStation.id)
                      }
                      onRandomStation={player.tuneRandomStation}
                    />
                  )}

                  {/* Genre Filter Pills */}
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                        {activeTab === 'favorites'
                          ? t.grid.favoritesTitle
                          : searchQuery
                            ? t.grid.resultsFor(searchQuery)
                            : t.grid.stationsHeading}
                      </h2>
                      <span className="text-xs font-medium text-zinc-400">
                        {filteredStations.length}{' '}
                        {filteredStations.length === 1
                          ? t.grid.stationSingular
                          : t.grid.stationPlural}
                      </span>
                    </div>

                    <div className="flex flex-nowrap items-center gap-2 overflow-x-auto no-scrollbar -mx-3 px-3 md:mx-0 md:px-0 md:flex-wrap">
                      {GENRE_CATEGORIES.map((genre) => {
                        const active = selectedGenre === genre;
                        return (
                          <button
                            key={genre}
                            onClick={() => setSelectedGenre(genre)}
                            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition touch-manipulation ${
                              active
                                ? 'bg-white text-black'
                                : 'bg-white/[0.07] text-zinc-300 hover:bg-white/[0.13] hover:text-white'
                            }`}
                          >
                            {GENRE_LABELS[lang][genre]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stations Grid */}
                  {filteredStations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-16 text-center">
                      <Heart className="h-10 w-10 text-zinc-600 mb-3" />
                      <p className="text-base font-bold text-zinc-200">
                        {activeTab === 'favorites'
                          ? t.grid.noFavoritesTitle
                          : t.grid.noResultsTitle}
                      </p>
                      <p className="mt-1 text-sm text-zinc-400">
                        {activeTab === 'favorites'
                          ? t.grid.noFavoritesHint
                          : t.grid.noResultsHint}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {filteredStations.map((station) => (
                        <StationCard
                          key={station.id}
                          station={station}
                          isActive={station.id === currentStation.id}
                          isPlaying={
                            station.id === currentStation.id && player.isPlaying
                          }
                          isFavorite={player.session.favorites.includes(station.id)}
                          lang={lang}
                          onSelect={() => handleCardSelect(station.id)}
                          onToggleFavorite={() => player.toggleFavorite(station.id)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Persistent Spotify-style Bottom Player */}
      <PlayerBar
        station={currentStation}
        currentTrack={player.currentTrack}
        isPlaying={player.isPlaying}
        isBuffering={player.isBuffering}
        isFavorite={player.session.favorites.includes(currentStation.id)}
        volume={player.session.volume}
        isMuted={player.isMuted}
        fmStaticEnabled={player.session.fmStaticEnabled}
        lang={lang}
        onTogglePlay={player.togglePlay}
        onPrev={player.prevStation}
        onNext={player.nextStation}
        onRandom={player.tuneRandomStation}
        onToggleFavorite={() => player.toggleFavorite(currentStation.id)}
        onChangeVolume={player.setVolume}
        onToggleMute={player.toggleMute}
        onToggleFmStatic={player.toggleFmStatic}
      />

      {/* Native Spotify-Mobile Bottom Navigation (< md) */}
      <MobileNav
        activeTab={activeTab}
        favoritesCount={player.session.favorites.length}
        lang={lang}
        onChangeTab={handleTabChange}
      />
    </div>
  );
}
