"""Root entrypoint proxy forwarding to frontend/app.py."""
import sys
from pathlib import Path

# Add root directory to sys.path
ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from frontend_streamlit.app import main

if __name__ == "__main__":
    main()
