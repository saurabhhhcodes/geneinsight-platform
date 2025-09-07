from langchain.agents import AgentExecutor, create_react_agent
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

def create_master_agent(llm: ChatGoogleGenerativeAI):
    """Creates the Master agent."""
    
    prompt = PromptTemplate.from_template(
        """
        You are the Master agent. Your role is to orchestrate the other agents to achieve the user's goal.
        
        You have access to the following specialized agents:
        - Genome Analyst: For tasks related to genome sequencing and annotation.
        - Proteomics Specialist: For tasks related to proteomics and protein structure analysis.
        - Data Visualizer: For creating plots and visualizations.
        
        Based on the user's request, you must delegate the necessary tasks to the appropriate agent.
        
        Begin!
        
        New input: {input}
        {agent_scratchpad}
        """
    )
    
    # In a real application, the tools would be the other agents.
    tools = []
    
    agent = create_react_agent(llm, tools, prompt)
    return AgentExecutor(agent=agent, tools=tools, verbose=True)