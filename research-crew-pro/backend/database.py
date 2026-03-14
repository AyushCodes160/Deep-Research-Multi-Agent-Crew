import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "research_history.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Create the reports table if it doesn't exist."""
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            report TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def save_report(topic: str, report: str):
    """Save a completed research report."""
    conn = get_connection()
    conn.execute(
        "INSERT INTO reports (topic, report, created_at) VALUES (?, ?, ?)",
        (topic, report, datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()

def get_all_reports():
    """Get all past reports, newest first."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, topic, report, created_at FROM reports ORDER BY id DESC"
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_report_by_id(report_id: int):
    """Get a single report by ID."""
    conn = get_connection()
    row = conn.execute(
        "SELECT id, topic, report, created_at FROM reports WHERE id = ?",
        (report_id,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None

# Initialize the database on import
init_db()
