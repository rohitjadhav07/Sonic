"""
Vercel serverless function for NFT generation
"""
import sys
import os
import json

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), '..', '..', 'backend')
sys.path.insert(0, backend_path)

from main import app
from fastapi import Request
from fastapi.responses import JSONResponse

async def handler(request: Request):
    """Handle NFT generation requests"""
    try:
        # Get request body
        body = await request.json()
        
        # Call the NFT generation endpoint
        response = await app.post("/api/nft/generate")(body)
        
        return JSONResponse(
            content=response,
            status_code=200
        )
    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )
