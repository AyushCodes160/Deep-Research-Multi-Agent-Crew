import os
from crewai import Agent
from langchain_groq import ChatGroq
from langchain_community.tools.tavily_search import TavilySearchResults
from dotenv import load_dotenv

load_dotenv()

# Initialize the Free Groq LLM (e.g., Llama 3)
# Note: Requires GROQ_API_KEY in the .env file
groq_llm = ChatGroq(
    temperature=0.5,
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama3-8b-8192" # Free and extremely fast
)

# Initialize the Tavily Search Tool (1000 free searches/mo)
# Note: Requires TAVILY_API_KEY in the .env file
search_tool = TavilySearchResults(max_results=5)

def create_researcher():
    return Agent(
        role='Senior Research Analyst',
        goal='Uncover cutting-edge developments and thorough information on the given topic.',
        backstory='You work at a leading tech think tank. Your expertise lies in finding hidden insights, identifying trends, and gathering comprehensive data using search engines.',
        verbose=True,
        allow_delegation=False,
        tools=[search_tool],
        llm=groq_llm
    )

def create_fact_checker():
    return Agent(
        role='Meticulous Fact-Checker',
        goal='Validate the research gathered for hallucinations, contradictions, and accuracy.',
        backstory='You are a seasoned auditor renowned for your extreme attention to detail. You review raw research, cross-reference claims, and guarantee completely reliable and truthful outputs.',
        verbose=True,
        allow_delegation=False,
        llm=groq_llm
    )

def create_writer():
    return Agent(
        role='Tech Writer / Synthesizer',
        goal='Synthesize the verified research into a professional, compelling, and cited Markdown report.',
        backstory='You are a renowned technical writer known for transforming complex facts into clear, engaging, and perfectly structured reports. You excel at Markdown formatting.',
        verbose=True,
        allow_delegation=False,
        llm=groq_llm
    )
