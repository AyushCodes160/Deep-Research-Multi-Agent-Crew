import sys
import asyncio
import queue
from threading import Thread

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import save_report, get_all_reports, get_report_by_id

from crewai import Crew, Process
from agents import create_researcher, create_fact_checker, create_writer
from tasks import create_research_task, create_fact_check_task, create_write_task

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global queue to securely pass print statements from the Crew thread to the Async WebSocket
log_queue = queue.Queue()

class WebSocketStream(object):
    """A substitute for sys.stdout that writes to our log_queue"""
    def write(self, text):
        log_queue.put(text)
        sys.__stdout__.write(text) # Also print to terminal for debugging
    
    def flush(self):
        sys.__stdout__.flush()

def run_crew_in_thread(topic: str):
    """Runs the CrewAI process and captures its stdout."""
    original_stdout = sys.stdout
    sys.stdout = WebSocketStream()
    try:
        researcher = create_researcher()
        fact_checker = create_fact_checker()
        writer = create_writer()

        research_task = create_research_task(researcher, topic)
        fact_check_task = create_fact_check_task(fact_checker, topic)
        write_task = create_write_task(writer, topic)

        crew = Crew(
            agents=[researcher, fact_checker, writer],
            tasks=[research_task, fact_check_task, write_task],
            process=Process.sequential,
            verbose=True
        )
        
        result = crew.kickoff()
        
        # Save completed report to database
        report_text = str(result)
        save_report(topic, report_text)
        
        # Signal the end with a special keyword
        log_queue.put(f"\n[[FINAL_REPORT]]\n{report_text}")
    except Exception as e:
        log_queue.put(f"\n[[ERROR]]\n{str(e)}")
    finally:
        sys.stdout = original_stdout

class ResearchRequest(BaseModel):
    topic: str

@app.post("/api/research")
async def start_research(req: ResearchRequest):
    # Empty the queue from previous runs
    while not log_queue.empty():
        log_queue.get()
        
    log_queue.put("🚀 Starting Research Crew... Hold tight!\n")
    
    # Start Crew in a background thread so it doesn't block FastAPI's event loop
    Thread(target=run_crew_in_thread, args=(req.topic,)).start()
    return {"status": "started", "topic": req.topic}

@app.get("/api/reports")
async def list_reports():
    """Get all saved research reports."""
    return get_all_reports()

@app.get("/api/reports/{report_id}")
async def get_report(report_id: int):
    """Get a specific report by ID."""
    report = get_report_by_id(report_id)
    if not report:
        return {"error": "Report not found"}
    return report

@app.websocket("/ws/research")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Check the queue
            if not log_queue.empty():
                msg = log_queue.get()
                await websocket.send_text(msg)
            else:
                await asyncio.sleep(0.1) # Prevent blocking the event loop
    except WebSocketDisconnect:
        print("WebSocket client disconnected.")
