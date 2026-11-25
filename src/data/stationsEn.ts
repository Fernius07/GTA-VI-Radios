import type { RadioStation } from './stations';
import type { Language } from '../lib/i18n';

interface StationTranslation {
  tagline: string;
  description: string;
  hosts?: string;
  styles: string[];
}

export const STATIONS_EN: Record<string, StationTranslation> = {
  'flash-fm': {
    tagline: 'The pop institution of Vice City',
    description:
      'The legendary Vice City station delivering the best in pop, synthpop, and dance-pop — guaranteed to make you dance anywhere in the State of Leonida.',
    hosts: 'Robyn and Alex Consani',
    styles: ['Pop', 'Dance Pop', 'Synthpop', 'Hits'],
  },
  'vice-city-fm': {
    tagline: '1980s pop classics across Leonida',
    description:
      'Over six hours dedicated to the finest 1980s pop, synth anthems, and timeless hits beneath the palms and neon lights of Vice City.',
    hosts: 'DJ Al ("Weird Al" Yankovic) and Madame Brigitte (Brigitte Nielsen)',
    styles: ['80s Pop', 'Synthpop', '80s Classics'],
  },
  'emotion-98-3': {
    tagline: 'Soft rock and epic power ballads',
    description:
      'The most heartfelt station on the dial returns with soaring power ballads and emotional soft rock for late-night drives across Leonida.',
    hosts: 'Doug Van Dyke (Doug Stanhope)',
    styles: ['Soft Rock', 'Power Ballads', 'Classics'],
  },
  'kaleidoscope-fm': {
    tagline: 'International music, oddities, and rare covers',
    description:
      'An eclectic station featuring international music, unusual cover versions, and lesser-known recordings curated for curious ears.',
    hosts: 'Jeremy Irons',
    styles: ['Eclectic', 'International', 'Rarities', 'Covers'],
  },
  'v-rock': {
    tagline: 'Vice City’s legendary rock station',
    description:
      'Vice City’s iconic vulture returns with a broad selection of classic rock and high-voltage hard rock built for tearing down the highway.',
    hosts: 'The Buck (Lindsey Buckingham) and Skipper McD (Michael McDonald)',
    styles: ['Classic Rock', 'Hard Rock', 'Guitar Anthems'],
  },
  'the-chamber-106-6': {
    tagline: 'Crushing metal from the 1980s and beyond',
    description:
      'Crushing metal has landed in Leonida. Jump in the pit for classic heavy and thrash metal from the 1980s onward.',
    hosts: 'DJ Kerry (Kerry King) and DJ Tom (Tom Araya)',
    styles: ['Heavy Metal', 'Thrash Metal', '80s+ Metal'],
  },
  vcrr: {
    tagline: 'Contemporary rap and chart hits',
    description:
      'A contemporary rap station featuring chart hits and the latest hip-hop releases spinning across Leonida, including Only Raw Records drops.',
    hosts: 'JT and DJ Stevie J',
    styles: ['Contemporary Rap', 'Modern Hip-Hop', 'Chart Hits'],
  },
  'dirty-south-classics': {
    tagline: 'Southern hospitality and regional rap classics',
    description:
      'Legendary southern rap and regional hip-hop classics representing Leonida and the South from the beach to the block.',
    hosts: 'Trick Daddy and Trina',
    styles: ['Dirty South', 'Southern Hip-Hop', 'Classic Rap'],
  },
  'circoloco-records-radio': {
    tagline: 'Underground electronic, house, and club sessions',
    description:
      'The official station of CircoLoco Records, the label co-founded by Rockstar Games and the iconic CircoLoco brand, spinning house and club sets.',
    hosts: 'Seth Troxler and Antonio Carbonaro',
    styles: ['House', 'Tech House', 'EDM', 'Club'],
  },
  'stockyard-fm': {
    tagline: 'Indie, alternative dance, house, and electronic',
    description:
      'Indie, alternative dance, house, and cutting-edge electronic cuts curated with help from James Curd for nights in Leonida.',
    hosts: 'Victoria (PinkPantheress) and Harrison (The Dare)',
    styles: ['Indie', 'Alternative Dance', 'House', 'Electronic'],
  },
  'the-vault-radio': {
    tagline: 'The secret station inside The Vault Nightclub',
    description:
      'A secret unlockable station from The Vault Nightclub in Vice City, packed with dance, electronic music, and rave mixes.',
    hosts: 'DJ Pretzel',
    styles: ['Dance', 'Electronic', 'Rave', 'Secret'],
  },
  'cocoteo-fm': {
    tagline: 'El party que nunca se apaga in Leonida',
    description:
      'Leonida’s home for modern Latin music, featuring everything from bachata and merengue to dembow and non-stop reggaeton.',
    hosts: 'Bad Bunny (El Martillo) and RaiNao (La Gata)',
    styles: ['Reggaeton', 'Dembow', 'Bachata', 'Merengue'],
  },
  'radio-la-ola': {
    tagline: 'Classic Latin, salsa, and Caribbean rhythm',
    description:
      'A station focused on classic Latin and Caribbean music, bringing together salsa, Cuban music, and timeless merengue.',
    hosts: 'Gloria Estefan and Emilio Estefan',
    styles: ['Salsa', 'Cuban Music', 'Merengue', 'Classic Latin'],
  },
  'afrobank-fm': {
    tagline: 'The best in African music, past and present',
    description:
      'Turn up the gbedu with the finest African music, from 20th-century classics and undiscovered gems to contemporary amapiano and 3-step.',
    hosts: 'Burna Boy and Palms Trax',
    styles: ['Afrobeats', 'Amapiano', '3-Step', 'African Classics'],
  },
  'radio-on-u': {
    tagline: 'Dub, reggae, and On-U Sound culture',
    description:
      'Named after Adrian Sherwood’s legendary On-U Sound label, spinning deep dub, roots reggae, and boundary-pushing sound system cuts.',
    hosts: 'Adrian Sherwood',
    styles: ['Dub', 'Reggae', 'On-U Sound'],
  },
  'the-sniper-of-la-perle': {
    tagline: 'Unlockable Haitian and Caribbean music',
    description:
      'An additional unlockable music station credited by Rockstar Games, showcasing Haitian and Caribbean sounds.',
    hosts: 'Kodak Black · Presented by Michaël Brun',
    styles: ['Haitian Music', 'Caribbean', 'Kompa', 'Unlockable'],
  },
  'honey-fm': {
    tagline: '1990s R&B, soul, and the Liquid City segment',
    description:
      'Classic 1990s R&B, timeless soul, and smooth jams, including the special Liquid City segment performed by Liquid Wilson (Craig Robinson).',
    hosts: 'Chilli and T-Boz',
    styles: ['90s R&B', 'Soul', 'Slow Jams'],
  },
  'leonida-jazz-radio': {
    tagline: 'Jazz, jazz fusion, and legendary instrumentalists',
    description:
      'A jazz station featuring smooth jazz fusion and recordings by prominent instrumentalists for warm nights in Leonida.',
    hosts: 'DJ Randy (Randy Brecker)',
    styles: ['Jazz', 'Jazz Fusion', 'Instrumental'],
  },
  'gloriana-blues-radio': {
    tagline: 'Historic and modern southern blues',
    description:
      'A blues station spinning historic and contemporary blues recordings drenched in grit, soul, and electric guitar.',
    hosts: 'Keith Richards and Buddy Guy',
    styles: ['Classic Blues', 'Modern Blues', 'Rhythm & Blues'],
  },
  'worldwide-fm': {
    tagline: 'Jazz, soul, and music from around the world',
    description:
      'Leonida’s branch of Worldwide FM blends jazz, soul, and global sounds curated by Gilles Peterson.',
    hosts: 'Gilles Peterson',
    styles: ['Jazz', 'Soul', 'Global Beats', 'Eclectic'],
  },
  'back-country-radio': {
    tagline: 'Renegade country for Grassrivers and Port Gellhorn',
    description:
      'Renegade country blasting across Grassrivers, Port Gellhorn, and beyond, with airboat weather check-ins from Mud Dog Mike.',
    hosts: 'Morgan Wallen (MW) and Lana Del Rey (Delta Dawne)',
    styles: ['Renegade Country', 'Outlaw Country', 'Americana'],
  },
  'thrillbilly-mud-club-radio': {
    tagline: 'Mud, V8 engines, and Leonida southern rock',
    description:
      'The soundtrack of the Thrillbilly Mud Club: rowdy southern rock, outlaw country, and off-road mud-bogging anthems.',
    styles: ['Southern Rock', 'Outlaw Country', 'Swamp Rock'],
  },
  'symphony-fm': {
    tagline: 'Orchestral works and timeless classical music',
    description:
      'A classical music station featuring iconic orchestral works and compositions spanning multiple historical eras.',
    hosts: 'Yuja Wang',
    styles: ['Classical', 'Orchestral', 'Symphonic'],
  },
  'the-wipe': {
    tagline: 'Satire and the wildest characters of Leonida',
    description:
      'A talk radio station focused on biting satire and the strangest events and characters across Leonida.',
    styles: ['Talk Radio', 'Satire', 'Leonida'],
  },
  wktt: {
    tagline: 'Conservative talk, live callers, and satire',
    description:
      'WKTT (We Know The Truth) returns with over-the-top political and social satire, heated debates, and live call-in segments.',
    styles: ['Talk Radio', 'Political Satire', 'Debate'],
  },
};

export function localizeStation(station: RadioStation, lang: Language): RadioStation {
  if (lang === 'es') return station;
  const en = STATIONS_EN[station.id];
  if (!en) return station;
  return {
    ...station,
    tagline: en.tagline,
    description: en.description,
    hosts: en.hosts ?? station.hosts,
    styles: en.styles,
  };
}
