from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/langserve-health")
def health():
    return {
        "status": "UP",
        "service": "GeneInsight LangServe",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "platform": "Vercel Serverless"
    }

# Vercel serverless handler
def handler(request):
    return app(request)
