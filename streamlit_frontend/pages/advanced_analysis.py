import streamlit as st
import requests
import json
import pandas as pd

st.header("Advanced Analysis Tools")

# --- Ramachandran Plot ---
st.subheader("Ramachandran Plot")
pdb_file = st.file_uploader("Upload a PDB file", type=["pdb"])
if pdb_file is not None:
    pdb_content = pdb_file.read().decode("utf-8")
    if st.button("Generate Ramachandran Plot"):
        with st.spinner("Generating plot..."):
            try:
                response = requests.post("http://127.0.0.1:8000/api/advanced-analysis", json={"tool": "ramachandran-plot", "data": {"pdb_content": pdb_content}})
                if response.ok:
                    data = response.json()["data"]
                    df = pd.DataFrame(data)
                    st.vega_lite_chart(df, {
                        "mark": {"type": "point", "tooltip": True},
                        "encoding": {
                            "x": {"field": "phi", "type": "quantitative", "scale": {"domain": [-180, 180]}},
                            "y": {"field": "psi", "type": "quantitative", "scale": {"domain": [-180, 180]}},
                        },
                    })
                else:
                    st.error("Failed to generate plot.")
            except requests.exceptions.RequestException as e:
                st.error(f"Could not connect to the backend: {e}")

# --- Swiss-Prot ---
st.subheader("Swiss-Prot Analysis")
protein_id = st.text_input("Enter a UniProtKB accession number (e.g., P05067)")
if st.button("Fetch Protein Data"):
    with st.spinner("Fetching data..."):
        try:
            response = requests.post("http://127.0.0.1:8000/api/advanced-analysis", json={"tool": "swiss-prot", "data": {"protein_id": protein_id}})
            if response.ok:
                data = response.json()["data"]
                st.json(data)
            else:
                st.error("Failed to fetch data.")
        except requests.exceptions.RequestException as e:
            st.error(f"Could not connect to the backend: {e}")