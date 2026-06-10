# Corporate Training Portal

A comprehensive, state-of-the-art corporate training and assessment platform designed to help students prepare for placements, practice aptitude, solve coding challenges, and participate in AI-powered mock interviews.

---

## 📂 Directory Structure

The `CorporateTraining` folder is structured as follows:

*   **`backend/`**: Express & Node.js API server, database models, seeds, and authentication logic.
*   **`frontend/`**: The client-facing Web application built with responsive HTML5, Vanilla JavaScript, and styled with Vanilla CSS/TailwindCSS utilities.
*   **`image/`**: Static image assets and profile pictures.

---

## 🖥️ Student Portal Pages & Features

### 1. Student Dashboard (`student-dashboard.html`)
The main landing page for students after logging in. It serves as a central navigation hub and progress tracker.
*   **Required Components & Content**:
    *   **Welcome Banner**: Greets the student by their name and displays their profile photo.
    *   **Progress Summary Panel**: Displays statistics such as total tests attempted, average score percentage, and rank.
    *   **Quick Action Cards**: Direct buttons to **Start Aptitude** or **Start Technical** practice.
    *   **Recent Activity Feed**: Lists recent attempts (last test taken, date, and score).
    *   **Upcoming Scheduled Tests / Deadlines**: Shows tests that are assigned to the student or coming up.
    *   **Leaderboard Preview**: Displays the top 3 ranking students along with the logged-in student's own rank.
    *   **Completion Badges**: Lists gamified achievement badges earned by completing milestones.
    *   **Notification Bell**: Dropdown indicating new tests assigned or results that are ready.

### 2. Quantitative & Reasoning Tests (`student-aptitude.html`)
The main repository for aptitude assessments.
*   **Content & Features**:
    *   Dynamic listing of all active Quantitative, Verbal, and Reasoning tests.
    *   Direct click-to-start action on each test card.
    *   Difficulty badges (Easy, Medium, Hard) and total duration indicators.

### 3. Technical MCQ Hub (`student-technical.html` & `technical-hub.html`)
Focuses on computer science core disciplines.
*   **Content & Features**:
    *   Displays tests grouped under technical subjects (e.g., DBMS, Operating Systems, Computer Networks, OOPs).
    *   Presents test syllabus, total questions, and passing score requirement.

### 4. Coding Problems (`student-coding.html`)
A database of interactive coding challenges.
*   **Content & Features**:
    *   Filterable challenge list by difficulty (Easy, Medium, Hard) and status (Solved, Unsolved).
    *   Displays stats like submission counts and acceptance rates.

### 5. Coding Playground & Editor (`coding-editor.html`)
The code editor workspace.
*   **Content & Features**:
    *   **Left Pane**: Problem description, input/output formats, constraints, and test cases.
    *   **Right Pane**: Full-featured code editor with syntax highlighting, language selector (JavaScript, Python, C++, Java), and keyboard shortcut helpers.
    *   **Console Output**: Logs output for running code against custom inputs and testing sample cases.

### 6. AI Mock Interview Setup (`student-interview-setup.html`)
Configure your AI placement interviews.
*   **Content & Features**:
    *   Select preferred job role (e.g., Software Engineer, Frontend Developer, Data Analyst).
    *   Set experience level and target company profile.
    *   Prompts verification of webcam and microphone inputs before starting.

### 7. AI Mock Interview Session (`student-interview-session.html`)
The live video/audio interview screen.
*   **Content & Features**:
    *   Live video feed of the student.
    *   AI interviewer voice synthesizer and transcript reader.
    *   Speech-to-text integration that transcribes the student's spoken answers in real-time.
    *   Progress indicator tracking current question number out of total.

### 8. AI Mock Interview Results (`student-interview-result.html`)
Detailed performance summary of the AI interview.
*   **Content & Features**:
    *   Overall mock interview score and key behavioral metrics.
    *   Detailed feedback on communication clarity, grammar, confidence, and relevance of answers.
    *   Full question-and-answer transcript with inline improvement suggestions.

### 9. Examination Reports (`student-results.html`)
The complete record of the student's performance.
*   **Content & Features**:
    *   Chronological list of all completed mock tests, MCQs, and coding challenges.
    *   Search and filter by category (Aptitude, Technical, Coding) and score.
    *   Direct links to view full answers and explanations.

### 10. Test Start Landing (`test-start.html`)
The rules and preview screen before opening a test.
*   **Content & Features**:
    *   Displays test details: duration, question count, scoring scheme, and negative marking configurations.
    *   Acceptance checkbox of honor code/instructions before unlocking the active test.

### 11. Active Exam Console (`take-test.html`)
The secure, timed exam environment.
*   **Content & Features**:
    *   **Sidebar**: Question palette grid (color-coded for Answered, Skipped, Marked for Review, and Unvisited).
    *   **Main Console**: Active question details, radio selection buttons, clear answer option, and mark-for-review toggle.
    *   **Sticky Header**: Live countdown timer that triggers auto-submit when it reaches zero.

### 12. Detailed Test Results (`test-result.html`)
The feedback screen immediately after submitting a test.
*   **Content & Features**:
    *   Pass/Fail status banner with a score percentage.
    *   Breakdown of Correct, Incorrect, and Skipped questions.
    *   Scrollable list of all questions showing selected answers, correct answers, and thorough explanations.

### 13. Global Leaderboard (`student-leaderboard.html`)
A gamified dashboard of student rankings.
*   **Content & Features**:
    *   Ranked table showing student profile initials, names, scores, and test counts.
    *   Search by student name or filter rankings by branch/year.

### 14. Student Profile (`student-profile.html`)
User settings and stats page.
*   **Content & Features**:
    *   View/edit personal profile details (Name, College, Branch, Year).
    *   Placement stats overview showing total preparation hours, tests, and coding challenges solved.

---

## 🛠️ Admin Portal Pages & Features

### 1. Admin Dashboard (`admin-dashboard.html`)
The command center for instructors and administrators.
*   **Content & Features**:
    *   Total counters for active tests, questions pool, coding problems, and registered students.
    *   Quick actions shortcuts: Add Test, Create MCQ, Add Coding Challenge.

### 2. Tests Repository (`admin-tests.html`)
Overview of created exams.
*   **Content & Features**:
    *   Tabulated list of all created tests with columns for category, time limit, question count, and creator details.
    *   Action options to toggle active status (Active/Inactive) or permanently delete tests.

### 3. Advanced Test Builder (`admin-test-create.html`)
Create customized assessments.
*   **Content & Features**:
    *   Forms for name, descriptions, time limits, and category tags.
    *   Configuration for negative marking, dynamic rule-based questions, and option shuffling.
    *   Interactive selector to assign questions from the question pool.

### 4. Questions Pool (`admin-questions.html`)
The database of all MCQs.
*   **Content & Features**:
    *   Searchable questions repository filterable by category, subcategory, and difficulty.
    *   Option to edit, clone, or delete questions.
    *   **Bulk CSV Import** section for uploading questions.

### 5. Add MCQ (`admin-question-create.html`)
mcq creation panel.
*   **Content & Features**:
    *   Fields to select category, input the question text, define multiple choices, specify the correct choice, and provide a text explanation.

### 6. Coding Problems Repository (`admin-coding.html`)
List of all coding challenges.
*   **Content & Features**:
    *   View all system coding problems with their code boilerplate and test cases.

### 7. Add Coding Challenge (`admin-coding-create.html`)
Create coding problems.
*   **Content & Features**:
    *   Forms for name, description, constraints, and test cases.
    *   Boilerplate editors to provide starter code templates for different languages.

### 8. Technical MCQs List (`admin-technical-mcq.html` & `admin-technical-mcq-create.html`)
Manage subjects in core CS.
*   **Content & Features**:
    *   View, edit, and create multiple-choice questions belonging to Core Computer Science categories.

### 9. Mock Interview Logs (`admin-interviews.html`)
Instructor review panel for AI interviews.
*   **Content & Features**:
    *   Lists student interview submissions with date, selected role, and final AI score.
    *   Inspect individual student transcriptions, audio answers, and details.

### 10. Category Directory (`admin-categories.html`)
Structure subjects and topics.
*   **Content & Features**:
    *   Create and edit parent categories and nested subcategories.

### 11. Results Log (`admin-results.html`)
Detailed log of all student score sheets.
*   **Content & Features**:
    *   List of all exam submissions, including student information, test name, score, percentage, and passing status.

### 12. Student Management (`admin-students.html`)
Manage student access and view profiles.
*   **Content & Features**:
    *   Database of registered students with college details, and a delete account shortcut.

### 13. Performance Analytics (`admin-analytics.html`)
Analytical charts.
*   **Content & Features**:
    *   Visual graphs of student performance averages, pass rates, and subject-wise metrics.

---

## 🔑 Authentication Pages

*   **`login.html`**: Login form validating user credentials. Saves secure JWT token to local storage and routes to the appropriate dashboard (Admin or Student).
*   **`register.html`**: Student onboarding form gathering profile fields (Name, Email, Password, College name, Branch, and Graduation year).
*   **`forgot-password.html`**: Initiates password recovery.
*   **`index.html`**: Root redirect helper that verifies active sessions and handles route forwarding.
