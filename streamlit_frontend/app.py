import streamlit as st

st.set_page_config(layout="wide")

st.title("GeneInsight: AI-Powered Bioinformatics")

PAGES = {
    "Dashboard": "streamlit_frontend/pages/dashboard.py",
    "Advanced Analysis": "streamlit_frontend/pages/advanced_analysis.py",
    "Chat": "streamlit_frontend/pages/chat.py",
}

st.sidebar.title("Navigation")
selection = st.sidebar.radio("Go to", list(PAGES.keys()))

page = PAGES[selection]

# In a real application, you would use a more robust page loading mechanism.
with open(page) as f:
    exec(f.read())