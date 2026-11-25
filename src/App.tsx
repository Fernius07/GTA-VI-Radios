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
import { useRadioPlayer } from './hooks/useRadioPlayer';
import { Sidebar, type SidebarTab } from './components/Sidebar';
import { HeroBanner } from './components/HeroBanner';
import { StationCard } from './components/StationCard';
import { DialView } from './components/DialView';
import { PlayerBar } from './components/PlayerBar';

export default function App() {
  const player = useRadioPlayer();
  const [activeTab, setActiveTab] = useState<SidebarTab>('home');
  const [selectedGenre, setSelectedGenre] = useState<GenreCategory>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    return STATIONS.filter((station) => {
      if (activeTab === 'favorites' && !player.session.favorites.includes(station.id)) {
        return false;
      }
      if (selectedGenre !== 'Todas' && station.category !== selectedGenre) {
        return false;
      }
      if (!q) return true;
      return (
        station.name.toLowerCase().includes(q) ||
        station.description.toLowerCase().includes(q) ||
        station.tagline.toLowerCase().includes(q) ||
        station.category.toLowerCase().includes(q) ||
        station.frequency.toLowerCase().includes(q) ||
        station.styles.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [activeTab, selectedGenre, searchQuery, player.session.favorites]);

  const handleCardSelect = (stationId: string) => {
    if (stationId === player.currentStation.id) {
      player.togglePlay();
    } else {
      player.selectStation(stationId, true);
    }
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#09090b] text-white">
      {/* Upper Shell: Sidebar + Main Scrollable View */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'home') setSelectedGenre('Todas');
          }}
          currentStation={player.currentStation}
          isPlaying={player.isPlaying}
          favorites={player.session.favorites}
          onSelectStation={(id) => player.selectStation(id, true)}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Surface (Spotify-style rounded panel) */}
        <main className="flex min-w-0 flex-1 flex-col p-2 lg:pl-0">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-[#121216] ring-1 ring-white/[0.06]">
            {/* Sticky Top Bar */}
            <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] bg-[#121216]/90 px-4 py-3 backdrop-blur-xl sm:px-6">
              <div className="flex flex-1 items-center gap-3 min-w-[200px]">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="rounded-lg p-2 text-zinc-300 hover:bg-white/10 hover:text-white lg:hidden"
                  aria-label="Abrir emisoras"
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
                    placeholder="Buscar emisora, género, estilo..."
                    className="w-full rounded-full bg-white/[0.07] py-2 pr-9 pl-10 text-sm text-white placeholder-zinc-400 outline-none ring-1 ring-transparent transition focus:bg-white/[0.11] focus:ring-white/20"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-white"
                      aria-label="Limpiar búsqueda"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Header Actions */}
              <div className="flex items-center gap-2">
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
                    <span className="hidden sm:inline">Explorar</span>
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
                    <span className="hidden sm:inline">Dial GTA</span>
                  </button>
                </div>

                {/* Reset Session Button (useful to test new random listener) */}
                <button
                  onClick={player.resetSessionRandomly}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-zinc-300 ring-1 ring-white/[0.08] transition hover:bg-white/[0.12] hover:text-white"
                  title="Reiniciar sesión con nueva emisora y horarios aleatorios"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Nueva sesión</span>
                </button>
              </div>
            </header>

            {/* Scrollable Inner Canvas */}
            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 space-y-6">
              {/* Audio Load Error Banner (if any) */}
              {player.audioError && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <span>{player.audioError}</span>
                </div>
              )}

              {activeTab === 'dial' ? (
                <DialView
                  currentStation={player.currentStation}
                  isPlaying={player.isPlaying}
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
                      station={player.currentStation}
                      isPlaying={player.isPlaying}
                      isBuffering={player.isBuffering}
                      isFavorite={player.session.favorites.includes(
                        player.currentStation.id
                      )}
                      showAwayBanner={player.showAwayBanner}
                      awaySeconds={player.awaySeconds}
                      isFirstVisit={player.isFirstVisit}
                      onTogglePlay={player.togglePlay}
                      onToggleFavorite={() =>
                        player.toggleFavorite(player.currentStation.id)
                      }
                      onRandomStation={player.tuneRandomStation}
                      onDismissAwayBanner={player.dismissAwayBanner}
                    />
                  )}

                  {/* Genre Filter Pills */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-xl font-extrabold tracking-tight text-white">
                        {activeTab === 'favorites'
                          ? 'Tus emisoras favoritas'
                          : searchQuery
                            ? `Resultados para "${searchQuery}"`
                            : 'Emisoras de Vice City y Leonida'}
                      </h2>
                      <span className="text-xs font-medium text-zinc-400">
                        {filteredStations.length}{' '}
                        {filteredStations.length === 1 ? 'emisora' : 'emisoras'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {GENRE_CATEGORIES.map((genre) => {
                        const active = selectedGenre === genre;
                        return (
                          <button
                            key={genre}
                            onClick={() => setSelectedGenre(genre)}
                            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                              active
                                ? 'bg-white text-black'
                                : 'bg-white/[0.07] text-zinc-300 hover:bg-white/[0.13] hover:text-white'
                            }`}
                          >
                            {genre}
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
                          ? 'Todavía no tienes emisoras favoritas'
                          : 'No se encontraron emisoras con ese filtro'}
                      </p>
                      <p className="mt-1 text-sm text-zinc-400">
                        {activeTab === 'favorites'
                          ? 'Pulsa el corazón en cualquier radio para guardarla aquí.'
                          : 'Prueba con otro género o limpia la búsqueda.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {filteredStations.map((station) => (
                        <StationCard
                          key={station.id}
                          station={station}
                          isActive={station.id === player.currentStation.id}
                          isPlaying={
                            station.id === player.currentStation.id && player.isPlaying
                          }
                          isFavorite={player.session.favorites.includes(station.id)}
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
        station={player.currentStation}
        isPlaying={player.isPlaying}
        isBuffering={player.isBuffering}
        isFavorite={player.session.favorites.includes(player.currentStation.id)}
        volume={player.session.volume}
        isMuted={player.isMuted}
        fmStaticEnabled={player.session.fmStaticEnabled}
        onTogglePlay={player.togglePlay}
        onPrev={player.prevStation}
        onNext={player.nextStation}
        onRandom={player.tuneRandomStation}
        onToggleFavorite={() => player.toggleFavorite(player.currentStation.id)}
        onChangeVolume={player.setVolume}
        onToggleMute={player.toggleMute}
        onToggleFmStatic={player.toggleFmStatic}
      />
    </div>
  );
}
