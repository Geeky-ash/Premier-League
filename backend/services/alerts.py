"""In-Play Alerts & Telegram / Email Notification Engine (backend/services/alerts.py).

Provides automated multi-channel alert delivery for in-play events,
including foul breaches, card thresholds, and matchday incidents.
"""

import logging
import os
import smtplib
from datetime import datetime, timezone
from email.mime.text import MIMEText
from typing import Any, Dict, List, Optional
import uuid

import requests

logger = logging.getLogger("premier_league_alerts")

# In-memory storage for active alert subscriptions
ACTIVE_FOUL_SUBSCRIPTIONS: List[Dict[str, Any]] = []

# Notification log
ALERT_DISPATCH_LOG: List[Dict[str, Any]] = []


def send_telegram_alert(
    chat_id: str,
    message: str,
    bot_token: Optional[str] = None,
) -> Dict[str, Any]:
    """Dispatches a notification message via Telegram Bot API or mock simulation.

    Args:
        chat_id: Telegram Chat ID or channel ID.
        message: Text content (Markdown / HTML supported).
        bot_token: Optional bot token; falls back to TELEGRAM_BOT_TOKEN environment variable.

    Returns:
        Dict[str, Any]: Delivery status report.
    """
    token = bot_token or os.getenv("TELEGRAM_BOT_TOKEN")
    timestamp = datetime.now(timezone.utc).isoformat()

    if not token or token == "MOCK_TOKEN" or token == "":
        logger.info(
            "[Telegram Alert Simulated] To: %s | Message: %s",
            chat_id,
            message[:80],
        )
        record = {
            "alert_id": str(uuid.uuid4()),
            "channel": "telegram",
            "status": "simulated_success",
            "chat_id": chat_id,
            "message": message,
            "timestamp": timestamp,
            "provider_response": "Simulated telegram delivery (no token configured).",
        }
        ALERT_DISPATCH_LOG.append(record)
        return record

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "Markdown",
    }

    try:
        resp = requests.post(url, json=payload, timeout=8)
        resp_json = resp.json()
        status = "success" if resp.status_code == 200 else "error"
        record = {
            "alert_id": str(uuid.uuid4()),
            "channel": "telegram",
            "status": status,
            "chat_id": chat_id,
            "message": message,
            "timestamp": timestamp,
            "provider_response": resp_json,
        }
        ALERT_DISPATCH_LOG.append(record)
        return record
    except Exception as exc:
        logger.error("Failed to dispatch Telegram alert to %s: %s", chat_id, exc)
        record = {
            "alert_id": str(uuid.uuid4()),
            "channel": "telegram",
            "status": "connection_error",
            "chat_id": chat_id,
            "message": message,
            "timestamp": timestamp,
            "provider_response": str(exc),
        }
        ALERT_DISPATCH_LOG.append(record)
        return record


def send_email_alert(
    recipient: str,
    subject: str,
    body: str,
) -> Dict[str, Any]:
    """Dispatches an alert via SMTP or fallback simulation."""
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    timestamp = datetime.now(timezone.utc).isoformat()

    if not smtp_host or not smtp_user:
        logger.info("[Email Alert Simulated] To: %s | Subject: %s", recipient, subject)
        record = {
            "alert_id": str(uuid.uuid4()),
            "channel": "email",
            "status": "simulated_success",
            "recipient": recipient,
            "subject": subject,
            "timestamp": timestamp,
        }
        ALERT_DISPATCH_LOG.append(record)
        return record

    try:
        msg = MIMEText(body, "html")
        msg["Subject"] = subject
        msg["From"] = smtp_user
        msg["To"] = recipient

        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass or "")
            server.send_message(msg)

        record = {
            "alert_id": str(uuid.uuid4()),
            "channel": "email",
            "status": "success",
            "recipient": recipient,
            "subject": subject,
            "timestamp": timestamp,
        }
        ALERT_DISPATCH_LOG.append(record)
        return record
    except Exception as exc:
        logger.error("Failed to send email to %s: %s", recipient, exc)
        record = {
            "alert_id": str(uuid.uuid4()),
            "channel": "email",
            "status": "error",
            "recipient": recipient,
            "subject": subject,
            "timestamp": timestamp,
            "error": str(exc),
        }
        ALERT_DISPATCH_LOG.append(record)
        return record


def register_foul_subscription(
    chat_id: str,
    threshold: int,
    player_name: Optional[str] = None,
    match_id: Optional[str] = None,
    email: Optional[str] = None,
) -> Dict[str, Any]:
    """Subscribes a user/chat to foul alerts exceeding a threshold."""
    sub_id = f"sub_{uuid.uuid4().hex[:8]}"
    subscription = {
        "subscription_id": sub_id,
        "chat_id": chat_id,
        "email": email,
        "foul_threshold": threshold,
        "player_name": player_name or "ANY_PLAYER",
        "match_id": match_id or "ALL_MATCHES",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "active": True,
    }
    ACTIVE_FOUL_SUBSCRIPTIONS.append(subscription)
    logger.info("Registered foul subscription: %s", subscription)
    return subscription


def evaluate_foul_incident(
    player_name: str,
    club: str,
    fouls: int,
    minute: int,
    match_str: str,
    referee_name: str = "Anthony Taylor",
) -> List[Dict[str, Any]]:
    """Evaluates live fouls against all active subscriptions and fires triggers."""
    dispatched = []

    for sub in ACTIVE_FOUL_SUBSCRIPTIONS:
        if not sub.get("active", True):
            continue

        target_p = sub.get("player_name", "ANY_PLAYER")
        threshold = sub.get("foul_threshold", 2)

        # Match player condition
        if target_p != "ANY_PLAYER" and target_p.lower() not in player_name.lower():
            continue

        # Check threshold breach
        if fouls >= threshold:
            msg = (
                f"🚨 *PREMIER LEAGUE IN-PLAY FOUL ALERT* 🚨\n\n"
                f"⚽ *Match*: {match_str}\n"
                f"👤 *Player*: {player_name} ({club})\n"
                f"⚠️ *Fouls Committed*: *{fouls}* (Threshold: {threshold})\n"
                f"⏱️ *Match Minute*: {minute}'\n"
                f"⚖️ *Referee*: {referee_name}\n\n"
                f"📊 _Simulated via Premier League Analytics Platform_"
            )

            res = send_telegram_alert(sub["chat_id"], msg)
            dispatched.append(res)

            if sub.get("email"):
                send_email_alert(
                    sub["email"],
                    f"[PL Alert] {player_name} reached {fouls} fouls in {match_str}",
                    msg.replace("\n", "<br>"),
                )

    return dispatched


def get_all_subscriptions() -> List[Dict[str, Any]]:
    """Returns active alert subscriptions."""
    return ACTIVE_FOUL_SUBSCRIPTIONS


def get_dispatch_history(limit: int = 50) -> List[Dict[str, Any]]:
    """Returns recently dispatched alerts."""
    return ALERT_DISPATCH_LOG[-limit:]
