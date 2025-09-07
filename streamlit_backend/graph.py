from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], operator.add]

def create_graph(genome_analyst, proteomics_specialist, data_visualizer):
    """Creates the multi-agent graph."""
    
    workflow = StateGraph(AgentState)

    workflow.add_node("genome_analyst", genome_analyst)
    workflow.add_node("proteomics_specialist", proteomics_specialist)
    workflow.add_node("data_visualizer", data_visualizer)

    workflow.set_entry_point("genome_analyst")

    # In a real application, you would define the conditional edges here
    # to route the conversation between the agents based on the context.
    workflow.add_edge("genome_analyst", END)
    workflow.add_edge("proteomics_specialist", END)
    workflow.add_edge("data_visualizer", END)

    return workflow.compile()