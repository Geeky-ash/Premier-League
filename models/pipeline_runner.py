"""Orchestration script to populate 100-player and 100-match datasets and train all ML models."""

import json
import random
from pathlib import Path
import numpy as np
import pandas as pd

from data_ingestion.clean_pipeline import clean_player_stats, clean_match_fixtures
from models.train_transfer_model import train_transfer_model, save_transfer_bundle
from models.train_match_model import train_match_model, save_match_bundle
from models.train_scouting_model import train_scouting_model, save_scouting_bundle

PROJECT_ROOT = Path(__file__).resolve().parent.parent

def populate_rich_datasets() -> None:
    random.seed(42)
    roles = ["FW", "MF", "DF", "GK"]
    clubs = [
        "Manchester City", "Arsenal", "Liverpool", "Aston Villa",
        "Tottenham Hotspur", "Chelsea", "Newcastle United",
        "Manchester United", "West Ham United", "Crystal Palace"
    ]

    star_names = [
        ("Erling Haaland", "Manchester City", 24, "FW", 2560, 31, 27, 5, 112, 76.5, 22, 9, 42, 180.0),
        ("Bukayo Saka", "Arsenal", 23, "FW", 2930, 35, 16, 12, 98, 82.4, 68, 38, 18, 140.0),
        ("Mohamed Salah", "Liverpool", 32, "FW", 2840, 32, 21, 13, 105, 78.9, 45, 21, 12, 65.0),
        ("Martin Ødegaard", "Arsenal", 25, "MF", 3010, 35, 8, 10, 74, 86.8, 41, 47, 15, 110.0),
        ("Rodri", "Manchester City", 28, "MF", 2935, 34, 8, 9, 62, 92.3, 34, 74, 58, 130.0),
        ("Declan Rice", "Arsenal", 25, "MF", 3220, 38, 7, 8, 50, 91.1, 29, 83, 49, 120.0),
        ("Bruno Fernandes", "Manchester United", 30, "MF", 3120, 35, 10, 8, 94, 79.2, 42, 61, 20, 65.0),
        ("Cole Palmer", "Chelsea", 22, "MF", 2820, 33, 22, 11, 109, 83.1, 52, 29, 11, 90.0),
        ("Son Heung-min", "Tottenham Hotspur", 32, "FW", 2940, 35, 17, 10, 85, 81.5, 44, 19, 9, 45.0),
        ("Alexander Isak", "Newcastle United", 25, "FW", 2260, 30, 21, 2, 78, 75.3, 40, 12, 24, 75.0),
        ("William Saliba", "Arsenal", 23, "DF", 3420, 38, 2, 1, 12, 92.4, 11, 76, 65, 80.0),
        ("Virgil van Dijk", "Liverpool", 33, "DF", 3150, 36, 2, 2, 29, 91.5, 4, 72, 124, 30.0),
        ("Trent Alexander-Arnold", "Liverpool", 26, "DF", 2400, 28, 3, 9, 42, 80.6, 21, 54, 19, 70.0),
        ("Ollie Watkins", "Aston Villa", 28, "FW", 3225, 37, 19, 13, 108, 74.0, 38, 18, 44, 65.0),
        ("Phil Foden", "Manchester City", 24, "MF", 2860, 35, 19, 8, 106, 88.2, 51, 31, 12, 150.0),
        ("Alexis Mac Allister", "Liverpool", 25, "MF", 2600, 33, 5, 5, 46, 87.6, 31, 88, 32, 75.0),
        ("Jarrod Bowen", "West Ham United", 27, "FW", 2870, 34, 16, 6, 81, 75.1, 46, 26, 21, 50.0),
        ("Micky van de Ven", "Tottenham Hotspur", 23, "DF", 2210, 27, 3, 0, 9, 94.8, 18, 58, 34, 55.0),
        ("Douglas Luiz", "Aston Villa", 26, "MF", 3000, 35, 9, 5, 48, 89.2, 25, 69, 23, 70.0),
        ("Anthony Gordon", "Newcastle United", 23, "FW", 2900, 35, 11, 10, 75, 79.5, 58, 49, 17, 60.0),
        ("Gabriel Magalhães", "Arsenal", 26, "DF", 3060, 36, 4, 0, 26, 89.1, 7, 68, 82, 75.0),
        ("Joao Palhinha", "Fulham", 29, "MF", 2800, 33, 4, 1, 32, 83.2, 15, 152, 62, 55.0),
        ("Eberechi Eze", "Crystal Palace", 26, "MF", 2050, 27, 11, 4, 77, 83.9, 72, 28, 14, 60.0),
        ("Pedro Porro", "Tottenham Hotspur", 25, "DF", 3050, 35, 3, 7, 51, 80.2, 38, 98, 31, 45.0),
        ("David Raya", "Arsenal", 29, "GK", 2880, 32, 0, 0, 0, 74.3, 2, 15, 34, 35.0),
        ("Alisson Becker", "Liverpool", 31, "GK", 2520, 28, 0, 0, 0, 82.5, 1, 8, 19, 28.0),
        ("Ederson", "Manchester City", 31, "GK", 2780, 33, 0, 0, 0, 85.1, 2, 11, 14, 35.0),
        ("Matheus Cunha", "Wolverhampton Wanderers", 25, "FW", 2450, 32, 12, 7, 72, 77.4, 61, 34, 21, 45.0),
        ("Lucas Paquetá", "West Ham United", 27, "MF", 2620, 31, 4, 6, 50, 80.8, 54, 78, 45, 65.0),
        ("Destiny Udogie", "Tottenham Hotspur", 21, "DF", 2400, 28, 2, 3, 20, 86.4, 39, 80, 38, 45.0),
    ]

    players = []
    for idx, (name, club, age, pos, mins, apps, g, a, s, pc, dr, tk, ae, mv) in enumerate(star_names, 1):
        players.append({
            "player_id": idx, "name": name, "club": club, "age": age, "position": pos,
            "minutes_played": mins, "appearances": apps, "goals": g, "assists": a,
            "shots": s, "pass_completion": pc, "dribbles": dr, "tackles_interceptions": tk,
            "aerial_duels_won": ae, "market_value_eur_m": mv
        })

    for i in range(31, 121):
        pos = roles[i % 4]
        age = random.randint(20, 33)
        mins = random.randint(1200, 3200)
        apps = max(12, int(mins / 85))
        if pos == "FW":
            g = random.randint(5, 22)
            a = random.randint(2, 11)
            s = random.randint(40, 100)
            pc = round(random.uniform(73, 83), 1)
            dr = random.randint(28, 68)
            tk = random.randint(10, 28)
            ae = random.randint(12, 45)
            mv = round(max(10.0, g * 4.2 + a * 2.5 + (35 - age) * 2.0 + random.uniform(-3, 3)), 1)
        elif pos == "MF":
            g = random.randint(2, 10)
            a = random.randint(3, 13)
            s = random.randint(25, 75)
            pc = round(random.uniform(83, 93), 1)
            dr = random.randint(22, 55)
            tk = random.randint(42, 98)
            ae = random.randint(15, 50)
            mv = round(max(8.0, (g + a) * 3.5 + (pc - 75) * 1.5 + (34 - age) * 1.8 + random.uniform(-3, 3)), 1)
        elif pos == "DF":
            g = random.randint(0, 3)
            a = random.randint(0, 5)
            s = random.randint(5, 25)
            pc = round(random.uniform(84, 94), 1)
            dr = random.randint(6, 25)
            tk = random.randint(58, 110)
            ae = random.randint(40, 100)
            mv = round(max(6.0, tk * 0.42 + ae * 0.2 + (34 - age) * 1.8 + random.uniform(-3, 3)), 1)
        else:
            g, a, s = 0, 0, 0
            pc = round(random.uniform(72, 85), 1)
            dr = random.randint(0, 3)
            tk = random.randint(5, 18)
            ae = random.randint(15, 35)
            mv = round(max(5.0, (pc - 68) * 1.2 + (35 - age) * 1.2 + random.uniform(-3, 3)), 1)
        players.append({
            "player_id": i, "name": f"PL Player {i}", "club": clubs[i % len(clubs)],
            "age": age, "position": pos, "minutes_played": mins, "appearances": apps,
            "goals": g, "assists": a, "shots": s, "pass_completion": pc, "dribbles": dr,
            "tackles_interceptions": tk, "aerial_duels_won": ae, "market_value_eur_m": mv
        })

    # Save raw and processed players
    with open(PROJECT_ROOT / "data" / "raw" / "raw_players.json", "w", encoding="utf-8") as f:
        json.dump({"players": players}, f, indent=2)

    clean_p = clean_player_stats(pd.DataFrame(players))
    clean_p.to_csv(PROJECT_ROOT / "data" / "processed" / "cleaned_players.csv", index=False)
    print(f"Generated and persisted {len(clean_p)} players.")

    # Match dataset (120 matches)
    matches = []
    match_id = 2001
    for i in range(len(clubs)):
        for j in range(len(clubs)):
            if i == j or len(matches) >= 120:
                continue
            h_team = clubs[i]
            a_team = clubs[j]
            h_goals = random.choices([0, 1, 2, 3, 4], weights=[0.15, 0.35, 0.30, 0.15, 0.05])[0]
            a_goals = random.choices([0, 1, 2, 3], weights=[0.25, 0.40, 0.25, 0.10])[0]
            if h_goals > a_goals:
                res = "H"
            elif h_goals < a_goals:
                res = "A"
            else:
                res = "D"
            h_shots = max(h_goals + random.randint(4, 15), 5)
            a_shots = max(a_goals + random.randint(3, 12), 3)
            h_sot = min(h_shots, max(h_goals, int(h_shots * random.uniform(0.3, 0.6))))
            a_sot = min(a_shots, max(a_goals, int(a_shots * random.uniform(0.3, 0.6))))
            h_poss = random.randint(35, 70)
            a_poss = 100 - h_poss

            matches.append({
                "match_id": match_id,
                "date": f"2023-10-{(len(matches) % 28) + 1:02d}",
                "home_team": h_team,
                "away_team": a_team,
                "home_goals": h_goals,
                "away_goals": a_goals,
                "full_time_result": res,
                "home_shots": h_shots,
                "away_shots": a_shots,
                "home_shots_on_target": h_sot,
                "away_shots_on_target": a_sot,
                "home_possession": h_poss,
                "away_possession": a_poss,
                "home_form_points_last_5": random.randint(3, 15),
                "away_form_points_last_5": random.randint(2, 14),
            })
            match_id += 1

    with open(PROJECT_ROOT / "data" / "raw" / "raw_matches.json", "w", encoding="utf-8") as f:
        json.dump({"matches": matches}, f, indent=2)

    clean_m = clean_match_fixtures(pd.DataFrame(matches))
    clean_m.to_csv(PROJECT_ROOT / "data" / "processed" / "cleaned_matches.csv", index=False)
    print(f"Generated and persisted {len(clean_m)} match fixtures.")

def train_and_save_all() -> None:
    print("\n--- Training Model 1: Transfer Value Predictor ---")
    p_pipe, p_met = train_transfer_model()
    save_transfer_bundle(p_pipe, p_met)
    print(f"Transfer Model -> Test MAE: {p_met['test_mae']:.2f}, R2: {p_met['test_r2']:.3f}")

    print("\n--- Training Model 2: Match Outcome Predictor ---")
    m_clf, m_met = train_match_model()
    save_match_bundle(m_clf, m_met)
    print(f"Match Model -> Test Accuracy: {m_met['test_accuracy']:.2f}")

    print("\n--- Training Model 3: Player Scouting K-Means ---")
    k_mod, s_scal, p_pca, a_df, s_met = train_scouting_model()
    save_scouting_bundle(k_mod, s_scal, p_pca, a_df, s_met)
    print(f"Scouting Model -> Silhouette Score: {s_met['silhouette_score']:.3f}")

if __name__ == "__main__":
    populate_rich_datasets()
    train_and_save_all()
