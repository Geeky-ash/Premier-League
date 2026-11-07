/**
 * Centralized Official Premier League Logos, Club Crests, and Player Photos CDN Helper.
 * Resources sourced directly from official Premier League CDN (resources.premierleague.com).
 */

export const PL_LEAGUE_LOGO =
  "https://images.fotmob.com/image_resources/logo/leaguelogo/47.png";

export const PL_LEAGUE_LION_PURPLE =
  "https://resources.premierleague.com/premierleague/badges/50/t1.png"; // Fallback high-res badge

// Official Premier League Club Crest Mapping (CDN ID format: t{id})
export const CLUB_CREST_MAP: Record<string, string> = {
  // Arsenal
  Arsenal: "t3",
  "Arsenal FC": "t3",

  // Aston Villa
  "Aston Villa": "t7",
  "Aston Villa FC": "t7",

  // Bournemouth
  Bournemouth: "t91",
  "AFC Bournemouth": "t91",

  // Brentford
  Brentford: "t94",
  "Brentford FC": "t94",

  // Brighton
  Brighton: "t36",
  "Brighton & Hove Albion": "t36",
  "Brighton and Hove Albion": "t36",

  // Chelsea
  Chelsea: "t8",
  "Chelsea FC": "t8",

  // Crystal Palace
  "Crystal Palace": "t31",
  "Crystal Palace FC": "t31",

  // Everton
  Everton: "t11",
  "Everton FC": "t11",

  // Fulham
  Fulham: "t54",
  "Fulham FC": "t54",

  // Ipswich Town
  Ipswich: "t40",
  "Ipswich Town": "t40",
  "Ipswich Town FC": "t40",

  // Leicester City
  Leicester: "t13",
  "Leicester City": "t13",
  "Leicester City FC": "t13",

  // Liverpool
  Liverpool: "t14",
  "Liverpool FC": "t14",

  // Manchester City
  "Man City": "t43",
  "Manchester City": "t43",
  "Manchester City FC": "t43",

  // Manchester United
  "Man United": "t1",
  "Man Utd": "t1",
  "Manchester United": "t1",
  "Manchester United FC": "t1",

  // Newcastle United
  Newcastle: "t4",
  "Newcastle United": "t4",
  "Newcastle United FC": "t4",

  // Nottingham Forest
  "Nott'm Forest": "t17",
  "Nottingham Forest": "t17",
  Forest: "t17",

  // Southampton
  Southampton: "t20",
  "Southampton FC": "t20",

  // Tottenham Hotspur
  Spurs: "t6",
  Tottenham: "t6",
  "Tottenham Hotspur": "t6",

  // West Ham United
  "West Ham": "t21",
  "West Ham United": "t21",

  // Wolverhampton Wanderers
  Wolves: "t39",
  "Wolverhampton Wanderers": "t39",
};

export const LEAGUE_LOGOS: Record<string, string> = {
  "premier-league": "https://images.fotmob.com/image_resources/logo/leaguelogo/47.png",
  "championship": "https://images.fotmob.com/image_resources/logo/leaguelogo/48.png",
  "la-liga": "https://images.fotmob.com/image_resources/logo/leaguelogo/87.png",
  "bundesliga": "https://images.fotmob.com/image_resources/logo/leaguelogo/54.png",
  "serie-a": "https://images.fotmob.com/image_resources/logo/leaguelogo/55.png",
  "ligue-1": "https://images.fotmob.com/image_resources/logo/leaguelogo/53.png",
  "champions-league": "https://images.fotmob.com/image_resources/logo/leaguelogo/42.png",
  "mls": "https://images.fotmob.com/image_resources/logo/leaguelogo/130.png",
  "saudi-pro-league": "https://images.fotmob.com/image_resources/logo/leaguelogo/9906.png",
  "eredivisie": "https://images.fotmob.com/image_resources/logo/leaguelogo/57.png",
};

export const LEAGUE_FALLBACK_LOGOS: Record<string, string> = {
  "premier-league": "https://images.fotmob.com/image_resources/logo/leaguelogo/47.png",
  "championship": "https://images.fotmob.com/image_resources/logo/leaguelogo/48.png",
  "la-liga": "https://images.fotmob.com/image_resources/logo/leaguelogo/87.png",
  "bundesliga": "https://images.fotmob.com/image_resources/logo/leaguelogo/54.png",
  "serie-a": "https://images.fotmob.com/image_resources/logo/leaguelogo/55.png",
  "ligue-1": "https://images.fotmob.com/image_resources/logo/leaguelogo/53.png",
  "champions-league": "https://images.fotmob.com/image_resources/logo/leaguelogo/42.png",
  "mls": "https://images.fotmob.com/image_resources/logo/leaguelogo/130.png",
  "saudi-pro-league": "https://images.fotmob.com/image_resources/logo/leaguelogo/9906.png",
  "eredivisie": "https://images.fotmob.com/image_resources/logo/leaguelogo/57.png",
};

export const LEAGUE_LOGO_MAP = LEAGUE_LOGOS;

export function getLeagueLogo(slug?: string): string {
  if (!slug) return LEAGUE_LOGOS["premier-league"];
  const key = slug.toLowerCase().replace(/_/g, "-");
  return LEAGUE_LOGOS[key] || LEAGUE_LOGOS["premier-league"];
}

export function getLeagueFallbackLogo(slug?: string): string {
  if (!slug) return LEAGUE_FALLBACK_LOGOS["premier-league"];
  const key = slug.toLowerCase().replace(/_/g, "-");
  return LEAGUE_FALLBACK_LOGOS[key] || LEAGUE_FALLBACK_LOGOS["premier-league"];
}

export function getClubCrest(teamName: string, size: 50 | 70 | 100 = 70): string {
  if (!teamName) return PL_LEAGUE_LOGO;
  
  // Normalize lookup
  const cleanName = teamName.trim();
  const id = CLUB_CREST_MAP[cleanName];
  if (id) {
    return `https://resources.premierleague.com/premierleague/badges/${size}/${id}.png`;
  }

  // Substring fuzzy match
  const lower = cleanName.toLowerCase();
  for (const [key, code] of Object.entries(CLUB_CREST_MAP)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return `https://resources.premierleague.com/premierleague/badges/${size}/${code}.png`;
    }
  }

  return PL_LEAGUE_LOGO;
}

/**
 * Known mapping of player names to official Premier League photo IDs.
 */
export const PLAYER_PHOTO_MAP: Record<string, string> = {
  "Erling Haaland": "p223094",
  "Bukayo Saka": "p223340",
  "Cole Palmer": "p244851",
  "Mohamed Salah": "p118748",
  "Bruno Fernandes": "p141746",
  "Declan Rice": "p204480",
  "Alexander Isak": "p219168",
  "Ollie Watkins": "p178301",
  "Martin Ødegaard": "p184029",
  "Martin Odegaard": "p184029",
  "Phil Foden": "p209244",
  "Son Heung-min": "p85971",
  "Kevin De Bruyne": "p61366",
  "Virgil van Dijk": "p97032",
  "William Saliba": "p243568",
  "Gabriel Magalhães": "p225244",
  "David Raya": "p154561",
  "Alisson Becker": "p116535",
  "Ederson": "p121160",
  "Anthony Gordon": "p232826",
  "Eberechi Eze": "p232413",
  "Antoine Semenyo": "p243594",
  "Bryan Mbeumo": "p244723",
  "Matheus Cunha": "p244855",
  "Kobbie Mainoo": "p493105",
  "Trent Alexander-Arnold": "p169187",
  "Rodri": "p220566",
  "Kai Havertz": "p219847",
  "Gabriel Jesus": "p205651",
  "Marcus Rashford": "p176297",
  "Lamine Yamal": "lamine-yamal",
  "Lamine Sidibe": "lamine-sidibe",
  "Mouhamed Lamine Ndiaye": "lamine-ndiaye",
  "Kylian Mbappé": "mbappe",
  "Vinicius Junior": "vinicius-jr",
  "Jude Bellingham": "bellingham",
  "Robert Lewandowski": "lewandowski",
  "Harry Kane": "kane",
  "Jamal Musiala": "musiala",
  "Florian Wirtz": "wirtz",
  "Lautaro Martínez": "lautaro",
  "Victor Osimhen": "osimhen",
};

export const GLOBAL_LEAGUES = [
  {
    slug: "premier-league",
    name: "Premier League",
    country: "England",
    countryTag: "ENGLAND",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    season: "2026/2027",
    crest: LEAGUE_LOGO_MAP["premier-league"],
  },
  {
    slug: "championship",
    name: "Championship",
    country: "England",
    countryTag: "ENGLAND",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    season: "2026/2027",
    crest: LEAGUE_LOGO_MAP["championship"],
  },
  {
    slug: "la-liga",
    name: "La Liga",
    country: "Spain",
    countryTag: "SPAIN",
    flag: "🇪🇸",
    season: "2026/2027",
    crest: LEAGUE_LOGO_MAP["la-liga"],
  },
  {
    slug: "bundesliga",
    name: "Bundesliga",
    country: "Germany",
    countryTag: "GERMANY",
    flag: "🇩🇪",
    season: "2026/2027",
    crest: LEAGUE_LOGO_MAP["bundesliga"],
  },
  {
    slug: "serie-a",
    name: "Serie A",
    country: "Italy",
    countryTag: "ITALY",
    flag: "🇮🇹",
    season: "2026/2027",
    crest: LEAGUE_LOGO_MAP["serie-a"],
  },
  {
    slug: "ligue-1",
    name: "Ligue 1",
    country: "France",
    countryTag: "FRANCE",
    flag: "🇫🇷",
    season: "2026/2027",
    crest: LEAGUE_LOGO_MAP["ligue-1"],
  },
  {
    slug: "champions-league",
    name: "Champions League",
    country: "Europe",
    countryTag: "UEFA",
    flag: "🇪🇺",
    season: "2026/2027",
    crest: LEAGUE_LOGO_MAP["champions-league"],
  },
  {
    slug: "mls",
    name: "Major League Soccer",
    country: "USA",
    countryTag: "USA",
    flag: "🇺🇸",
    season: "2026",
    crest: LEAGUE_LOGO_MAP["mls"],
  },
  {
    slug: "saudi-pro-league",
    name: "Saudi Pro League",
    country: "Saudi Arabia",
    countryTag: "SAUDI ARABIA",
    flag: "🇸🇦",
    season: "2026/2027",
    crest: LEAGUE_LOGO_MAP["saudi-pro-league"],
  },
  {
    slug: "eredivisie",
    name: "Eredivisie",
    country: "Netherlands",
    countryTag: "NETHERLANDS",
    flag: "🇳🇱",
    season: "2026/2027",
    crest: LEAGUE_LOGO_MAP["eredivisie"],
  },
];

// Fallback high-res club badges across leagues
export const MULTI_LEAGUE_CLUBS: Record<string, string> = {
  // Champions League Clubs
  "Inter Milan": "https://images.fotmob.com/image_resources/logo/teamlogo/8636.png",
  "AC Milan": "https://images.fotmob.com/image_resources/logo/teamlogo/8564.png",
  "Benfica": "https://images.fotmob.com/image_resources/logo/teamlogo/9773.png",
  "Sporting CP": "https://images.fotmob.com/image_resources/logo/teamlogo/9768.png",
  "FC Porto": "https://images.fotmob.com/image_resources/logo/teamlogo/9772.png",
  "Feyenoord": "https://images.fotmob.com/image_resources/logo/teamlogo/10235.png",
  "PSV Eindhoven": "https://images.fotmob.com/image_resources/logo/teamlogo/8640.png",
  "Celtic": "https://images.fotmob.com/image_resources/logo/teamlogo/9925.png",
  "Dinamo Zagreb": "https://images.fotmob.com/image_resources/logo/teamlogo/10052.png",
  "Club Brugge": "https://images.fotmob.com/image_resources/logo/teamlogo/8342.png",
  "Shakhtar Donetsk": "https://images.fotmob.com/image_resources/logo/teamlogo/10006.png",
  "Red Star Belgrade": "https://images.fotmob.com/image_resources/logo/teamlogo/10054.png",
  "Sparta Prague": "https://images.fotmob.com/image_resources/logo/teamlogo/8244.png",
  "Sturm Graz": "https://images.fotmob.com/image_resources/logo/teamlogo/8169.png",
  "Brest": "https://images.fotmob.com/image_resources/logo/teamlogo/9848.png",
  "Bologna": "https://images.fotmob.com/image_resources/logo/teamlogo/9857.png",
  "Girona": "https://images.fotmob.com/image_resources/logo/teamlogo/9812.png",
  "VfB Stuttgart": "https://images.fotmob.com/image_resources/logo/teamlogo/10269.png",
  "Stuttgart": "https://images.fotmob.com/image_resources/logo/teamlogo/10269.png",
  "Young Boys": "https://images.fotmob.com/image_resources/logo/teamlogo/10192.png",
  "Slovan Bratislava": "https://images.fotmob.com/image_resources/logo/teamlogo/9759.png",
  "Raphinha": "https://images.fotmob.com/image_resources/playerimages/796857.png",

  // Championship
  "Derby County": "https://images.fotmob.com/image_resources/logo/teamlogo/8658.png",
  "Bolton Wanderers": "https://images.fotmob.com/image_resources/logo/teamlogo/8559.png",
  "Middlesbrough": "https://images.fotmob.com/image_resources/logo/teamlogo/8657.png",
  "Wolverhampton Wanderers": "https://resources.premierleague.com/premierleague/badges/70/t39.png",
  "Birmingham City": "https://images.fotmob.com/image_resources/logo/teamlogo/8655.png",
  "Stoke City": "https://images.fotmob.com/image_resources/logo/teamlogo/10194.png",
  "Swansea City": "https://images.fotmob.com/image_resources/logo/teamlogo/10003.png",
  "West Bromwich Albion": "https://images.fotmob.com/image_resources/logo/teamlogo/8659.png",
  "Southampton": "https://resources.premierleague.com/premierleague/badges/70/t20.png",
  "West Ham United": "https://resources.premierleague.com/premierleague/badges/70/t21.png",
  "Sheffield United": "https://images.fotmob.com/image_resources/logo/teamlogo/8657.png",
  "Portsmouth": "https://images.fotmob.com/image_resources/logo/teamlogo/8462.png",
  "Queens Park Rangers": "https://images.fotmob.com/image_resources/logo/teamlogo/10172.png",
  "Norwich City": "https://images.fotmob.com/image_resources/logo/teamlogo/9850.png",
  "Wrexham": "https://images.fotmob.com/image_resources/logo/teamlogo/9839.png",
  "Coventry City": "https://images.fotmob.com/image_resources/logo/teamlogo/8669.png",
  "Watford": "https://images.fotmob.com/image_resources/logo/teamlogo/9817.png",
  "Millwall": "https://images.fotmob.com/image_resources/logo/teamlogo/10004.png",
  "Bristol City": "https://images.fotmob.com/image_resources/logo/teamlogo/8427.png",

  // La Liga
  "FC Barcelona": "https://images.fotmob.com/image_resources/logo/teamlogo/8634.png",
  "Barcelona": "https://images.fotmob.com/image_resources/logo/teamlogo/8634.png",
  "Real Madrid": "https://images.fotmob.com/image_resources/logo/teamlogo/8633.png",
  "Sevilla": "https://images.fotmob.com/image_resources/logo/teamlogo/8302.png",
  "Deportivo Alavés": "https://images.fotmob.com/image_resources/logo/teamlogo/9865.png",
  "Deportivo Alaves": "https://images.fotmob.com/image_resources/logo/teamlogo/9865.png",
  "Atlético Madrid": "https://images.fotmob.com/image_resources/logo/teamlogo/9906.png",
  "Athletic Club": "https://images.fotmob.com/image_resources/logo/teamlogo/8315.png",
  "Real Sociedad": "https://images.fotmob.com/image_resources/logo/teamlogo/8560.png",
  "Real Betis": "https://images.fotmob.com/image_resources/logo/teamlogo/8603.png",
  "Villarreal": "https://images.fotmob.com/image_resources/logo/teamlogo/10205.png",

  // Bundesliga
  "Hamburger SV": "https://images.fotmob.com/image_resources/logo/teamlogo/9790.png",
  "Borussia Mönchengladbach": "https://images.fotmob.com/image_resources/logo/teamlogo/9788.png",
  "Bayern Munich": "https://images.fotmob.com/image_resources/logo/teamlogo/9823.png",
  "Borussia Dortmund": "https://images.fotmob.com/image_resources/logo/teamlogo/9789.png",
  "Bayer Leverkusen": "https://images.fotmob.com/image_resources/logo/teamlogo/8178.png",

  // Serie A
  "Inter": "https://images.fotmob.com/image_resources/logo/teamlogo/8636.png",
  "Juventus": "https://images.fotmob.com/image_resources/logo/teamlogo/9885.png",
  "Milan": "https://images.fotmob.com/image_resources/logo/teamlogo/8564.png",
  "Napoli": "https://images.fotmob.com/image_resources/logo/teamlogo/9875.png",

  // Ligue 1
  "Paris Saint-Germain": "https://images.fotmob.com/image_resources/logo/teamlogo/9847.png",
  "Le Havre": "https://images.fotmob.com/image_resources/logo/teamlogo/9747.png",
  "Marseille": "https://images.fotmob.com/image_resources/logo/teamlogo/8592.png",
  // Missing International Clubs
  "RB Leipzig": "https://images.fotmob.com/image_resources/logo/teamlogo/10254.png",
  "Inter Miami": "https://images.fotmob.com/image_resources/logo/teamlogo/1143804.png",
  "Al Nassr": "https://images.fotmob.com/image_resources/logo/teamlogo/102044.png",
  "Galatasaray": "https://images.fotmob.com/image_resources/logo/teamlogo/8637.png",
  "Ajax": "https://images.fotmob.com/image_resources/logo/teamlogo/8593.png",
  "Roma": "https://images.fotmob.com/image_resources/logo/teamlogo/8686.png",
  "Lazio": "https://images.fotmob.com/image_resources/logo/teamlogo/8543.png",
  "Atalanta": "https://images.fotmob.com/image_resources/logo/teamlogo/8524.png",
  "Fiorentina": "https://images.fotmob.com/image_resources/logo/teamlogo/8535.png",
  "Monaco": "https://images.fotmob.com/image_resources/logo/teamlogo/9829.png",
  "Lyon": "https://images.fotmob.com/image_resources/logo/teamlogo/9748.png",
  "Lille": "https://images.fotmob.com/image_resources/logo/teamlogo/8639.png",
  "Lens": "https://images.fotmob.com/image_resources/logo/teamlogo/8586.png",
  "Nice": "https://images.fotmob.com/image_resources/logo/teamlogo/9831.png",
  "Rennes": "https://images.fotmob.com/image_resources/logo/teamlogo/9851.png",
};

export function getLeagueCrest(slug: string): string {
  const match = GLOBAL_LEAGUES.find((l) => l.slug === slug || l.name.toLowerCase() === slug.toLowerCase());
  return match?.crest || PL_LEAGUE_LOGO;
}

export function getCountryFlag(countryName: string): string {
  const flags: Record<string, string> = {
    England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    Spain: "🇪🇸",
    Germany: "🇩🇪",
    Italy: "🇮🇹",
    France: "🇫🇷",
    Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    USA: "🇺🇸",
    "Saudi Arabia": "🇸🇦",
    Netherlands: "🇳🇱",
  };
  return flags[countryName] || "🌍";
}

/**
 * Returns the official Premier League portrait cutout URL for a given player.
 * Falls back to name lookup or placeholder avatar.
 */
const GLOBAL_PLAYER_PHOTOS: Record<string, string> = {
  "raphinha": "https://images.fotmob.com/image_resources/playerimages/796857.png",
  "lamine-yamal": "https://images.fotmob.com/image_resources/playerimages/1504106.png",
  "lamine yamal": "https://images.fotmob.com/image_resources/playerimages/1504106.png",
  "kylian mbappé": "https://images.fotmob.com/image_resources/playerimages/737066.png",
  "kylian mbappe": "https://images.fotmob.com/image_resources/playerimages/737066.png",
  "mbappe": "https://images.fotmob.com/image_resources/playerimages/737066.png",
  "jude bellingham": "https://images.fotmob.com/image_resources/playerimages/1077894.png",
  "bellingham": "https://images.fotmob.com/image_resources/playerimages/1077894.png",
  "vinícius júnior": "https://images.fotmob.com/image_resources/playerimages/846035.png",
  "vinicius junior": "https://images.fotmob.com/image_resources/playerimages/846035.png",
  "vini jr": "https://images.fotmob.com/image_resources/playerimages/846035.png",
  "harry kane": "https://images.fotmob.com/image_resources/playerimages/208443.png",
  "kane": "https://images.fotmob.com/image_resources/playerimages/208443.png",
  "lionel messi": "https://images.fotmob.com/image_resources/playerimages/30981.png",
  "messi": "https://images.fotmob.com/image_resources/playerimages/30981.png",
  "cristiano ronaldo": "https://images.fotmob.com/image_resources/playerimages/30893.png",
  "ronaldo": "https://images.fotmob.com/image_resources/playerimages/30893.png",
  "robert lewandowski": "https://images.fotmob.com/image_resources/playerimages/154297.png",
  "lewandowski": "https://images.fotmob.com/image_resources/playerimages/154297.png",
  "antoine griezmann": "https://images.fotmob.com/image_resources/playerimages/166444.png",
  "griezmann": "https://images.fotmob.com/image_resources/playerimages/166444.png",
  "lautaro martínez": "https://images.fotmob.com/image_resources/playerimages/735624.png",
  "lautaro martinez": "https://images.fotmob.com/image_resources/playerimages/735624.png",
  "lautaro": "https://images.fotmob.com/image_resources/playerimages/735624.png",
  "victor osimhen": "https://images.fotmob.com/image_resources/playerimages/754157.png",
  "osimhen": "https://images.fotmob.com/image_resources/playerimages/754157.png",
  "khvicha kvaratskhelia": "https://images.fotmob.com/image_resources/playerimages/1020286.png",
  "kvaratskhelia": "https://images.fotmob.com/image_resources/playerimages/1020286.png",
  "pedri": "https://images.fotmob.com/image_resources/playerimages/1082729.png",
  "rodrygo": "https://images.fotmob.com/image_resources/playerimages/896173.png",
  "jamal musiala": "https://images.fotmob.com/image_resources/playerimages/1138243.png",
  "musiala": "https://images.fotmob.com/image_resources/playerimages/1138243.png",
  "florian wirtz": "https://images.fotmob.com/image_resources/playerimages/1149467.png",
  "wirtz": "https://images.fotmob.com/image_resources/playerimages/1149467.png",
  "federico valverde": "https://images.fotmob.com/image_resources/playerimages/857835.png",
  "valverde": "https://images.fotmob.com/image_resources/playerimages/857835.png",
  "xavi simons": "https://images.fotmob.com/image_resources/playerimages/1103498.png",
  "simons": "https://images.fotmob.com/image_resources/playerimages/1103498.png",
  "alphonso davies": "https://images.fotmob.com/image_resources/playerimages/802498.png",
  "davies": "https://images.fotmob.com/image_resources/playerimages/802498.png",
};

export function getPlayerHeadshot(playerName?: string, teamSlug?: string): string {
  if (!playerName) {
    return "/fallback-player-avatar.svg";
  }

  const cleanName = playerName.trim();
  const lowerName = cleanName.toLowerCase();

  // 1. Check Premier League mapped photo IDs (p{id})
  const plCode = PLAYER_PHOTO_MAP[cleanName] || PLAYER_PHOTO_MAP[lowerName];
  if (plCode && plCode.startsWith("p")) {
    return `https://resources.premierleague.com/premierleague/photos/players/250x250/${plCode}.png`;
  }

  // 2. Fuzzy match in Premier League player photo map
  for (const [name, code] of Object.entries(PLAYER_PHOTO_MAP)) {
    if (code.startsWith("p")) {
      const lowerKey = name.toLowerCase();
      if (lowerName.includes(lowerKey) || lowerKey.includes(lowerName)) {
        return `https://resources.premierleague.com/premierleague/photos/players/250x250/${code}.png`;
      }
    }
  }

  // 3. Known global direct CDN player cutouts
  if (GLOBAL_PLAYER_PHOTOS[lowerName]) {
    return GLOBAL_PLAYER_PHOTOS[lowerName];
  }
  for (const [key, url] of Object.entries(GLOBAL_PLAYER_PHOTOS)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return url;
    }
  }

  // 4. Robust fallback with high-quality Cohere design-styled avatar
  const encoded = encodeURIComponent(cleanName);
  return `https://ui-avatars.com/api/?name=${encoded}&background=eeece7&color=17171c&bold=true&size=128`;
}

export function getPlayerPhoto(playerIdOrName: string | number): string {
  if (typeof playerIdOrName === "number") {
    return `https://resources.premierleague.com/premierleague/photos/players/250x250/p${playerIdOrName}.png`;
  }
  return getPlayerHeadshot(String(playerIdOrName));
}

export function getGlobalClubCrest(teamName: string): string {
  const clean = teamName.trim();
  if (MULTI_LEAGUE_CLUBS[clean]) {
    return MULTI_LEAGUE_CLUBS[clean];
  }
  for (const [key, url] of Object.entries(MULTI_LEAGUE_CLUBS)) {
    if (clean.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(clean.toLowerCase())) {
      return url;
    }
  }
  return getClubCrest(teamName);
}
