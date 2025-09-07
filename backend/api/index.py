"""
Vercel serverless function entry point for FastAPI backend
"""
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from main import app

# This is the entry point for Vercel
handler = app
