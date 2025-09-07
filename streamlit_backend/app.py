import streamlit as st
import requests
import json

st.set_page_config(layout="wide")

st.title("GeneInsight: AI-Powered Bioinformatics")
st.markdown("An intelligent platform for automated genomics and proteomics research.")

# --- Main Application ---

col1, col2 = st.columns([2, 1])

with col1:
    st.header("Conversational AI Agent")
    st.markdown("Interact with the multi-agent system to perform complex bioinformatics tasks.")

    if 'chat_history' not in st.session_state:
        st.session_state.chat_history = []

    for chat in st.session_state.chat_history:
        with st.chat_message(chat["role"]):
            st.markdown(chat["content"])

    prompt = st.chat_input("What would you like to analyze?")
    if prompt:
        st.session_state.chat_history.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.spinner("Thinking..."):
            try:
                response = requests.post("http://127.0.0.1:8000/api/chat", json={"message": prompt})
                if response.ok:
                    data = response.json()
                    st.session_state.chat_history.append({"role": "assistant", "content": data["response"]})
                    with st.chat_message("assistant"):
                        st.markdown(data["response"])
                else:
                    st.error("Failed to get a response from the backend.")
            except requests.exceptions.RequestException as e:
                st.error(f"Could not connect to the backend: {e}")

with col2:
    st.header("Analysis Results")
    st.markdown("View the results of your analyses here.")

    # Placeholder for results
    st.info("Results will be displayed here.")
