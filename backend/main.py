from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import requests
import os

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/analyze")
async def analyze_repos():
    """Read from result.csv and analyze with Deepseek"""
    # Read the CSV file
    df = pd.read_csv('result.csv')
    
    # Filter out suspicious repos (None values)
    df = df[df['created_at'].notna()]
    
    # Sort by creation date (newest first)
    df['created_at'] = pd.to_datetime(df['created_at'])
    df = df.sort_values('created_at', ascending=False)
    
    # Prepare data for Deepseek API
    repos = df.head(10).to_dict(orient='records')
    
    # Call Deepseek API (implementation would go here)
    # deepseek_results = call_deepseek(repos)
    
    return {
        "repos": repos,
        # "deepseek_analysis": deepseek_results
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
