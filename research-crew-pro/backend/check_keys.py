import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_community.tools.tavily_search import TavilySearchResults

load_dotenv()

def test_keys():
    print("Testing Tavily...")
    try:
        search_tool = TavilySearchResults(max_results=1)
        res = search_tool.invoke("test")
        print("Tavily: SUCCESS")
    except Exception as e:
        print(f"Tavily Error: {e}")

    print("Testing Groq...")
    try:
        llm = ChatGroq(model_name="llama3-8b-8192")
        res = llm.invoke("Say hi")
        print("Groq: SUCCESS")
    except Exception as e:
        print(f"Groq Error: {e}")

if __name__ == "__main__":
    test_keys()
