from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, Literal
import operator
from langchain_core.messages import BaseMessage, HumanMessage
from streamlit_backend.agents.master_agent import create_master_agent

class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], operator.add]
    next: Literal["genome_analyst", "proteomics_specialist", "data_visualizer", "master_agent"]

def create_graph(genome_analyst, proteomics_specialist, data_visualizer, master_agent):
    """Creates the multi-agent graph."""
    
    workflow = StateGraph(AgentState)

    workflow.add_node("genome_analyst", genome_analyst)
    workflow.add_node("proteomics_specialist", proteomics_specialist)
    workflow.add_node("data_visualizer", data_visualizer)
    workflow.add_node("master_agent", master_agent)

    workflow.set_entry_point("master_agent")

    def router(state):
        last_message = state["messages"][-1]
        # This is a simplified router. In a real application, you would use a
        # more sophisticated method to determine the next agent.
        if "genome" in last_message.content.lower():
            return "genome_analyst"
        elif "protein" in last_message.content.lower():
            return "proteomics_specialist"
        elif "plot" in last_message.content.lower() or "visualize" in last_message.content.lower():
            return "data_visualizer"
        else:
            return END

    workflow.add_conditional_edges(
        "master_agent",
        router,
        {
            "genome_analyst": "genome_analyst",
            "proteomics_specialist": "proteomics_specialist",
            "data_visualizer": "data_visualizer",
            END: END,
        },
    )
    
    workflow.add_edge("genome_analyst", END)
    workflow.add_edge("proteomics_specialist", END)
    workflow.add_edge("data_visualizer", END)

    return workflow.compile()