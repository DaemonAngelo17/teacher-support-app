import json
import csv
import io
import re

transcript_path = "/Users/ezrajosephsaracho/.gemini/antigravity-ide/brain/9a50776e-946c-45f9-9e9c-4fe42cb05dbb/.system_generated/logs/transcript_full.jsonl"

print("Reading transcript file...")
csv_text = None

# We read lines backwards or forwards to find the last occurrence of the pasted CSV data
with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        if '"type":"USER_INPUT"' in line and "Grade,Subject,Topic,Description" in line:
            obj = json.loads(line)
            content = obj.get("content", "")
            if "Grade,Subject,Topic,Description" in content:
                csv_text = content

if not csv_text:
    print("Error: CSV data not found in transcript logs.")
    exit(1)

print("Pasted CSV found. Starting parser...")

# Parse CSV
f_in = io.StringIO(csv_text)
reader = csv.reader(f_in)
header = next(reader) # skip header rows

topics = []

# Map subject strings to our matching slugs
subject_map = {
    "science": "science",
    "math": "math",
    "mathematics": "math",
    "social studies": "social",
    "social": "social",
    "english": "english",
    "filipino": "filipino"
}

for row in reader:
    if not row or len(row) < 3:
        continue
    
    grade_str = row[0].strip()
    subject_str = row[1].strip().lower()
    topic_name = row[2].strip()
    description = row[3].strip() if len(row) > 3 else ""
    
    # Extract resources if any are present in columns 4, 5, 6
    resources = []
    for i in range(4, min(len(row), 7)):
        res_url = row[i].strip()
        if res_url and res_url.startswith("http"):
            label = "Reference Link"
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
            
    # Extract grade level number
    grade_match = re.search(r'\d+', grade_str)
    grade = int(grade_match.group()) if grade_match else 1
    
    subject = subject_map.get(subject_str, "science")
    
    # Generate a unique slug ID
    clean_topic = re.sub(r'[^a-zA-Z0-9]', '', topic_name).lower()[:15]
    topic_id = f"{subject}-g{grade}-{clean_topic}-{len(topics)}"
    
    if not description:
        description = f"Study and explore the learning objectives for {topic_name}."
        
    # Generate core concepts list based on parenthetical details in topics if any
    concepts = [f"Understand the main principles of {topic_name}."]
    paren_match = re.search(r'\((.*?)\)', topic_name)
    if paren_match:
        items = [x.strip() for x in paren_match.group(1).split(",")]
        for item in items[:4]:
            if item:
                concepts.append(f"Describe the role and characteristics of: {item}.")
    
    # Create 3 default review items for Classroom Quiz/Flashcards
    review_items = [
        {
            "question": f"What is the key objective of studying: {topic_name}?",
            "answer": f"To gain structural understanding and list core functions of: {topic_name}."
        },
        {
            "question": f"True or False: This topic builds essential grade-level competencies in {subject_str.capitalize()}.",
            "answer": "True. It matches standard curriculum criteria."
        },
        {
            "question": "Can you name an important item or detail associated with this topic?",
            "answer": f"Yes, a central detail is: {concepts[1] if len(concepts) > 1 else topic_name}."
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

print(f"Successfully compiled {len(topics)} topics!")

# Format output as JS array
js_content = "const curriculumData = " + json.dumps(topics, indent=2) + ";\n\n"
js_content += """// Export data for ESM or attach to window for simple browser scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = curriculumData;
} else {
  window.curriculumData = curriculumData;
}
"""

with open("data.js", "w", encoding="utf-8") as f_out:
    f_out.write(js_content)

print("Data saved successfully in data.js!")
