import json
import csv
import os
import re

csv_filename = "topics.csv"
output_filename = "data.js"

if not os.path.exists(csv_filename):
    print(f"Error: {csv_filename} not found in current directory.")
    print(f"Please save your Google Sheet export as '{csv_filename}' inside the teacher-support-app folder.")
    exit(1)

print(f"Loading and parsing {csv_filename}...")

topics = []

# Subject mapping
subject_map = {
    "science": "science",
    "math": "math",
    "mathematics": "math",
    "social studies": "social",
    "social": "social",
    "araling panlipunan": "social",
    "english": "english",
    "filipino": "filipino"
}

with open(csv_filename, "r", encoding="utf-8-sig", errors="ignore") as f_in:
    reader = csv.reader(f_in)
    header = next(reader, None) # skip header row
    
    for row in reader:
        if not row or len(row) < 3:
            continue
        
        grade_str = row[0].strip()
        subject_str = row[1].strip().lower()
        topic_name = row[2].strip()
        
        if not topic_name:
            continue
            
        description = row[3].strip() if len(row) > 3 else ""
        
        # Extract optional resources from extra columns
        resources = []
        for i in range(4, len(row)):
            res_url = row[i].strip()
            if res_url and res_url.startswith("http"):
                label = "Resource Link"
                res_type = "video"
                if "youtube" in res_url or "youtu.be" in res_url:
                    label = "Video Lesson"
                    res_type = "video"
                elif "pdf" in res_url:
                    label = "Worksheet PDF"
                    res_type = "worksheet"
                elif "phet" in res_url:
                    label = "Interactive Simulation"
                    res_type = "simulation"
                
                resources.append({
                    "type": res_type,
                    "label": label,
                    "url": res_url
                })
        
        # Extract grade number (1 to 12)
        grade_match = re.search(r'\d+', grade_str)
        grade = int(grade_match.group()) if grade_match else 1
        
        subject = subject_map.get(subject_str, "science")
        
        # Generate slug ID
        clean_topic = re.sub(r'[^a-zA-Z0-9]', '', topic_name).lower()[:15]
        topic_id = f"{subject}-g{grade}-{clean_topic}-{len(topics)}"
        
        if not description:
            description = f"Study and explore the key learning objectives of {topic_name}."
            
        # Extract core concepts
        concepts = [f"Understand the main principles of {topic_name}."]
        paren_match = re.search(r'\((.*?)\)', topic_name)
        if paren_match:
            items = [x.strip() for x in paren_match.group(1).split(",")]
            for item in items[:4]:
                if item:
                    concepts.append(f"Explore the details of: {item}.")
        
        # Default review set
        review_items = [
            {
                "question": f"What is the key objective of studying: {topic_name}?",
                "answer": description
            },
            {
                "question": f"True or False: This topic is a core standard for Grade {grade} {subject.capitalize()}.",
                "answer": "True. It matches curriculum criteria."
            },
            {
                "question": "Name an important detail or term related to this topic.",
                "answer": f"A key detail is: {concepts[1] if len(concepts) > 1 else topic_name}."
            }
        ]
        
        topics.append({
            "id": topic_id,
            "subject": subject,
            "grade": grade,
            "topic": topic_name,
            "description": description,
            "coreConcepts": concepts,
            "resources": resources,
            "reviewItems": review_items
        })

print(f"Successfully compiled all {len(topics)} topics from {csv_filename}!")

# Write output to data.js
js_content = "const curriculumData = " + json.dumps(topics, indent=2) + ";\n\n"
js_content += """// Export data for ESM or attach to window for simple browser scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = curriculumData;
} else {
  window.curriculumData = curriculumData;
}
"""

with open(output_filename, "w", encoding="utf-8") as f_out:
    f_out.write(js_content)

print(f"Dataset saved to {output_filename}!")
