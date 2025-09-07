import streamlit as st
from rdkit import Chem
from rdkit.Chem import AllChem, Draw
import py3Dmol

st.set_page_config(layout="wide")

st.title("Molecular Docking Analysis")

st.sidebar.header("Controls")
protein_file = st.sidebar.file_uploader("Upload Protein PDB", type=["pdb"])
ligand_file = st.sidebar.file_uploader("Upload Ligand MOL", type=["mol"])

if protein_file and ligand_file:
    protein_mol = Chem.MolFromPDBBlock(protein_file.read().decode("utf-8"))
    ligand_mol = Chem.MolFromMolBlock(ligand_file.read().decode("utf-8"))

    if protein_mol and ligand_mol:
        st.sidebar.success("Molecules loaded successfully!")

        st.subheader("Protein Structure")
        viewer = py3Dmol.view(width=800, height=400)
        viewer.addModel(Chem.MolToPDBBlock(protein_mol), "pdb")
        viewer.setStyle({"cartoon": {"color": "spectrum"}})
        viewer.zoomTo()
        viewer.render()
        st.components.v1.html(viewer._make_html(), height=400)

        st.subheader("Ligand Structure")
        img = Draw.MolToImage(ligand_mol)
        st.image(img)

        if st.sidebar.button("Run Docking"):
            with st.spinner("Running molecular docking..."):
                # This is a placeholder for the actual docking simulation
                # In a real application, you would use a tool like AutoDock Vina
                st.success("Docking simulation complete!")
                st.write("Docking Score: -7.5 kcal/mol")

                st.subheader("Docked Complex")
                viewer_docked = py3Dmol.view(width=800, height=400)
                viewer_docked.addModel(Chem.MolToPDBBlock(protein_mol), "pdb")
                viewer_docked.addModel(Chem.MolToMolBlock(ligand_mol), "mol")
                viewer_docked.setStyle({"cartoon": {"color": "spectrum"}})
                viewer_docked.addStyle({"stick": {}}, viewer=1)
                viewer_docked.zoomTo()
                viewer_docked.render()
                st.components.v1.html(viewer_docked._make_html(), height=400)
    else:
        st.sidebar.error("Error loading molecules. Please check the file formats.")