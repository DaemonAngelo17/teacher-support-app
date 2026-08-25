# EduCore Hub - Academic Review Teacher Support Workspace

**EduCore Hub** is an interactive Single-Page Web Application designed specifically for academic review teachers, tutors, and educators. It provides an organized, searchable repository of **4,294 curriculum topics** spanning **Grades 1 through 12** across five core academic subjects.

---

## 🌟 Key Features

* 📚 **Complete K-12 Curriculum Database**: Contains 4,294 structured topic entries for **Science, Mathematics, Social Studies (Araling Panlipunan), English, and Filipino**.
* 🔍 **Instant Search & Multi-Level Filtering**: Search topics instantly by keyword or filter by specific subjects and grade levels (Grades 1 to 12).
* 🔗 **Curated Teaching Resources**: Inside each topic, teachers can access curated links for video lessons, downloadable PDF worksheets, lesson plans, and interactive simulations.
* 🎴 **Classroom Review Tools**:
  * **3D Interactive Flashcards**: Hardware-accelerated card-flipping interface for live classroom discussions.
  * **Interactive Quick Quiz**: Assessment mode with instant answer toggles and class scoring counters.
* ✏️ **Curriculum Creation & Editing Workspace**: Built-in modal editors to create new topics, modify learning objectives, manage dynamic resource links, and delete obsolete entries.
* 📝 **Teacher Notes & Custom Links Workspace**: Auto-saved local storage scratchpad for custom teaching notes and supplementary web links.
* 🌙 **Modern Glassmorphic UI**: Sleek dark and light mode toggle, curated subject color palettes, and fully responsive layouts for desktop, tablet, and mobile.

---

## 🛠️ Technology Stack

* **Frontend**: Vanilla HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3 (Custom Variables & Glassmorphism)
* **Storage**: Browser `localStorage` with in-memory dataset sync fallback
* **Server**: Zero external dependencies — runs locally via any standard static web server (e.g., Python `http.server`)

---

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DaemonAngelo17/teacher-support-app.git
   cd teacher-support-app
   ```

2. **Run a local server**:
   ```bash
   python3 -m http.server 8000
   ```

3. **Open in your browser**:
   Navigate to `http://localhost:8000/index.html`
