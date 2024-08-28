import json
import os

try:
    # Load project data with UTF-8 encoding
    with open('js/project-data.json', 'r', encoding='utf-8') as f:
        projects_data = json.load(f)

    # Load template with UTF-8 encoding
    with open('project-template.html', 'r', encoding='utf-8') as f:
        template = f.read()

    def create_project_folder(project_id):
        # Create folder if it doesn't exist
        if not os.path.exists(project_id):
            os.makedirs(project_id)

        # Create index.html file
        file_path = os.path.join(project_id, 'index.html')
        project_name = projects_data[project_id]['name']
        file_content = template.format(project_name=project_name)
        
        # Write file with UTF-8 encoding
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(file_content)

        print(f"Created folder and index.html for project: {project_id}")

    # Create folders and files for each project
    for project_id in projects_data:
        create_project_folder(project_id)

    print("Project pages generated successfully.")

except FileNotFoundError as e:
    print(f"Error: File not found. {e}")
    print("Make sure 'js/project-data.json' and 'project-template.html' exist in the correct locations.")

except json.JSONDecodeError as e:
    print(f"Error: Invalid JSON in project-data.json. {e}")

except UnicodeDecodeError as e:
    print(f"Error: Unable to decode the file. {e}")
    print("Ensure that project-data.json is saved with UTF-8 encoding.")

except Exception as e:
    print(f"An unexpected error occurred: {e}")