import streamlit as st
import requests
import pandas as pd

st.set_page_config(layout="wide")

st.title("Swiss-Prot Analysis")

st.sidebar.header("Controls")
protein_id = st.sidebar.text_input("Enter UniProt Protein ID (e.g., P05067)")

if protein_id:
    with st.spinner("Fetching data from Swiss-Prot..."):
        url = f"https://www.uniprot.org/uniprot/{protein_id}.txt"
        try:
            response = requests.get(url)
            response.raise_for_status()  # Raise an exception for bad status codes
            st.text_area("Swiss-Prot Record", response.text, height=400)

            # Basic parsing to display some key information
            lines = response.text.split('\\n')
            data = {}
            for line in lines:
                if line.startswith("ID"):
                    data["ID"] = line.split()[1]
                elif line.startswith("AC"):
                    data["Accession"] = line.split()[1]
                elif line.startswith("DE   RecName: Full="):
                    data["Protein Name"] = line.split("=")[1].split("{")[0].strip()
                elif line.startswith("GN   Name="):
                    data["Gene Name"] = line.split("=")[1].split(";")[0].strip()
                elif line.startswith("OS"):
                    data["Organism"] = line.split("   ")[1].strip()

            if data:
                st.subheader("Summary")
                df = pd.DataFrame.from_dict(data, orient="index", columns=["Value"])
                st.table(df)

        except requests.exceptions.RequestException as e:
            st.error(f"Error fetching data: {e}")