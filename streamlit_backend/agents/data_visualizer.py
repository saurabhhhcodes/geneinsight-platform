from langchain.agents import AgentExecutor, create_react_agent
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

def create_data_visualizer_agent(llm: ChatGoogleGenerativeAI):
    """Creates the Data Visualizer agent."""
    
    prompt = PromptTemplate.from_template(
        """
        You are a specialized Data Visualizer agent. Your role is to create plots and visualizations of biological data.
        
        TOOLS:
        ------
        You have access to the following tools:
        
        {tools}
        
        To use a tool, please use the following format:
        
        ```
        Thought: Do I need to use a tool? Yes
        Action: the action to take, should be one of [{tool_names}]
        Action Input: the input to the action
        Observation: the result of the action
        ```
        
        When you have a response to say to the Human, or if you do not need to use a tool, you MUST use the format:
        
        ```
        Thought: Do I need to use a tool? No
        Final Answer: [your response here]
        ```
        
        Begin!
        
        Previous conversation history:
        {chat_history}
        
        New input: {input}
        {agent_scratchpad}
        """
    )
    
    from streamlit_backend.tools.ramachandran import generate_ramachandran_plot
    
    tools = [generate_ramachandran_plot]
    
    agent = create_react_agent(llm, tools, prompt)
    return AgentExecutor(agent=agent, tools=tools, verbose=True)