from langchain.tools import tool
import requests

@tool
def fetch_swiss_prot_data(protein_id: str) -> dict:
    """
    Fetches protein data from the Swiss-Prot database (UniProt).
    """
    url = f"https://www.uniprot.org/uniprot/{protein_id}.json"
    response = requests.get(url)
    if response.ok:
        return response.json()
    else:
        return {"error": "Failed to fetch protein data"}