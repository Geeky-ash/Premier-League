"""Global Multi-League Football Analytics Service (backend/services/global_football.py).

Provides multi-league data ingestion and structured analytics mirroring
the playerstats.football platform architecture across Premier League,
Championship, La Liga, Bundesliga, Serie A, Ligue 1, Champions League,
MLS, Saudi Pro League, and Eredivisie.
"""

from typing import Dict, List, Optional, Any
import hashlib


# ── Global Supported Leagues ──
GLOBAL_LEAGUES_DATA: List[Dict[str, Any]] = [
    {
        "slug": "premier-league",
        "name": "Premier League",
        "country": "England",
        "country_tag": "ENGLAND",
        "flag": "\U0001f3f4\U000e0067\U000e0062\U000e0065\U000e006e\U000e0067\U000e007f",
        "season": "2026/2027",
        "crest": "https://resources.premierleague.com/premierleague/badges/50/PL-logo.png",
        "quick_categories": ["Goalscorers", "Shots", "SoT", "Tackles", "Fouls Committed", "Yellows"],
    },
    {
        "slug": "championship",
        "name": "Championship",
        "country": "England",
        "country_tag": "ENGLAND",
        "flag": "\U0001f3f4\U000e0067\U000e0062\U000e0065\U000e006e\U000e0067\U000e007f",
        "season": "2026/2027",
        "crest": "https://images.fotmob.com/image_resources/logo/leaguelogo/48.png",
        "quick_categories": ["Goalscorers", "Shots", "SoT", "Tackles", "Fouls Committed", "Yellows"],
    },
    {
        "slug": "la-liga",
        "name": "La Liga",
        "country": "Spain",
        "country_tag": "SPAIN",
        "flag": "\U0001f1ea\U0001f1f8",
        "season": "2026/2027",
        "crest": "https://images.fotmob.com/image_resources/logo/leaguelogo/87.png",
        "quick_categories": ["Goalscorers", "Shots", "SoT", "Tackles", "Fouls Committed", "Yellows"],
    },
    {
        "slug": "bundesliga",
        "name": "Bundesliga",
        "country": "Germany",
        "country_tag": "GERMANY",
        "flag": "\U0001f1e9\U0001f1ea",
        "season": "2026/2027",
        "crest": "https://images.fotmob.com/image_resources/logo/leaguelogo/54.png",
        "quick_categories": ["Goalscorers", "Shots", "SoT", "Tackles", "Fouls Committed", "Yellows"],
    },
    {
        "slug": "serie-a",
        "name": "Serie A",
        "country": "Italy",
        "country_tag": "ITALY",
        "flag": "\U0001f1ee\U0001f1f9",
        "season": "2026/2027",
        "crest": "https://images.fotmob.com/image_resources/logo/leaguelogo/55.png",
        "quick_categories": ["Goalscorers", "Shots", "SoT", "Tackles", "Fouls Committed", "Yellows"],
    },
    {
        "slug": "ligue-1",
        "name": "Ligue 1",
        "country": "France",
        "country_tag": "FRANCE",
        "flag": "\U0001f1eb\U0001f1f7",
        "season": "2026/2027",
        "crest": "https://images.fotmob.com/image_resources/logo/leaguelogo/53.png",
        "quick_categories": ["Goalscorers", "Shots", "SoT", "Tackles", "Fouls Committed", "Yellows"],
    },
    {
        "slug": "champions-league",
        "name": "Champions League",
        "country": "Europe",
        "country_tag": "UEFA",
        "flag": "\U0001f1ea\U0001f1fa",
        "season": "2026/2027",
        "crest": "https://images.fotmob.com/image_resources/logo/leaguelogo/42.png",
        "quick_categories": ["Goalscorers", "Shots", "SoT", "Tackles", "Fouls Committed", "Yellows"],
    },
    {
        "slug": "mls",
        "name": "Major League Soccer",
        "country": "USA",
        "country_tag": "USA",
        "flag": "\U0001f1fa\U0001f1f8",
        "season": "2026",
        "crest": "https://images.fotmob.com/image_resources/logo/leaguelogo/130.png",
        "quick_categories": ["Goalscorers", "Shots", "SoT", "Tackles", "Fouls Committed", "Yellows"],
    },
    {
        "slug": "saudi-pro-league",
        "name": "Saudi Pro League",
        "country": "Saudi Arabia",
        "country_tag": "SAUDI ARABIA",
        "flag": "\U0001f1f8\U0001f1e6",
        "season": "2026/2027",
        "crest": "https://images.fotmob.com/image_resources/logo/leaguelogo/9906.png",
        "quick_categories": ["Goalscorers", "Shots", "SoT", "Tackles", "Fouls Committed", "Yellows"],
    },
    {
        "slug": "eredivisie",
        "name": "Eredivisie",
        "country": "Netherlands",
        "country_tag": "NETHERLANDS",
        "flag": "\U0001f1f3\U0001f1f1",
        "season": "2026/2027",
        "crest": "https://images.fotmob.com/image_resources/logo/leaguelogo/57.png",
        "quick_categories": ["Goalscorers", "Shots", "SoT", "Tackles", "Fouls Committed", "Yellows"],
    },
]


def get_global_leagues() -> List[Dict[str, Any]]:
    """Returns all supported world leagues with metadata and shortcut categories."""
    return GLOBAL_LEAGUES_DATA


# ── Fixtures generator supporting all 10 leagues & any date tab ──
LEAGUE_MATCHUPS = {
    "premier-league": [
        ("Arsenal", "Chelsea", "M. Oliver", 3.82, 0.15, "17:30"),
        ("Everton", "Liverpool", "S. Attwell", 3.32, 0.12, "20:00"),
        ("Manchester City", "Tottenham Hotspur", "A. Taylor", 4.10, 0.18, "15:00"),
        ("Aston Villa", "Newcastle United", "P. Tierney", 3.45, 0.09, "12:30"),
    ],
    "championship": [
        ("Derby County", "Bolton Wanderers", "J. Bell", 3.58, 0.08, "20:00"),
        ("Wrexham", "Wolverhampton Wanderers", "A. Kitchen", 2.63, 0.05, "12:30"),
        ("Portsmouth", "Stoke City", "B. Speedie", 2.79, 0.08, "15:00"),
        ("Middlesbrough", "Southampton", "D. Webb", 3.12, 0.11, "17:45"),
    ],
    "la-liga": [
        ("FC Barcelona", "Real Madrid", "J. Gil Manzano", 4.65, 0.22, "21:00"),
        ("Sevilla", "Atlético Madrid", "J. Munuera", 4.12, 0.18, "18:30"),
        ("Athletic Club", "Real Sociedad", "A. Mateu", 4.40, 0.25, "16:15"),
        ("Valencia", "Villarreal", "C. Soto Grado", 3.95, 0.14, "14:00"),
    ],
    "bundesliga": [
        ("Bayern Munich", "Borussia Dortmund", "F. Brych", 3.75, 0.10, "18:30"),
        ("Bayer Leverkusen", "RB Leipzig", "D. Siebert", 3.60, 0.12, "15:30"),
        ("Eintracht Frankfurt", "VfB Stuttgart", "T. Stieler", 3.90, 0.15, "15:30"),
        ("Hamburger SV", "Borussia Mönchengladbach", "S. Jablonski", 3.40, 0.08, "20:30"),
    ],
    "serie-a": [
        ("Juventus", "Inter", "D. Massa", 4.30, 0.15, "20:45"),
        ("AC Milan", "Napoli", "M. Guida", 4.15, 0.19, "18:00"),
        ("Roma", "Lazio", "D. Doveri", 5.10, 0.35, "18:00"),
        ("Atalanta", "Fiorentina", "M. Di Bello", 3.85, 0.11, "15:00"),
    ],
    "ligue-1": [
        ("Paris Saint-Germain", "Marseille", "F. Letexier", 4.25, 0.20, "20:45"),
        ("Monaco", "Lyon", "B. Bastien", 3.95, 0.16, "17:00"),
        ("Lille", "Lens", "C. Turpin", 4.50, 0.22, "21:00"),
        ("Nice", "Rennes", "J. Pignard", 3.70, 0.10, "15:00"),
    ],
    "champions-league": [
        ("Real Madrid", "Manchester City", "S. Marciniak", 4.05, 0.14, "20:00"),
        ("FC Barcelona", "Bayern Munich", "D. Orsato", 3.90, 0.12, "20:00"),
        ("Arsenal", "Paris Saint-Germain", "A. Taylor", 3.80, 0.10, "20:00"),
        ("Inter", "Liverpool", "I. Kovacs", 4.30, 0.18, "20:00"),
    ],
    "mls": [
        ("Inter Miami", "LA Galaxy", "I. Elfath", 3.65, 0.12, "19:30"),
        ("Los Angeles FC", "Seattle Sounders", "A. Chapman", 3.40, 0.08, "22:00"),
        ("New York Red Bulls", "NYCFC", "T. Penso", 4.10, 0.15, "19:00"),
        ("Columbus Crew", "FC Cincinnati", "G. Mendoza", 3.80, 0.10, "19:30"),
    ],
    "saudi-pro-league": [
        ("Al Nassr", "Al Hilal", "P. Marciniak", 4.20, 0.20, "20:00"),
        ("Al Ittihad", "Al Ahli", "M. Oliver", 3.90, 0.15, "20:30"),
        ("Al Shabab", "Al Ettifaq", "K. Al-Turais", 3.50, 0.10, "18:00"),
    ],
    "eredivisie": [
        ("Ajax", "Feyenoord", "D. Makkelie", 4.45, 0.20, "14:30"),
        ("PSV Eindhoven", "AZ Alkmaar", "S. Gözübüyük", 3.70, 0.11, "16:45"),
        ("Twente", "Utrecht", "A. Lindhout", 3.30, 0.08, "12:15"),
    ],
}


def get_global_fixtures_by_date(date_str: str) -> Dict[str, Any]:
    """Returns date-selected fixtures dynamically grouped across 10 competitions."""
    h = int(hashlib.md5(date_str.encode("utf-8")).hexdigest()[:6], 16)

    competitions = []
    total_matches = 0

    for league in GLOBAL_LEAGUES_DATA:
        slug = league["slug"]
        matchups = LEAGUE_MATCHUPS.get(slug, [])
        if not matchups:
            continue

        offset = h % len(matchups)
        count = 2 if (h % 2 == 0) else 1
        selected = [matchups[(offset + i) % len(matchups)] for i in range(count)]

        matches = []
        for idx, (home, away, ref, ref_y, ref_r, kickoff) in enumerate(selected):
            total_matches += 1
            lineup_type = "LINEUPS" if ((h + idx) % 2 == 0) else "EXPECTED"
            matches.append({
                "id": f"{slug[:3]}-{idx+1}",
                "home_team": home,
                "away_team": away,
                "kickoff": kickoff,
                "match_clock": "UPCOMING",
                "lineups_status": lineup_type,
                "referee_name": ref,
                "referee_yellows": ref_y,
                "referee_reds": ref_r,
                "h2h_ready": True,
            })

        competitions.append({
            "league_name": league["name"].upper(),
            "league_slug": slug,
            "country_tag": league["country_tag"],
            "flag": league["flag"],
            "crest": league["crest"],
            "matches": matches,
        })

    return {
        "selected_date": date_str,
        "total_matches": total_matches,
        "competitions": competitions,
    }


# ── Per-league standings (20 teams each for top 5 + championship) ──
LEAGUE_STANDINGS = {
    "premier-league": [
        {"rank": 1, "club": "Arsenal", "slug": "arsenal", "mp": 14, "w": 10, "d": 3, "l": 1, "pts": 33, "form": ["W", "W", "D", "W", "W"]},
        {"rank": 2, "club": "Liverpool", "slug": "liverpool", "mp": 14, "w": 10, "d": 2, "l": 2, "pts": 32, "form": ["W", "W", "W", "L", "W"]},
        {"rank": 3, "club": "Manchester City", "slug": "manchester-city", "mp": 14, "w": 9, "d": 3, "l": 2, "pts": 30, "form": ["W", "D", "W", "W", "W"]},
        {"rank": 4, "club": "Chelsea", "slug": "chelsea", "mp": 14, "w": 8, "d": 4, "l": 2, "pts": 28, "form": ["W", "W", "D", "D", "W"]},
        {"rank": 5, "club": "Newcastle United", "slug": "newcastle-united", "mp": 14, "w": 8, "d": 3, "l": 3, "pts": 27, "form": ["W", "L", "W", "W", "W"]},
        {"rank": 6, "club": "Aston Villa", "slug": "aston-villa", "mp": 14, "w": 7, "d": 5, "l": 2, "pts": 26, "form": ["D", "W", "W", "D", "W"]},
        {"rank": 7, "club": "Tottenham Hotspur", "slug": "tottenham-hotspur", "mp": 14, "w": 7, "d": 4, "l": 3, "pts": 25, "form": ["W", "W", "L", "W", "D"]},
        {"rank": 8, "club": "Brighton", "slug": "brighton", "mp": 14, "w": 7, "d": 3, "l": 4, "pts": 24, "form": ["W", "D", "W", "L", "W"]},
        {"rank": 9, "club": "Bournemouth", "slug": "bournemouth", "mp": 14, "w": 7, "d": 2, "l": 5, "pts": 23, "form": ["W", "W", "L", "W", "W"]},
        {"rank": 10, "club": "Manchester United", "slug": "manchester-united", "mp": 14, "w": 6, "d": 4, "l": 4, "pts": 22, "form": ["D", "W", "L", "W", "D"]},
        {"rank": 11, "club": "Fulham", "slug": "fulham", "mp": 14, "w": 6, "d": 4, "l": 4, "pts": 22, "form": ["W", "D", "D", "W", "L"]},
        {"rank": 12, "club": "West Ham United", "slug": "west-ham-united", "mp": 14, "w": 6, "d": 3, "l": 5, "pts": 21, "form": ["L", "W", "W", "D", "W"]},
        {"rank": 13, "club": "Brentford", "slug": "brentford", "mp": 14, "w": 5, "d": 5, "l": 4, "pts": 20, "form": ["D", "W", "D", "W", "D"]},
        {"rank": 14, "club": "Crystal Palace", "slug": "crystal-palace", "mp": 14, "w": 5, "d": 4, "l": 5, "pts": 19, "form": ["W", "L", "W", "D", "L"]},
        {"rank": 15, "club": "Nottingham Forest", "slug": "nottingham-forest", "mp": 14, "w": 5, "d": 3, "l": 6, "pts": 18, "form": ["L", "W", "W", "L", "W"]},
        {"rank": 16, "club": "Everton", "slug": "everton", "mp": 14, "w": 4, "d": 5, "l": 5, "pts": 17, "form": ["D", "L", "D", "W", "D"]},
        {"rank": 17, "club": "Wolverhampton Wanderers", "slug": "wolverhampton-wanderers", "mp": 14, "w": 4, "d": 4, "l": 6, "pts": 16, "form": ["L", "D", "W", "L", "W"]},
        {"rank": 18, "club": "Leicester City", "slug": "leicester-city", "mp": 14, "w": 3, "d": 4, "l": 7, "pts": 13, "form": ["L", "D", "L", "W", "L"]},
        {"rank": 19, "club": "Ipswich Town", "slug": "ipswich-town", "mp": 14, "w": 2, "d": 4, "l": 8, "pts": 10, "form": ["L", "L", "D", "L", "D"]},
        {"rank": 20, "club": "Southampton", "slug": "southampton", "mp": 14, "w": 1, "d": 3, "l": 10, "pts": 6, "form": ["L", "L", "L", "D", "L"]},
    ],
    "championship": [
        {"rank": 1, "club": "Middlesbrough", "slug": "middlesbrough", "mp": 14, "w": 8, "d": 4, "l": 2, "pts": 28, "form": ["W", "W", "D", "W", "W"]},
        {"rank": 2, "club": "Wolverhampton Wanderers", "slug": "wolverhampton-wanderers", "mp": 14, "w": 8, "d": 3, "l": 3, "pts": 27, "form": ["W", "W", "W", "W", "W"]},
        {"rank": 3, "club": "Birmingham City", "slug": "birmingham-city", "mp": 14, "w": 7, "d": 5, "l": 2, "pts": 26, "form": ["W", "W", "W", "D", "W"]},
        {"rank": 4, "club": "Stoke City", "slug": "stoke-city", "mp": 14, "w": 8, "d": 2, "l": 4, "pts": 26, "form": ["W", "W", "W", "L", "W"]},
        {"rank": 5, "club": "Swansea City", "slug": "swansea-city", "mp": 14, "w": 8, "d": 2, "l": 4, "pts": 26, "form": ["W", "W", "W", "W", "W"]},
        {"rank": 6, "club": "West Bromwich Albion", "slug": "west-bromwich-albion", "mp": 14, "w": 7, "d": 4, "l": 3, "pts": 25, "form": ["W", "W", "D", "D", "W"]},
        {"rank": 7, "club": "Derby County", "slug": "derby-county", "mp": 14, "w": 7, "d": 3, "l": 4, "pts": 24, "form": ["W", "W", "D", "L", "W"]},
        {"rank": 8, "club": "West Ham United", "slug": "west-ham-united", "mp": 14, "w": 6, "d": 5, "l": 3, "pts": 23, "form": ["W", "W", "D", "W", "D"]},
        {"rank": 9, "club": "Sheffield United", "slug": "sheffield-united", "mp": 14, "w": 6, "d": 4, "l": 4, "pts": 22, "form": ["W", "W", "W", "W", "D"]},
        {"rank": 10, "club": "Portsmouth", "slug": "portsmouth", "mp": 14, "w": 6, "d": 4, "l": 4, "pts": 22, "form": ["W", "W", "W", "W", "W"]},
        {"rank": 11, "club": "Queens Park Rangers", "slug": "queens-park-rangers", "mp": 14, "w": 5, "d": 6, "l": 3, "pts": 21, "form": ["W", "W", "D", "D", "D"]},
        {"rank": 12, "club": "Norwich City", "slug": "norwich-city", "mp": 14, "w": 6, "d": 2, "l": 6, "pts": 20, "form": ["W", "W", "W", "L", "L"]},
        {"rank": 13, "club": "Bolton Wanderers", "slug": "bolton-wanderers", "mp": 14, "w": 5, "d": 4, "l": 5, "pts": 19, "form": ["D", "W", "L", "W", "D"]},
        {"rank": 14, "club": "Wrexham", "slug": "wrexham", "mp": 14, "w": 5, "d": 4, "l": 5, "pts": 19, "form": ["W", "L", "D", "W", "L"]},
        {"rank": 15, "club": "Coventry City", "slug": "coventry-city", "mp": 14, "w": 5, "d": 3, "l": 6, "pts": 18, "form": ["L", "W", "W", "L", "D"]},
        {"rank": 16, "club": "Watford", "slug": "watford", "mp": 14, "w": 4, "d": 5, "l": 5, "pts": 17, "form": ["D", "D", "W", "L", "D"]},
        {"rank": 17, "club": "Millwall", "slug": "millwall", "mp": 14, "w": 4, "d": 4, "l": 6, "pts": 16, "form": ["L", "W", "D", "L", "W"]},
        {"rank": 18, "club": "Bristol City", "slug": "bristol-city", "mp": 14, "w": 4, "d": 3, "l": 7, "pts": 15, "form": ["L", "L", "W", "D", "L"]},
        {"rank": 19, "club": "Southampton", "slug": "southampton", "mp": 14, "w": 3, "d": 4, "l": 7, "pts": 13, "form": ["L", "D", "L", "W", "L"]},
        {"rank": 20, "club": "Blackburn Rovers", "slug": "blackburn-rovers", "mp": 14, "w": 2, "d": 3, "l": 9, "pts": 9, "form": ["L", "L", "L", "D", "L"]},
    ],
    "la-liga": [
        {"rank": 1, "club": "FC Barcelona", "slug": "fc-barcelona", "mp": 14, "w": 11, "d": 2, "l": 1, "pts": 35, "form": ["W", "W", "W", "D", "W"]},
        {"rank": 2, "club": "Real Madrid", "slug": "real-madrid", "mp": 14, "w": 10, "d": 3, "l": 1, "pts": 33, "form": ["W", "W", "D", "W", "W"]},
        {"rank": 3, "club": "Atlético Madrid", "slug": "atletico-madrid", "mp": 14, "w": 9, "d": 3, "l": 2, "pts": 30, "form": ["W", "D", "W", "W", "W"]},
        {"rank": 4, "club": "Athletic Club", "slug": "athletic-club", "mp": 14, "w": 8, "d": 4, "l": 2, "pts": 28, "form": ["W", "W", "D", "D", "W"]},
        {"rank": 5, "club": "Real Sociedad", "slug": "real-sociedad", "mp": 14, "w": 7, "d": 5, "l": 2, "pts": 26, "form": ["D", "W", "W", "D", "W"]},
        {"rank": 6, "club": "Villarreal", "slug": "villarreal", "mp": 14, "w": 7, "d": 4, "l": 3, "pts": 25, "form": ["W", "L", "W", "W", "D"]},
        {"rank": 7, "club": "Real Betis", "slug": "real-betis", "mp": 14, "w": 7, "d": 3, "l": 4, "pts": 24, "form": ["W", "W", "L", "W", "W"]},
        {"rank": 8, "club": "Sevilla", "slug": "sevilla", "mp": 14, "w": 6, "d": 5, "l": 3, "pts": 23, "form": ["D", "W", "D", "W", "D"]},
        {"rank": 9, "club": "Girona", "slug": "girona", "mp": 14, "w": 6, "d": 4, "l": 4, "pts": 22, "form": ["W", "D", "L", "W", "W"]},
        {"rank": 10, "club": "Osasuna", "slug": "osasuna", "mp": 14, "w": 6, "d": 3, "l": 5, "pts": 21, "form": ["W", "L", "W", "W", "L"]},
        {"rank": 11, "club": "Celta Vigo", "slug": "celta-vigo", "mp": 14, "w": 5, "d": 5, "l": 4, "pts": 20, "form": ["D", "W", "D", "D", "W"]},
        {"rank": 12, "club": "Mallorca", "slug": "mallorca", "mp": 14, "w": 5, "d": 5, "l": 4, "pts": 20, "form": ["W", "D", "D", "W", "L"]},
        {"rank": 13, "club": "Rayo Vallecano", "slug": "rayo-vallecano", "mp": 14, "w": 5, "d": 4, "l": 5, "pts": 19, "form": ["L", "W", "D", "W", "L"]},
        {"rank": 14, "club": "Getafe", "slug": "getafe", "mp": 14, "w": 4, "d": 6, "l": 4, "pts": 18, "form": ["D", "D", "W", "D", "L"]},
        {"rank": 15, "club": "Valencia", "slug": "valencia", "mp": 14, "w": 4, "d": 5, "l": 5, "pts": 17, "form": ["L", "D", "W", "L", "D"]},
        {"rank": 16, "club": "Espanyol", "slug": "espanyol", "mp": 14, "w": 4, "d": 4, "l": 6, "pts": 16, "form": ["W", "L", "L", "D", "W"]},
        {"rank": 17, "club": "Deportivo Alavés", "slug": "deportivo-alaves", "mp": 14, "w": 3, "d": 5, "l": 6, "pts": 14, "form": ["D", "L", "D", "L", "W"]},
        {"rank": 18, "club": "Las Palmas", "slug": "las-palmas", "mp": 14, "w": 3, "d": 3, "l": 8, "pts": 12, "form": ["L", "L", "W", "L", "D"]},
        {"rank": 19, "club": "Cádiz", "slug": "cadiz", "mp": 14, "w": 2, "d": 4, "l": 8, "pts": 10, "form": ["L", "D", "L", "L", "D"]},
        {"rank": 20, "club": "Granada", "slug": "granada", "mp": 14, "w": 1, "d": 3, "l": 10, "pts": 6, "form": ["L", "L", "L", "D", "L"]},
    ],
    "bundesliga": [
        {"rank": 1, "club": "Bayern Munich", "slug": "bayern-munich", "mp": 14, "w": 11, "d": 2, "l": 1, "pts": 35, "form": ["W", "W", "W", "D", "W"]},
        {"rank": 2, "club": "Bayer Leverkusen", "slug": "bayer-leverkusen", "mp": 14, "w": 10, "d": 3, "l": 1, "pts": 33, "form": ["W", "D", "W", "W", "W"]},
        {"rank": 3, "club": "Borussia Dortmund", "slug": "borussia-dortmund", "mp": 14, "w": 9, "d": 2, "l": 3, "pts": 29, "form": ["W", "W", "L", "W", "W"]},
        {"rank": 4, "club": "RB Leipzig", "slug": "rb-leipzig", "mp": 14, "w": 8, "d": 4, "l": 2, "pts": 28, "form": ["D", "W", "W", "W", "D"]},
        {"rank": 5, "club": "VfB Stuttgart", "slug": "vfb-stuttgart", "mp": 14, "w": 8, "d": 3, "l": 3, "pts": 27, "form": ["W", "W", "W", "L", "W"]},
        {"rank": 6, "club": "Eintracht Frankfurt", "slug": "eintracht-frankfurt", "mp": 14, "w": 7, "d": 4, "l": 3, "pts": 25, "form": ["W", "D", "W", "D", "W"]},
        {"rank": 7, "club": "SC Freiburg", "slug": "sc-freiburg", "mp": 14, "w": 7, "d": 3, "l": 4, "pts": 24, "form": ["W", "L", "W", "W", "D"]},
        {"rank": 8, "club": "VfL Wolfsburg", "slug": "vfl-wolfsburg", "mp": 14, "w": 6, "d": 5, "l": 3, "pts": 23, "form": ["D", "W", "D", "W", "W"]},
        {"rank": 9, "club": "Borussia Mönchengladbach", "slug": "borussia-monchengladbach", "mp": 14, "w": 6, "d": 4, "l": 4, "pts": 22, "form": ["W", "D", "L", "W", "D"]},
        {"rank": 10, "club": "1. FC Union Berlin", "slug": "union-berlin", "mp": 14, "w": 6, "d": 3, "l": 5, "pts": 21, "form": ["L", "W", "W", "W", "L"]},
        {"rank": 11, "club": "TSG Hoffenheim", "slug": "tsg-hoffenheim", "mp": 14, "w": 5, "d": 5, "l": 4, "pts": 20, "form": ["D", "W", "D", "D", "W"]},
        {"rank": 12, "club": "1. FC Köln", "slug": "fc-koln", "mp": 14, "w": 5, "d": 4, "l": 5, "pts": 19, "form": ["W", "L", "D", "W", "L"]},
        {"rank": 13, "club": "Werder Bremen", "slug": "werder-bremen", "mp": 14, "w": 5, "d": 4, "l": 5, "pts": 19, "form": ["L", "W", "W", "D", "L"]},
        {"rank": 14, "club": "1. FSV Mainz 05", "slug": "mainz-05", "mp": 14, "w": 5, "d": 3, "l": 6, "pts": 18, "form": ["W", "L", "L", "W", "W"]},
        {"rank": 15, "club": "FC Augsburg", "slug": "fc-augsburg", "mp": 14, "w": 4, "d": 4, "l": 6, "pts": 16, "form": ["L", "D", "W", "L", "D"]},
        {"rank": 16, "club": "Hamburger SV", "slug": "hamburger-sv", "mp": 14, "w": 4, "d": 3, "l": 7, "pts": 15, "form": ["L", "W", "L", "D", "L"]},
        {"rank": 17, "club": "SV Darmstadt 98", "slug": "sv-darmstadt", "mp": 14, "w": 3, "d": 3, "l": 8, "pts": 12, "form": ["L", "L", "W", "L", "D"]},
        {"rank": 18, "club": "1. FC Heidenheim", "slug": "fc-heidenheim", "mp": 14, "w": 2, "d": 4, "l": 8, "pts": 10, "form": ["L", "D", "L", "L", "D"]},
    ],
    "serie-a": [
        {"rank": 1, "club": "Inter", "slug": "inter", "mp": 14, "w": 11, "d": 2, "l": 1, "pts": 35, "form": ["W", "W", "W", "D", "W"]},
        {"rank": 2, "club": "Napoli", "slug": "napoli", "mp": 14, "w": 10, "d": 2, "l": 2, "pts": 32, "form": ["W", "W", "L", "W", "W"]},
        {"rank": 3, "club": "Juventus", "slug": "juventus", "mp": 14, "w": 9, "d": 4, "l": 1, "pts": 31, "form": ["D", "W", "W", "W", "D"]},
        {"rank": 4, "club": "AC Milan", "slug": "ac-milan", "mp": 14, "w": 8, "d": 4, "l": 2, "pts": 28, "form": ["W", "D", "W", "W", "D"]},
        {"rank": 5, "club": "Atalanta", "slug": "atalanta", "mp": 14, "w": 8, "d": 3, "l": 3, "pts": 27, "form": ["W", "W", "W", "L", "W"]},
        {"rank": 6, "club": "Roma", "slug": "roma", "mp": 14, "w": 7, "d": 4, "l": 3, "pts": 25, "form": ["W", "D", "W", "D", "W"]},
        {"rank": 7, "club": "Lazio", "slug": "lazio", "mp": 14, "w": 7, "d": 3, "l": 4, "pts": 24, "form": ["W", "L", "W", "W", "D"]},
        {"rank": 8, "club": "Fiorentina", "slug": "fiorentina", "mp": 14, "w": 6, "d": 5, "l": 3, "pts": 23, "form": ["D", "W", "D", "W", "D"]},
        {"rank": 9, "club": "Bologna", "slug": "bologna", "mp": 14, "w": 6, "d": 4, "l": 4, "pts": 22, "form": ["W", "D", "L", "W", "W"]},
        {"rank": 10, "club": "Torino", "slug": "torino", "mp": 14, "w": 6, "d": 3, "l": 5, "pts": 21, "form": ["L", "W", "W", "W", "L"]},
        {"rank": 11, "club": "Udinese", "slug": "udinese", "mp": 14, "w": 5, "d": 5, "l": 4, "pts": 20, "form": ["D", "W", "D", "D", "W"]},
        {"rank": 12, "club": "Monza", "slug": "monza", "mp": 14, "w": 5, "d": 4, "l": 5, "pts": 19, "form": ["W", "L", "D", "W", "L"]},
        {"rank": 13, "club": "Genoa", "slug": "genoa", "mp": 14, "w": 5, "d": 4, "l": 5, "pts": 19, "form": ["L", "W", "W", "D", "L"]},
        {"rank": 14, "club": "Sassuolo", "slug": "sassuolo", "mp": 14, "w": 5, "d": 3, "l": 6, "pts": 18, "form": ["W", "L", "L", "W", "W"]},
        {"rank": 15, "club": "Lecce", "slug": "lecce", "mp": 14, "w": 4, "d": 5, "l": 5, "pts": 17, "form": ["D", "D", "W", "L", "D"]},
        {"rank": 16, "club": "Empoli", "slug": "empoli", "mp": 14, "w": 4, "d": 4, "l": 6, "pts": 16, "form": ["L", "D", "W", "L", "D"]},
        {"rank": 17, "club": "Cagliari", "slug": "cagliari", "mp": 14, "w": 3, "d": 5, "l": 6, "pts": 14, "form": ["D", "L", "D", "L", "W"]},
        {"rank": 18, "club": "Hellas Verona", "slug": "hellas-verona", "mp": 14, "w": 3, "d": 3, "l": 8, "pts": 12, "form": ["L", "L", "W", "L", "D"]},
        {"rank": 19, "club": "Frosinone", "slug": "frosinone", "mp": 14, "w": 2, "d": 4, "l": 8, "pts": 10, "form": ["L", "D", "L", "L", "D"]},
        {"rank": 20, "club": "Salernitana", "slug": "salernitana", "mp": 14, "w": 1, "d": 3, "l": 10, "pts": 6, "form": ["L", "L", "L", "D", "L"]},
    ],
    "ligue-1": [
        {"rank": 1, "club": "Paris Saint-Germain", "slug": "paris-saint-germain", "mp": 14, "w": 12, "d": 1, "l": 1, "pts": 37, "form": ["W", "W", "W", "W", "D"]},
        {"rank": 2, "club": "Monaco", "slug": "monaco", "mp": 14, "w": 9, "d": 3, "l": 2, "pts": 30, "form": ["W", "D", "W", "W", "W"]},
        {"rank": 3, "club": "Lille", "slug": "lille", "mp": 14, "w": 8, "d": 4, "l": 2, "pts": 28, "form": ["W", "W", "D", "D", "W"]},
        {"rank": 4, "club": "Lyon", "slug": "lyon", "mp": 14, "w": 8, "d": 3, "l": 3, "pts": 27, "form": ["W", "L", "W", "W", "W"]},
        {"rank": 5, "club": "Marseille", "slug": "marseille", "mp": 14, "w": 7, "d": 5, "l": 2, "pts": 26, "form": ["D", "W", "W", "D", "W"]},
        {"rank": 6, "club": "Lens", "slug": "lens", "mp": 14, "w": 7, "d": 4, "l": 3, "pts": 25, "form": ["W", "D", "W", "W", "L"]},
        {"rank": 7, "club": "Nice", "slug": "nice", "mp": 14, "w": 7, "d": 3, "l": 4, "pts": 24, "form": ["W", "W", "L", "W", "D"]},
        {"rank": 8, "club": "Rennes", "slug": "rennes", "mp": 14, "w": 6, "d": 5, "l": 3, "pts": 23, "form": ["D", "W", "D", "W", "D"]},
        {"rank": 9, "club": "Reims", "slug": "reims", "mp": 14, "w": 6, "d": 4, "l": 4, "pts": 22, "form": ["W", "D", "L", "W", "W"]},
        {"rank": 10, "club": "Strasbourg", "slug": "strasbourg", "mp": 14, "w": 6, "d": 3, "l": 5, "pts": 21, "form": ["L", "W", "W", "W", "L"]},
        {"rank": 11, "club": "Toulouse", "slug": "toulouse", "mp": 14, "w": 5, "d": 5, "l": 4, "pts": 20, "form": ["D", "W", "D", "D", "W"]},
        {"rank": 12, "club": "Montpellier", "slug": "montpellier", "mp": 14, "w": 5, "d": 4, "l": 5, "pts": 19, "form": ["W", "L", "D", "W", "L"]},
        {"rank": 13, "club": "Nantes", "slug": "nantes", "mp": 14, "w": 5, "d": 4, "l": 5, "pts": 19, "form": ["L", "W", "W", "D", "L"]},
        {"rank": 14, "club": "Brest", "slug": "brest", "mp": 14, "w": 5, "d": 3, "l": 6, "pts": 18, "form": ["W", "L", "L", "W", "W"]},
        {"rank": 15, "club": "Le Havre", "slug": "le-havre", "mp": 14, "w": 4, "d": 4, "l": 6, "pts": 16, "form": ["L", "D", "W", "L", "D"]},
        {"rank": 16, "club": "Metz", "slug": "metz", "mp": 14, "w": 4, "d": 3, "l": 7, "pts": 15, "form": ["L", "W", "L", "D", "L"]},
        {"rank": 17, "club": "Lorient", "slug": "lorient", "mp": 14, "w": 3, "d": 4, "l": 7, "pts": 13, "form": ["D", "L", "D", "L", "W"]},
        {"rank": 18, "club": "Clermont Foot", "slug": "clermont-foot", "mp": 14, "w": 2, "d": 3, "l": 9, "pts": 9, "form": ["L", "L", "L", "D", "L"]},
    ],
}

# ── Per-league stat category leaders ──
LEAGUE_STAT_CATEGORIES = {
    "premier-league": [
        {"name": "Goals", "leaders": [{"player": "Erling Haaland", "club": "Manchester City", "val": 14}, {"player": "Bukayo Saka", "club": "Arsenal", "val": 10}, {"player": "Cole Palmer", "club": "Chelsea", "val": 9}, {"player": "Mohamed Salah", "club": "Liverpool", "val": 9}]},
        {"name": "Assists", "leaders": [{"player": "Cole Palmer", "club": "Chelsea", "val": 9}, {"player": "Bukayo Saka", "club": "Arsenal", "val": 8}, {"player": "Kevin De Bruyne", "club": "Manchester City", "val": 7}, {"player": "Martin Ødegaard", "club": "Arsenal", "val": 7}]},
        {"name": "Shots on Target", "leaders": [{"player": "Erling Haaland", "club": "Manchester City", "val": 32}, {"player": "Cole Palmer", "club": "Chelsea", "val": 24}, {"player": "Alexander Isak", "club": "Newcastle United", "val": 22}, {"player": "Bukayo Saka", "club": "Arsenal", "val": 20}]},
        {"name": "Tackles", "leaders": [{"player": "Declan Rice", "club": "Arsenal", "val": 36}, {"player": "Moises Caicedo", "club": "Chelsea", "val": 34}, {"player": "Rodri", "club": "Manchester City", "val": 30}, {"player": "Bruno Guimarães", "club": "Newcastle United", "val": 28}]},
        {"name": "Yellow Cards", "leaders": [{"player": "Moises Caicedo", "club": "Chelsea", "val": 6}, {"player": "Kai Havertz", "club": "Arsenal", "val": 5}, {"player": "Bruno Fernandes", "club": "Manchester United", "val": 5}, {"player": "Alexis Mac Allister", "club": "Liverpool", "val": 4}]},
        {"name": "Key Passes", "leaders": [{"player": "Martin Ødegaard", "club": "Arsenal", "val": 38}, {"player": "Cole Palmer", "club": "Chelsea", "val": 35}, {"player": "Kevin De Bruyne", "club": "Manchester City", "val": 32}, {"player": "Bruno Fernandes", "club": "Manchester United", "val": 31}]},
        {"name": "Dribbles", "leaders": [{"player": "Jeremy Doku", "club": "Manchester City", "val": 46}, {"player": "Bukayo Saka", "club": "Arsenal", "val": 34}, {"player": "Mohammed Kudus", "club": "West Ham", "val": 32}, {"player": "Cole Palmer", "club": "Chelsea", "val": 28}]},
        {"name": "Fouls Committed", "leaders": [{"player": "Kai Havertz", "club": "Arsenal", "val": 26}, {"player": "Moises Caicedo", "club": "Chelsea", "val": 24}, {"player": "Alexis Mac Allister", "club": "Liverpool", "val": 22}, {"player": "Declan Rice", "club": "Arsenal", "val": 19}]},
        {"name": "Fouls Drawn", "leaders": [{"player": "Bruno Guimarães", "club": "Newcastle United", "val": 38}, {"player": "Bukayo Saka", "club": "Arsenal", "val": 35}, {"player": "Jack Grealish", "club": "Manchester City", "val": 30}, {"player": "Mohamed Salah", "club": "Liverpool", "val": 28}]},
        {"name": "Interceptions", "leaders": [{"player": "Declan Rice", "club": "Arsenal", "val": 24}, {"player": "William Saliba", "club": "Arsenal", "val": 22}, {"player": "Virgil van Dijk", "club": "Liverpool", "val": 21}, {"player": "Micky van de Ven", "club": "Tottenham Hotspur", "val": 19}]},
        {"name": "Shots", "leaders": [{"player": "Erling Haaland", "club": "Manchester City", "val": 56}, {"player": "Cole Palmer", "club": "Chelsea", "val": 45}, {"player": "Mohamed Salah", "club": "Liverpool", "val": 44}, {"player": "Bukayo Saka", "club": "Arsenal", "val": 40}]},
    ],
    "la-liga": [
        {"name": "Goals", "leaders": [{"player": "Robert Lewandowski", "club": "FC Barcelona", "val": 16}, {"player": "Kylian Mbappéé", "club": "Real Madrid", "val": 12}, {"player": "Antoine Griezmann", "club": "Atlético Madrid", "val": 10}, {"player": "Vinícius Júnior", "club": "Real Madrid", "val": 9}]},
        {"name": "Assists", "leaders": [{"player": "Lamine Yamal", "club": "FC Barcelona", "val": 10}, {"player": "Vinícius Júnior", "club": "Real Madrid", "val": 8}, {"player": "Pedri", "club": "FC Barcelona", "val": 7}, {"player": "Jude Bellingham", "club": "Real Madrid", "val": 7}]},
        {"name": "Shots on Target", "leaders": [{"player": "Kylian Mbappéé", "club": "Real Madrid", "val": 28}, {"player": "Robert Lewandowski", "club": "FC Barcelona", "val": 26}, {"player": "Antoine Griezmann", "club": "Atlético Madrid", "val": 20}, {"player": "Lamine Yamal", "club": "FC Barcelona", "val": 18}]},
        {"name": "Tackles", "leaders": [{"player": "Federico Valverde", "club": "Real Madrid", "val": 38}, {"player": "Pedri", "club": "FC Barcelona", "val": 32}, {"player": "Rodrygo", "club": "Real Madrid", "val": 28}, {"player": "Gavi", "club": "FC Barcelona", "val": 26}]},
        {"name": "Yellow Cards", "leaders": [{"player": "Dani Carvajal", "club": "Real Madrid", "val": 6}, {"player": "Ronald Araújo", "club": "FC Barcelona", "val": 5}, {"player": "Stefan Savić", "club": "Atlético Madrid", "val": 5}, {"player": "Marcos Llorente", "club": "Atlético Madrid", "val": 4}]},
        {"name": "Key Passes", "leaders": [{"player": "Lamine Yamal", "club": "FC Barcelona", "val": 42}, {"player": "Jude Bellingham", "club": "Real Madrid", "val": 34}, {"player": "Pedri", "club": "FC Barcelona", "val": 30}, {"player": "Antoine Griezmann", "club": "Atlético Madrid", "val": 28}]},
        {"name": "Dribbles", "leaders": [{"player": "Vinícius Júnior", "club": "Real Madrid", "val": 52}, {"player": "Lamine Yamal", "club": "FC Barcelona", "val": 48}, {"player": "Raphinha", "club": "FC Barcelona", "val": 36}, {"player": "Kylian Mbappéé", "club": "Real Madrid", "val": 34}]},
        {"name": "Fouls Committed", "leaders": [{"player": "Federico Valverde", "club": "Real Madrid", "val": 28}, {"player": "Ronald Araújo", "club": "FC Barcelona", "val": 24}, {"player": "Marcos Llorente", "club": "Atlético Madrid", "val": 22}, {"player": "Gavi", "club": "FC Barcelona", "val": 20}]},
        {"name": "Fouls Drawn", "leaders": [{"player": "Vinícius Júnior", "club": "Real Madrid", "val": 44}, {"player": "Lamine Yamal", "club": "FC Barcelona", "val": 38}, {"player": "Raphinha", "club": "FC Barcelona", "val": 30}, {"player": "Kylian Mbappéé", "club": "Real Madrid", "val": 28}]},
        {"name": "Interceptions", "leaders": [{"player": "Federico Valverde", "club": "Real Madrid", "val": 26}, {"player": "Pedri", "club": "FC Barcelona", "val": 22}, {"player": "Rodrigo De Paul", "club": "Atlético Madrid", "val": 20}, {"player": "Toni Kroos", "club": "Real Madrid", "val": 18}]},
        {"name": "Shots", "leaders": [{"player": "Kylian Mbappéé", "club": "Real Madrid", "val": 58}, {"player": "Robert Lewandowski", "club": "FC Barcelona", "val": 50}, {"player": "Antoine Griezmann", "club": "Atlético Madrid", "val": 42}, {"player": "Vinícius Júnior", "club": "Real Madrid", "val": 40}]},
    ],
    "bundesliga": [
        {"name": "Goals", "leaders": [{"player": "Harry Kane", "club": "Bayern Munich", "val": 18}, {"player": "Florian Wirtz", "club": "Bayer Leverkusen", "val": 10}, {"player": "Jamal Musiala", "club": "Bayern Munich", "val": 8}, {"player": "Xavi Simons", "club": "RB Leipzig", "val": 7}]},
        {"name": "Assists", "leaders": [{"player": "Jamal Musiala", "club": "Bayern Munich", "val": 9}, {"player": "Florian Wirtz", "club": "Bayer Leverkusen", "val": 8}, {"player": "Xavi Simons", "club": "RB Leipzig", "val": 7}, {"player": "Thomas Müller", "club": "Bayern Munich", "val": 6}]},
        {"name": "Shots on Target", "leaders": [{"player": "Harry Kane", "club": "Bayern Munich", "val": 36}, {"player": "Florian Wirtz", "club": "Bayer Leverkusen", "val": 22}, {"player": "Jamal Musiala", "club": "Bayern Munich", "val": 20}, {"player": "Xavi Simons", "club": "RB Leipzig", "val": 18}]},
        {"name": "Tackles", "leaders": [{"player": "Alphonso Davies", "club": "Bayern Munich", "val": 34}, {"player": "Xhaka", "club": "Bayer Leverkusen", "val": 30}, {"player": "Kimmich", "club": "Bayern Munich", "val": 28}, {"player": "Xavi Simons", "club": "RB Leipzig", "val": 26}]},
        {"name": "Yellow Cards", "leaders": [{"player": "Robert Andrich", "club": "Bayer Leverkusen", "val": 7}, {"player": "Willi Orbán", "club": "RB Leipzig", "val": 5}, {"player": "Nico Schlötterbeck", "club": "Borussia Dortmund", "val": 5}, {"player": "Mats Hummels", "club": "Borussia Dortmund", "val": 4}]},
        {"name": "Key Passes", "leaders": [{"player": "Jamal Musiala", "club": "Bayern Munich", "val": 36}, {"player": "Florian Wirtz", "club": "Bayer Leverkusen", "val": 34}, {"player": "Xavi Simons", "club": "RB Leipzig", "val": 30}, {"player": "Harry Kane", "club": "Bayern Munich", "val": 24}]},
        {"name": "Dribbles", "leaders": [{"player": "Jamal Musiala", "club": "Bayern Munich", "val": 50}, {"player": "Xavi Simons", "club": "RB Leipzig", "val": 44}, {"player": "Florian Wirtz", "club": "Bayer Leverkusen", "val": 38}, {"player": "Alphonso Davies", "club": "Bayern Munich", "val": 32}]},
        {"name": "Fouls Committed", "leaders": [{"player": "Robert Andrich", "club": "Bayer Leverkusen", "val": 30}, {"player": "Willi Orbán", "club": "RB Leipzig", "val": 24}, {"player": "Kimmich", "club": "Bayern Munich", "val": 22}, {"player": "Nico Schlötterbeck", "club": "Borussia Dortmund", "val": 20}]},
        {"name": "Fouls Drawn", "leaders": [{"player": "Jamal Musiala", "club": "Bayern Munich", "val": 36}, {"player": "Florian Wirtz", "club": "Bayer Leverkusen", "val": 32}, {"player": "Xavi Simons", "club": "RB Leipzig", "val": 28}, {"player": "Harry Kane", "club": "Bayern Munich", "val": 24}]},
        {"name": "Interceptions", "leaders": [{"player": "Alphonso Davies", "club": "Bayern Munich", "val": 22}, {"player": "Kimmich", "club": "Bayern Munich", "val": 20}, {"player": "Xhaka", "club": "Bayer Leverkusen", "val": 18}, {"player": "Willi Orbán", "club": "RB Leipzig", "val": 16}]},
        {"name": "Shots", "leaders": [{"player": "Harry Kane", "club": "Bayern Munich", "val": 62}, {"player": "Florian Wirtz", "club": "Bayer Leverkusen", "val": 44}, {"player": "Jamal Musiala", "club": "Bayern Munich", "val": 40}, {"player": "Xavi Simons", "club": "RB Leipzig", "val": 38}]},
    ],
    "serie-a": [
        {"name": "Goals", "leaders": [{"player": "Lautaro Martínez", "club": "Inter", "val": 14}, {"player": "Victor Osimhen", "club": "Napoli", "val": 11}, {"player": "Khvicha Kvaratskhelia", "club": "Napoli", "val": 8}, {"player": "Dusan Vlahovic", "club": "Juventus", "val": 8}]},
        {"name": "Assists", "leaders": [{"player": "Khvicha Kvaratskhelia", "club": "Napoli", "val": 9}, {"player": "Paulo Dybala", "club": "Roma", "val": 7}, {"player": "Nicol\u00f2 Barella", "club": "Inter", "val": 7}, {"player": "Rafael Leão", "club": "AC Milan", "val": 6}]},
        {"name": "Shots on Target", "leaders": [{"player": "Lautaro Martínez", "club": "Inter", "val": 28}, {"player": "Victor Osimhen", "club": "Napoli", "val": 24}, {"player": "Dusan Vlahovic", "club": "Juventus", "val": 22}, {"player": "Khvicha Kvaratskhelia", "club": "Napoli", "val": 18}]},
        {"name": "Tackles", "leaders": [{"player": "Nicol\u00f2 Barella", "club": "Inter", "val": 36}, {"player": "Sandro Tonali", "club": "AC Milan", "val": 32}, {"player": "Sergej Milinkovic-Savic", "club": "Lazio", "val": 28}, {"player": "Manuel Locatelli", "club": "Juventus", "val": 26}]},
        {"name": "Yellow Cards", "leaders": [{"player": "Sandro Tonali", "club": "AC Milan", "val": 6}, {"player": "Sergej Milinkovic-Savic", "club": "Lazio", "val": 5}, {"player": "Danilo", "club": "Juventus", "val": 5}, {"player": "Stefan de Vrij", "club": "Inter", "val": 4}]},
        {"name": "Key Passes", "leaders": [{"player": "Khvicha Kvaratskhelia", "club": "Napoli", "val": 38}, {"player": "Paulo Dybala", "club": "Roma", "val": 34}, {"player": "Nicol\u00f2 Barella", "club": "Inter", "val": 30}, {"player": "Rafael Leão", "club": "AC Milan", "val": 28}]},
        {"name": "Dribbles", "leaders": [{"player": "Khvicha Kvaratskhelia", "club": "Napoli", "val": 52}, {"player": "Rafael Leão", "club": "AC Milan", "val": 46}, {"player": "Lautaro Martínez", "club": "Inter", "val": 28}, {"player": "Paulo Dybala", "club": "Roma", "val": 26}]},
        {"name": "Fouls Committed", "leaders": [{"player": "Sandro Tonali", "club": "AC Milan", "val": 28}, {"player": "Sergej Milinkovic-Savic", "club": "Lazio", "val": 24}, {"player": "Manuel Locatelli", "club": "Juventus", "val": 22}, {"player": "Marcelo Brozovic", "club": "Inter", "val": 20}]},
        {"name": "Fouls Drawn", "leaders": [{"player": "Khvicha Kvaratskhelia", "club": "Napoli", "val": 42}, {"player": "Rafael Leão", "club": "AC Milan", "val": 36}, {"player": "Lautaro Martínez", "club": "Inter", "val": 30}, {"player": "Paulo Dybala", "club": "Roma", "val": 28}]},
        {"name": "Interceptions", "leaders": [{"player": "Nicol\u00f2 Barella", "club": "Inter", "val": 24}, {"player": "Stefan de Vrij", "club": "Inter", "val": 22}, {"player": "Gleison Bremer", "club": "Juventus", "val": 20}, {"player": "Kim Min-jae", "club": "Napoli", "val": 18}]},
        {"name": "Shots", "leaders": [{"player": "Lautaro Martínez", "club": "Inter", "val": 54}, {"player": "Victor Osimhen", "club": "Napoli", "val": 48}, {"player": "Dusan Vlahovic", "club": "Juventus", "val": 44}, {"player": "Khvicha Kvaratskhelia", "club": "Napoli", "val": 38}]},
    ],
}


def get_league_overview(slug: str) -> Dict[str, Any]:
    """Returns 3-column structured data for a league: Standings, Fixtures, and Player Stat categories.
    
    stat_categories format: [{name: str, leaders: [{player: str, club: str, val: number}]}]
    """
    league_info = next((l for l in GLOBAL_LEAGUES_DATA if l["slug"] == slug), GLOBAL_LEAGUES_DATA[0])

    # Use per-league standings or fall back to championship
    standings = LEAGUE_STANDINGS.get(slug, LEAGUE_STANDINGS["championship"])

    # Per-league fixtures from LEAGUE_MATCHUPS
    league_matchups = LEAGUE_MATCHUPS.get(slug, LEAGUE_MATCHUPS["premier-league"])
    fixtures_groups = [
        {
            "date_heading": "FRIDAY 6TH NOV",
            "matches": [
                {
                    "home_team": league_matchups[0][0],
                    "away_team": league_matchups[0][1],
                    "referee": league_matchups[0][2],
                    "yellow_avg": league_matchups[0][3],
                    "red_avg": league_matchups[0][4],
                    "time": league_matchups[0][5],
                }
            ],
        },
        {
            "date_heading": "SATURDAY 7TH NOV",
            "matches": [
                {
                    "home_team": league_matchups[i][0],
                    "away_team": league_matchups[i][1],
                    "referee": league_matchups[i][2],
                    "yellow_avg": league_matchups[i][3],
                    "red_avg": league_matchups[i][4],
                    "time": league_matchups[i][5],
                }
                for i in range(1, min(len(league_matchups), 4))
            ],
        },
    ]

    # Per-league stat categories (with correct field names for frontend)
    stat_categories = LEAGUE_STAT_CATEGORIES.get(slug, LEAGUE_STAT_CATEGORIES["premier-league"])

    return {
        "league": league_info,
        "standings": standings,
        "fixtures": fixtures_groups,
        "categories": stat_categories,
        "stat_categories": stat_categories,
    }

def get_team_analytics(slug: str, venue: str = "all", history: str = "last_30") -> Dict[str, Any]:
    """Returns analytics, timeline match logs, and against stats for a team."""
    team_name = slug.replace("-", " ").title()
    if slug == "derby-county":
        team_name = "Derby County"

    match_history = [
        {"date": "03 Nov", "opponent": "Espanyol", "comp": "La Liga", "venue": "H", "result": "W", "score": "3-0", "min": 86, "rating": 8.6, "goals": 1, "assists": 1, "shots": 4, "sot": 2, "tackles": 2, "fouls_won": 4},
        {"date": "31 Oct", "opponent": "Real Madrid", "comp": "La Liga", "venue": "A", "result": "W", "score": "4-0", "min": 90, "rating": 9.2, "goals": 2, "assists": 1, "shots": 5, "sot": 3, "tackles": 1, "fouls_won": 3},
        {"date": "26 Oct", "opponent": "Bayern Munich", "comp": "Champions League", "venue": "H", "result": "W", "score": "4-1", "min": 90, "rating": 8.9, "goals": 1, "assists": 2, "shots": 3, "sot": 2, "tackles": 2, "fouls_won": 4},
        {"date": "20 Oct", "opponent": "Sevilla", "comp": "La Liga", "venue": "H", "result": "W", "score": "5-1", "min": 82, "rating": 8.8, "goals": 1, "assists": 1, "shots": 4, "sot": 2, "tackles": 2, "fouls_won": 4},
        {"date": "17 Oct", "opponent": "Alavés", "comp": "La Liga", "venue": "A", "result": "W", "score": "3-0", "min": 78, "rating": 8.5, "goals": 0, "assists": 1, "shots": 2, "sot": 1, "tackles": 1, "fouls_won": 2},
        {"date": "12 Oct", "opponent": "Young Boys", "comp": "Champions League", "venue": "H", "result": "W", "score": "5-0", "min": 90, "rating": 8.7, "goals": 1, "assists": 0, "shots": 4, "sot": 2, "tackles": 2, "fouls_won": 3},
        {"date": "10 Oct", "opponent": "Getafe", "comp": "La Liga", "venue": "H", "result": "W", "score": "1-0", "min": 90, "rating": 7.9, "goals": 0, "assists": 0, "shots": 3, "sot": 1, "tackles": 1, "fouls_won": 2},
        {"date": "06 Oct", "opponent": "Villarreal", "comp": "La Liga", "venue": "A", "result": "W", "score": "5-1", "min": 90, "rating": 9.0, "goals": 2, "assists": 1, "shots": 5, "sot": 3, "tackles": 1, "fouls_won": 4},
        {"date": "03 Oct", "opponent": "Monaco", "comp": "Champions League", "venue": "A", "result": "L", "score": "1-2", "min": 85, "rating": 7.4, "goals": 1, "assists": 0, "shots": 3, "sot": 2, "tackles": 1, "fouls_won": 3},
        {"date": "28 Sep", "opponent": "Girona", "comp": "La Liga", "venue": "A", "result": "W", "score": "4-1", "min": 90, "rating": 8.9, "goals": 1, "assists": 1, "shots": 4, "sot": 2, "tackles": 2, "fouls_won": 3},
        {"date": "20 Sep", "opponent": "Valladolid", "comp": "La Liga", "venue": "H", "result": "W", "score": "7-0", "min": 90, "rating": 9.5, "goals": 2, "assists": 3, "shots": 6, "sot": 4, "tackles": 1, "fouls_won": 5},
    ]

    return {
        "team": {
            "name": team_name,
            "slug": slug,
            "league": "Championship" if "derby" in slug or "bolton" in slug else "Premier League",
            "next_fixture": {
                "opponent": "Bolton Wanderers" if "derby" in slug else "Chelsea",
                "date": "TODAY 20:00",
                "is_today": True,
            },
        },
        "competitions": ["Championship", "FA Cup", "Carabao Cup"] if "derby" in slug else ["Premier League", "FA Cup", "Champions League"],
        "match_history": match_history,
        "team_stats": {
            "yellow_cards_total": 29,
            "red_cards_total": 1,
            "penalties_awarded": 3,
            "goals_scored": 27,
            "xg_per_game": 1.34,
            "xgot_per_game": 1.41,
            "possession_avg": 49.3,
        },
        "against_stats": {
            "passes_against_p90": 435.0,
            "shots_against_p90": 12.4,
            "key_passes_against_p90": 9.1,
            "yellow_cards_against_p90": 2.1,
            "red_cards_against_p90": 0.08,
            "fouls_committed_against_p90": 11.9,
            "fouls_drawn_against_p90": 11.1,
            "goal_involvements_against_p90": 1.25,
        },
    }

def get_player_profile_stats(player_id: str, started_only: bool = False, history: str = "last_75") -> Dict[str, Any]:
    """Returns player stats, 10-axis radar percentiles, and match timeline logs."""
    clean_id = player_id.lower().replace("-", " ")

    profiles = {
        "lamine-yamal": {
            "name": "Lamine Yamal", "position": "Midfielder", "club": "FC Barcelona", "country": "Spain", "flag": "\U0001f1ea\U0001f1f8", "age": 19,
            "photo": "https://images.fotmob.com/image_resources/playerimages/1504106.png",
            "radar": {"Goals": 88, "Assists": 94, "Shots": 82, "Shots on Target": 85, "Tackles": 74, "Duels Won": 78, "Fouls": 65, "Fouls Won": 92, "Key Passes": 96, "Dribbles": 95},
        },
        "kylian-mbappe": {
            "name": "Kylian Mbappéé", "position": "Forward", "club": "Real Madrid", "country": "France", "flag": "\U0001f1eb\U0001f1f7", "age": 27,
            "photo": "https://images.fotmob.com/image_resources/playerimages/737066.png",
            "radar": {"Goals": 98, "Assists": 86, "Shots": 96, "Shots on Target": 95, "Tackles": 40, "Duels Won": 72, "Fouls": 42, "Fouls Won": 85, "Key Passes": 88, "Dribbles": 94},
        },
        "jude-bellingham": {
            "name": "Jude Bellingham", "position": "Midfielder", "club": "Real Madrid", "country": "England", "flag": "\U0001f3f4\U000e0067\U000e0062\U000e0065\U000e006e\U000e0067\U000e007f", "age": 23,
            "photo": "https://images.fotmob.com/image_resources/playerimages/1077894.png",
            "radar": {"Goals": 92, "Assists": 89, "Shots": 88, "Shots on Target": 87, "Tackles": 84, "Duels Won": 90, "Fouls": 76, "Fouls Won": 88, "Key Passes": 91, "Dribbles": 89},
        },
        "vinicius-junior": {
            "name": "Vinícius Júnior", "position": "Forward", "club": "Real Madrid", "country": "Brazil", "flag": "\U0001f1e7\U0001f1f7", "age": 26,
            "photo": "https://images.fotmob.com/image_resources/playerimages/846035.png",
            "radar": {"Goals": 94, "Assists": 92, "Shots": 91, "Shots on Target": 89, "Tackles": 52, "Duels Won": 76, "Fouls": 58, "Fouls Won": 94, "Key Passes": 92, "Dribbles": 98},
        },
        "harry-kane": {
            "name": "Harry Kane", "position": "Forward", "club": "Bayern Munich", "country": "England", "flag": "\U0001f3f4\U000e0067\U000e0062\U000e0065\U000e006e\U000e0067\U000e007f", "age": 33,
            "photo": "https://images.fotmob.com/image_resources/playerimages/208443.png",
            "radar": {"Goals": 99, "Assists": 88, "Shots": 95, "Shots on Target": 96, "Tackles": 48, "Duels Won": 78, "Fouls": 55, "Fouls Won": 79, "Key Passes": 89, "Dribbles": 74},
        },
        "lionel-messi": {
            "name": "Lionel Messi", "position": "Forward", "club": "Inter Miami", "country": "Argentina", "flag": "\U0001f1e6\U0001f1f7", "age": 39,
            "photo": "https://images.fotmob.com/image_resources/playerimages/30981.png",
            "radar": {"Goals": 95, "Assists": 99, "Shots": 92, "Shots on Target": 94, "Tackles": 35, "Duels Won": 68, "Fouls": 30, "Fouls Won": 85, "Key Passes": 99, "Dribbles": 96},
        },
        "cristiano-ronaldo": {
            "name": "Cristiano Ronaldo", "position": "Forward", "club": "Al Nassr", "country": "Portugal", "flag": "\U0001f1f5\U0001f1f9", "age": 41,
            "photo": "https://images.fotmob.com/image_resources/playerimages/30893.png",
            "radar": {"Goals": 96, "Assists": 78, "Shots": 98, "Shots on Target": 96, "Tackles": 32, "Duels Won": 79, "Fouls": 48, "Fouls Won": 76, "Key Passes": 79, "Dribbles": 75},
        },
        "erling-haaland": {
            "name": "Erling Haaland", "position": "Attacker", "club": "Manchester City", "country": "Norway", "flag": "\U0001f1f3\U0001f1f4", "age": 26,
            "photo": "https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png",
            "radar": {"Goals": 99, "Assists": 72, "Shots": 99, "Shots on Target": 98, "Tackles": 42, "Duels Won": 88, "Fouls": 55, "Fouls Won": 70, "Key Passes": 74, "Dribbles": 76},
        },
        "bukayo-saka": {
            "name": "Bukayo Saka", "position": "Attacker", "club": "Arsenal", "country": "England", "flag": "\U0001f3f4\U000e0067\U000e0062\U000e0065\U000e006e\U000e0067\U000e007f", "age": 25,
            "photo": "https://resources.premierleague.com/premierleague/photos/players/250x250/p223340.png",
            "radar": {"Goals": 91, "Assists": 95, "Shots": 87, "Shots on Target": 88, "Tackles": 78, "Duels Won": 84, "Fouls": 62, "Fouls Won": 94, "Key Passes": 95, "Dribbles": 92},
        },
        "cole-palmer": {
            "name": "Cole Palmer", "position": "Midfielder", "club": "Chelsea", "country": "England", "flag": "\U0001f3f4\U000e0067\U000e0062\U000e0065\U000e006e\U000e0067\U000e007f", "age": 24,
            "photo": "https://resources.premierleague.com/premierleague/photos/players/250x250/p244851.png",
            "radar": {"Goals": 93, "Assists": 94, "Shots": 90, "Shots on Target": 89, "Tackles": 65, "Duels Won": 75, "Fouls": 52, "Fouls Won": 86, "Key Passes": 94, "Dribbles": 90},
        },
    }

    matched_key = None
    for k in profiles:
        if k in player_id.lower() or player_id.lower() in k or k.replace("-", " ") in clean_id:
            matched_key = k
            break

    if matched_key:
        p_data = profiles[matched_key]
        name = p_data["name"]
        position = p_data["position"]
        club = p_data["club"]
        country = p_data["country"]
        flag = p_data["flag"]
        age = p_data["age"]
        photo = p_data["photo"]
        radar = p_data["radar"]
    else:
        name = player_id.replace("-", " ").title()
        position = "Attacker"
        club = "World Football Club"
        country = "International"
        flag = "\U0001f30d"
        age = 24
        photo = "https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png"
        radar = {
            "Goals": 84, "Assists": 78, "Shots": 86, "Shots on Target": 80,
            "Tackles": 55, "Duels Won": 68, "Fouls": 50, "Fouls Won": 72,
            "Key Passes": 80, "Dribbles": 79,
        }

    competitions = ["League Competition", "Champions League", "National Cup", "International"]
    match_timeline = [
        {"date": "03 Nov", "opponent": "Espanyol", "comp": "League", "venue": "H", "result": "W", "score": "3-1", "min": 88, "rating": 8.7, "goals": 1, "assists": 1, "shots": 4, "sot": 2, "tackles": 2, "fouls_won": 4},
        {"date": "31 Oct", "opponent": "Real Madrid", "comp": "League", "venue": "A", "result": "W", "score": "2-1", "min": 90, "rating": 9.1, "goals": 2, "assists": 0, "shots": 5, "sot": 3, "tackles": 1, "fouls_won": 5},
        {"date": "26 Oct", "opponent": "Bayern Munich", "comp": "Champions League", "venue": "H", "result": "D", "score": "1-1", "min": 90, "rating": 7.8, "goals": 0, "assists": 1, "shots": 3, "sot": 1, "tackles": 3, "fouls_won": 3},
        {"date": "20 Oct", "opponent": "Sevilla", "comp": "League", "venue": "H", "result": "W", "score": "4-2", "min": 82, "rating": 8.8, "goals": 1, "assists": 1, "shots": 4, "sot": 2, "tackles": 2, "fouls_won": 4},
        {"date": "17 Oct", "opponent": "Alavés", "comp": "League", "venue": "A", "result": "W", "score": "3-0", "min": 78, "rating": 8.5, "goals": 0, "assists": 1, "shots": 2, "sot": 1, "tackles": 1, "fouls_won": 2},
        {"date": "12 Oct", "opponent": "Young Boys", "comp": "Champions League", "venue": "H", "result": "W", "score": "5-0", "min": 90, "rating": 8.7, "goals": 1, "assists": 0, "shots": 4, "sot": 2, "tackles": 2, "fouls_won": 3},
        {"date": "10 Oct", "opponent": "Getafe", "comp": "League", "venue": "H", "result": "W", "score": "1-0", "min": 90, "rating": 7.9, "goals": 0, "assists": 0, "shots": 3, "sot": 1, "tackles": 1, "fouls_won": 2},
        {"date": "06 Oct", "opponent": "Villarreal", "comp": "League", "venue": "A", "result": "W", "score": "5-1", "min": 90, "rating": 9.0, "goals": 2, "assists": 1, "shots": 5, "sot": 3, "tackles": 1, "fouls_won": 4},
    ]

    return {
        "player": {
            "id": player_id,
            "name": name,
            "position": position,
            "club": club,
            "country": country,
            "flag": flag,
            "age": age,
            "photo": photo,
        },
        "radar": radar,
        "competitions": competitions,
        "sample_size": history,
        "started_only": started_only,
        "match_history": match_timeline,
    }


# ── Nickname/alias mapping for fuzzy search ──
PLAYER_ALIASES = {
    "vini jr": "vinicius-junior",
    "vini": "vinicius-junior",
    "mbappe": "kylian-mbappe",
    "mbappé": "kylian-mbappe",
    "bellingham": "jude-bellingham",
    "yamal": "lamine-yamal",
    "fede": "federico-valverde",
    "valverde": "federico-valverde",
    "xavi": "xavi-simons",
    "simons": "xavi-simons",
    "davies": "alphonso-davies",
    "pedri": "pedri",
    "rodrygo": "rodrygo",
    "messi": "lionel-messi",
    "ronaldo": "cristiano-ronaldo",
    "cr7": "cristiano-ronaldo",
    "haaland": "erling-haaland",
    "saka": "bukayo-saka",
    "palmer": "cole-palmer",
    "salah": "mohamed-salah",
    "rice": "declan-rice",
    "isak": "alexander-isak",
    "odegaard": "martin-odegaard",
    "foden": "phil-foden",
    "kane": "harry-kane",
    "musiala": "jamal-musiala",
    "wirtz": "florian-wirtz",
    "lewandowski": "robert-lewandowski",
    "griezmann": "antoine-griezmann",
    "lautaro": "lautaro-martinez",
    "osimhen": "victor-osimhen",
    "kvara": "khvicha-kvaratskhelia",
    "kvaratskhelia": "khvicha-kvaratskhelia",
    "bruno": "bruno-fernandes",
}


def search_global_entities(query: str) -> Dict[str, Any]:
    """Provides structured autocomplete across world clubs and players."""
    q = query.strip().lower()

    all_players = [
        # Top Global Stars
        {"id": "kylian-mbappe", "name": "Kylian Mbappéé", "position": "Forward", "club": "Real Madrid", "country": "France", "photo": "https://images.fotmob.com/image_resources/playerimages/737066.png"},
        {"id": "jude-bellingham", "name": "Jude Bellingham", "position": "Midfielder", "club": "Real Madrid", "country": "England", "photo": "https://images.fotmob.com/image_resources/playerimages/1077894.png"},
        {"id": "lamine-yamal", "name": "Lamine Yamal", "position": "Midfielder", "club": "FC Barcelona", "country": "Spain", "photo": "https://images.fotmob.com/image_resources/playerimages/1504106.png"},
        {"id": "vinicius-junior", "name": "Vinícius Júnior", "position": "Forward", "club": "Real Madrid", "country": "Brazil", "photo": "https://images.fotmob.com/image_resources/playerimages/846035.png"},
        {"id": "harry-kane", "name": "Harry Kane", "position": "Forward", "club": "Bayern Munich", "country": "England", "photo": "https://images.fotmob.com/image_resources/playerimages/208443.png"},
        {"id": "lionel-messi", "name": "Lionel Messi", "position": "Forward", "club": "Inter Miami", "country": "Argentina", "photo": "https://images.fotmob.com/image_resources/playerimages/30981.png"},
        {"id": "cristiano-ronaldo", "name": "Cristiano Ronaldo", "position": "Forward", "club": "Al Nassr", "country": "Portugal", "photo": "https://images.fotmob.com/image_resources/playerimages/30893.png"},
        {"id": "robert-lewandowski", "name": "Robert Lewandowski", "position": "Forward", "club": "FC Barcelona", "country": "Poland", "photo": "https://images.fotmob.com/image_resources/playerimages/154297.png"},
        {"id": "antoine-griezmann", "name": "Antoine Griezmann", "position": "Forward", "club": "Atlético Madrid", "country": "France", "photo": "https://images.fotmob.com/image_resources/playerimages/166444.png"},
        {"id": "lautaro-martinez", "name": "Lautaro Martínez", "position": "Forward", "club": "Inter", "country": "Argentina", "photo": "https://images.fotmob.com/image_resources/playerimages/735624.png"},
        {"id": "victor-osimhen", "name": "Victor Osimhen", "position": "Forward", "club": "Galatasaray", "country": "Nigeria", "photo": "https://images.fotmob.com/image_resources/playerimages/754157.png"},
        {"id": "khvicha-kvaratskhelia", "name": "Khvicha Kvaratskhelia", "position": "Forward", "club": "Napoli", "country": "Georgia", "photo": "https://images.fotmob.com/image_resources/playerimages/1020286.png"},
        {"id": "pedri", "name": "Pedri", "position": "Midfielder", "club": "FC Barcelona", "country": "Spain", "photo": "https://images.fotmob.com/image_resources/playerimages/1082729.png"},
        {"id": "rodrygo", "name": "Rodrygo", "position": "Forward", "club": "Real Madrid", "country": "Brazil", "photo": "https://images.fotmob.com/image_resources/playerimages/896173.png"},
        {"id": "jamal-musiala", "name": "Jamal Musiala", "position": "Midfielder", "club": "Bayern Munich", "country": "Germany", "photo": "https://images.fotmob.com/image_resources/playerimages/1138243.png"},
        {"id": "florian-wirtz", "name": "Florian Wirtz", "position": "Midfielder", "club": "Bayer Leverkusen", "country": "Germany", "photo": "https://images.fotmob.com/image_resources/playerimages/1149467.png"},
        # Missing players added
        {"id": "federico-valverde", "name": "Federico Valverde", "position": "Midfielder", "club": "Real Madrid", "country": "Uruguay", "photo": "https://images.fotmob.com/image_resources/playerimages/857835.png"},
        {"id": "xavi-simons", "name": "Xavi Simons", "position": "Midfielder", "club": "RB Leipzig", "country": "Netherlands", "photo": "https://images.fotmob.com/image_resources/playerimages/1103498.png"},
        {"id": "alphonso-davies", "name": "Alphonso Davies", "position": "Defender", "club": "Bayern Munich", "country": "Canada", "photo": "https://images.fotmob.com/image_resources/playerimages/802498.png"},
        # Premier League Stars
        {"id": "erling-haaland", "name": "Erling Haaland", "position": "Attacker", "club": "Manchester City", "country": "Norway", "photo": "https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png"},
        {"id": "bukayo-saka", "name": "Bukayo Saka", "position": "Attacker", "club": "Arsenal", "country": "England", "photo": "https://resources.premierleague.com/premierleague/photos/players/250x250/p223340.png"},
        {"id": "cole-palmer", "name": "Cole Palmer", "position": "Midfielder", "club": "Chelsea", "country": "England", "photo": "https://resources.premierleague.com/premierleague/photos/players/250x250/p244851.png"},
        {"id": "mohamed-salah", "name": "Mohamed Salah", "position": "Attacker", "club": "Liverpool", "country": "Egypt", "photo": "https://resources.premierleague.com/premierleague/photos/players/250x250/p118748.png"},
        {"id": "declan-rice", "name": "Declan Rice", "position": "Midfielder", "club": "Arsenal", "country": "England", "photo": "https://resources.premierleague.com/premierleague/photos/players/250x250/p204480.png"},
        {"id": "alexander-isak", "name": "Alexander Isak", "position": "Attacker", "club": "Newcastle United", "country": "Sweden", "photo": "https://resources.premierleague.com/premierleague/photos/players/250x250/p219168.png"},
        {"id": "martin-odegaard", "name": "Martin Ødegaard", "position": "Midfielder", "club": "Arsenal", "country": "Norway", "photo": "https://resources.premierleague.com/premierleague/photos/players/250x250/p184029.png"},
        {"id": "phil-foden", "name": "Phil Foden", "position": "Midfielder", "club": "Manchester City", "country": "England", "photo": "https://resources.premierleague.com/premierleague/photos/players/250x250/p209244.png"},
        {"id": "bruno-fernandes", "name": "Bruno Fernandes", "position": "Midfielder", "club": "Manchester United", "country": "Portugal", "photo": "https://resources.premierleague.com/premierleague/photos/players/250x250/p141746.png"},
    ]

    all_teams = [
        {"slug": "real-madrid", "name": "Real Madrid", "league": "La Liga", "country": "Spain", "crest": "https://images.fotmob.com/image_resources/logo/teamlogo/8633.png"},
        {"slug": "fc-barcelona", "name": "FC Barcelona", "league": "La Liga", "country": "Spain", "crest": "https://images.fotmob.com/image_resources/logo/teamlogo/8634.png"},
        {"slug": "bayern-munich", "name": "Bayern Munich", "league": "Bundesliga", "country": "Germany", "crest": "https://images.fotmob.com/image_resources/logo/teamlogo/9823.png"},
        {"slug": "borussia-dortmund", "name": "Borussia Dortmund", "league": "Bundesliga", "country": "Germany", "crest": "https://images.fotmob.com/image_resources/logo/teamlogo/9789.png"},
        {"slug": "inter", "name": "Inter", "league": "Serie A", "country": "Italy", "crest": "https://images.fotmob.com/image_resources/logo/teamlogo/8636.png"},
        {"slug": "juventus", "name": "Juventus", "league": "Serie A", "country": "Italy", "crest": "https://images.fotmob.com/image_resources/logo/teamlogo/9885.png"},
        {"slug": "paris-saint-germain", "name": "Paris Saint-Germain", "league": "Ligue 1", "country": "France", "crest": "https://images.fotmob.com/image_resources/logo/teamlogo/9847.png"},
        {"slug": "inter-miami", "name": "Inter Miami", "league": "MLS", "country": "USA", "crest": "https://images.fotmob.com/image_resources/logo/teamlogo/1143804.png"},
        {"slug": "al-nassr", "name": "Al Nassr", "league": "Saudi Pro League", "country": "Saudi Arabia", "crest": "https://images.fotmob.com/image_resources/logo/teamlogo/102044.png"},
        {"slug": "ajax", "name": "Ajax", "league": "Eredivisie", "country": "Netherlands", "crest": "https://images.fotmob.com/image_resources/logo/teamlogo/8593.png"},
        {"slug": "arsenal", "name": "Arsenal", "league": "Premier League", "country": "England", "crest": "https://resources.premierleague.com/premierleague/badges/70/t3.png"},
        {"slug": "manchester-city", "name": "Manchester City", "league": "Premier League", "country": "England", "crest": "https://resources.premierleague.com/premierleague/badges/70/t43.png"},
        {"slug": "liverpool", "name": "Liverpool", "league": "Premier League", "country": "England", "crest": "https://resources.premierleague.com/premierleague/badges/70/t14.png"},
        {"slug": "chelsea", "name": "Chelsea", "league": "Premier League", "country": "England", "crest": "https://resources.premierleague.com/premierleague/badges/70/t8.png"},
        {"slug": "derby-county", "name": "Derby County", "league": "Championship", "country": "England", "crest": "https://images.fotmob.com/image_resources/logo/teamlogo/8658.png"},
        {"slug": "bolton-wanderers", "name": "Bolton Wanderers", "league": "Championship", "country": "England", "crest": "https://images.fotmob.com/image_resources/logo/teamlogo/8559.png"},
    ]

    # Check alias mapping first
    alias_id = PLAYER_ALIASES.get(q)

    # Direct name/club/id match + alias match
    matched_players = []
    seen_ids = set()
    for p in all_players:
        is_match = (
            q in p["name"].lower()
            or q in p["club"].lower()
            or q in p["id"]
            or (alias_id and p["id"] == alias_id)
        )
        if is_match and p["id"] not in seen_ids:
            matched_players.append(p)
            seen_ids.add(p["id"])

    matched_teams = [t for t in all_teams if q in t["name"].lower() or q in t["league"].lower()]

    return {
        "query": query,
        "players": matched_players[:8],
        "teams": matched_teams[:6],
    }
