from fastapi import FastAPI
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from streamlit_backend.agents.genome_analyst import create_genome_analyst_agent
from streamlit_backend.agents.proteomics_specialist import create_proteomics_specialist_agent
from streamlit_backend.agents.data_visualizer import create_data_visualizer_agent
from streamlit_backend.agents.master_agent import create_master_agent
from streamlit_backend.graph import create_graph
import os

app = FastAPI()

# --- Agent Initialization ---
gemini_api_key = os.environ.get("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("Gemini API key not found. Please set the GEMINI_API_KEY environment variable.")

llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=gemini_api_key)

genome_analyst = create_genome_analyst_agent(llm)
proteomics_specialist = create_proteomics_specialist_agent(llm)
data_visualizer = create_data_visualizer_agent(llm)
master_agent = create_master_agent(llm)

graph = create_graph(genome_analyst, proteomics_specialist, data_visualizer, master_agent)

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
def chat(request: ChatRequest):
    response = graph.invoke({"messages": [("user", request.message)]})
    return {"response": response["messages"][-1].content}

@app.get("/")
def read_root():
    return {"message": "Hello from the GeneInsight API!"}