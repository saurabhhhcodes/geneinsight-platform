from langchain.tools import tool
import requests
import pandas as pd

@tool
def search_uniprot(query: str) -> dict:
    """
    Searches UniProt for a given query and returns a list of protein IDs.
    """
    url = f"https://www.uniprot.org/uniprot/?query={query}&format=list"
    response = requests.get(url)
    if response.ok:
        return {"protein_ids": response.text.splitlines()}
    else:
        return {"error": "Failed to search UniProt"}

@tool
def fetch_swiss_prot_data(protein_id: str) -> dict:
    """
    Fetches protein data from the Swiss-Prot database (UniProt) in JSON format.
    """
    url = f"https://www.uniprot.org/uniprot/{protein_id}.json"
    response = requests.get(url)
    if response.ok:
        return response.json()
    else:
        return {"error": "Failed to fetch protein data"}

@tool
def parse_swiss_prot_data(protein_data: dict) -> pd.DataFrame:
    """
    Parses the JSON data from a Swiss-Prot record and extracts key information.
    """
    summary_data = {
        "ID": protein_data.get("id"),
        "Accession": protein_data.get("accession"),
        "Protein Name": protein_data.get("proteinDescription", {}).get("recommendedName", {}).get("fullName", {}).get("value"),
        "Gene Name": protein_data.get("gene", [{}])[0].get("name", {}).get("value"),
        "Organism": protein_data.get("organism", {}).get("scientificName"),
        "Length": protein_data.get("sequence", {}).get("length"),
        "Mass": protein_data.get("sequence", {}).get("mass"),
    }
    df = pd.DataFrame.from_dict(summary_data, orient="index", columns=["Value"])
    return df