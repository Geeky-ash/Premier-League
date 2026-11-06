"""Master training script for all Premier League ML modules."""

from pathlib import Path
from models.train_transfer_model import train_transfer_model, save_transfer_bundle
from models.train_match_model import train_match_model, save_match_bundle
from models.train_scouting_model import train_scouting_model, save_scouting_bundle

def train_and_serialize_all() -> None:
    print("--- 1. Training Transfer Value Predictor ---")
    p_pipeline, p_metrics = train_transfer_model()
    p_path = save_transfer_bundle(p_pipeline, p_metrics)
    print(f"Transfer model saved to: {p_path} (MAE: {p_metrics['test_mae']:.2f})")

    print("\n--- 2. Training Match Outcome Predictor ---")
    m_model, m_metrics = train_match_model()
    m_path = save_match_bundle(m_model, m_metrics)
    print(f"Match model saved to: {m_path} (Accuracy: {m_metrics['test_accuracy']:.2f})")

    print("\n--- 3. Training Player Scouting System ---")
    k_model, s_scaler, p_pca, a_df, s_metrics = train_scouting_model()
    s_path = save_scouting_bundle(k_model, s_scaler, p_pca, a_df, s_metrics)
    print(f"Scouting model saved to: {s_path} (Silhouette: {s_metrics['silhouette_score']:.3f})")

    print("\nAll models successfully trained and serialized.")

if __name__ == "__main__":
    train_and_serialize_all()
