import os
from anthropic import Anthropic

anthropic = Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

## Aunque no haya creditos, la funcionalidad de la API sigue funcionando
def generate_task_description(title: str) -> str:
    prompt = f"""
    You are an AI assistant that generates detailed task descriptions.
    Given a task title, create a comprehensive description that includes the purpose, steps, and expected

    '{title}'

    generate a detailed task description.
    - the description should be clear and actionable.
    - it should include the purpose of the task, the steps to complete it, and any expected outcomes.
    - the description should be concise but informative

    return the description as a string.TimeoutError
    """

    response = anthropic.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=200,
        messages=[
            {
            "role": "user", 
            "content": prompt
            }
        ]
    )

    return response.content[0].text.strip()

def summarize_pending_tasks(tasks: list) -> str:
    Task_list = "\n".join([f"- {task['title']}: {task.description or 'No Description'} (Status: {task['status']})" for task in tasks])
    
    prompt = f"""
    You are an AI assistant that summarizes pending tasks.
    Given a list of tasks, create a concise summary that highlights the key details of each task.

    Tasks:
    {Task_list}

    Generate a summary of the pending tasks.
    - the summary should be clear and concise.
    - it should include the title, description, and status of each task.
    - the summary should be easy to read and understand.

    return the summary as a string.
    """

    response = anthropic.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=200,
        messages=[
            {
            "role": "user", 
            "content": prompt
            }
        ]
    )

    return response.content[0].text.strip()

def suggest_priorities(tasks: list) -> list:
    task_list = "\n".join([f"- {task['title']}: {task.description or 'No Description'} (Status: {task['status']})" for task in tasks])

    prompt = f"""
    You are an AI assistant that suggests priorities for tasks.
    Given a list of tasks, analyze their details and suggest a priority order.

    Tasks:
    {task_list}

    Suggest a priority order for the tasks.
    - the suggestions should be based on the urgency and importance of each task.
    - return the tasks in order of priority, with the most important task first.
    - the response should be a list of task titles in order of priority.

    return the priority order as a list of strings.
    """
    response = anthropic.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=200,
        messages=[
            {
            "role": "user", 
            "content": prompt
            }
        ]
    )
    raw_output = response.content[0].text.strip()

    # simple parsing of the output
    priorities = []
    for line in raw_output.splitlines():
        if ":" in line:
            title, priority = line.split(":", 1)
            priorities.append({
                "task_title": title.strip("- ").strip(),
                "suggest_priorities": priority.strip()
            })
    return priorities