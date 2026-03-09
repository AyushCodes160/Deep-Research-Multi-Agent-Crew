from crewai import Task

def create_research_task(agent, topic):
    return Task(
        description=f'Conduct comprehensive research on the topic: "{topic}". Use the search tool to find at least 4 different sources. Gather facts, statistics, and current trends.',
        expected_output='A detailed compilation of raw research notes covering everything discovered about the topic, including specific bullet points and contexts.',
        agent=agent
    )

def create_fact_check_task(agent, topic):
    return Task(
        description=f'Review the research notes gathered on "{topic}". Verify the claims made. Identify any contradictions or potential hallucinations. If anything seems wrong or unverified, note it.',
        expected_output='A cleaned, verified set of facts and data points that are 100% accurate and ready for synthesis. Any unverified claims should be explicitly marked.',
        agent=agent
    )

def create_write_task(agent, topic):
    return Task(
        description=f'Using the verified research for "{topic}", write a professional final report in Markdown. It must include an Introduction, Detailed Findings, and a Conclusion.',
        expected_output='A perfectly formatted Markdown document containing the finalized, highly readable, and structured report.',
        agent=agent
    )
