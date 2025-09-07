import streamlit as st
import os
from langchain_google_genai import ChatGoogleGenerativeAI

st.title("GeneInsight Backend")
st.write("This is the Streamlit user interface for the GeneInsight application.")

# --- Gemini API Integration ---

# Get the API key from Streamlit secrets
gemini_api_key = st.secrets.get("GEMINI_API_KEY")

if not gemini_api_key:
    st.error("Gemini API key not found. Please add it to your Streamlit secrets.")
else:
    try:
        # Initialize the LangChain chat model
        llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=gemini_api_key)

        st.header("Chat with Gemini")
        
        # Get user input
        user_prompt = st.text_input("Ask a question about genomics:")

        if user_prompt:
            with st.spinner("Thinking..."):
                # Invoke the model
                response = llm.invoke(user_prompt)
                st.write("### Answer")
                st.write(response.content)

    except Exception as e:
        st.error(f"An error occurred while initializing the AI model: {e}")
