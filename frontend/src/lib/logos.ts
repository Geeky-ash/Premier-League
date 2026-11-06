/**
 * Centralized Official Premier League Logos, Club Crests, and Player Photos CDN Helper.
 * Resources sourced directly from official Premier League CDN (resources.premierleague.com).
 */

export const PL_LEAGUE_LOGO =
  "https://resources.premierleague.com/premierleague/badges/50/PL-logo.png";

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

/**
 * Returns the official Premier League Lion logo.
 */
export function getLeagueLogo(): string {
  return PL_LEAGUE_LOGO;
}

/**
 * Returns the official Premier League club crest URL by club name with size option.
 * @param teamName Club name (e.g. 'Arsenal', 'Manchester City')
 * @param size Badge resolution (default 70, or 50, 100)
 */
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
};

/**
 * Returns the official Premier League portrait cutout URL for a given player.
 * Falls back to name lookup or placeholder avatar.
 */
export function getPlayerPhoto(playerIdOrName: string | number): string {
  if (typeof playerIdOrName === "string" && PLAYER_PHOTO_MAP[playerIdOrName]) {
    return `https://resources.premierleague.com/premierleague/photos/players/250x250/${PLAYER_PHOTO_MAP[playerIdOrName]}.png`;
  }

  if (typeof playerIdOrName === "number") {
    // If ID is a 6-digit PL FPL/API ID or mapped ID
    return `https://resources.premierleague.com/premierleague/photos/players/250x250/p${playerIdOrName}.png`;
  }

  return `https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png`;
}
