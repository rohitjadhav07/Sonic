"""
Vercel serverless function entry point for FastAPI backend
"""
import sys
import os

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

from main import app

# This is the entry point for Vercel
handler = app
