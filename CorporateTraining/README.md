# Corporate Training Portal — OIT_STACK

A comprehensive, full-stack corporate training and assessment platform that helps students prepare for placements via aptitude tests, technical MCQs, coding challenges, and AI-powered mock interviews. Built with **Node.js / Express** on the backend and **HTML5 + Vanilla JS + TailwindCSS** on the frontend.

---

## 📂 Directory Structure

```
CorporateTraining/
├── backend/              Node.js / Express API server
│   ├── config/           Environment variables and DB config
│   ├── controllers/      Route handlers (auth, tests, questions, …)
│   ├── middleware/        Auth guard, rate-limiting, error handler
│   ├── models/           Mongoose schemas (User, Test, Question, …)
│   ├── routes/           Express routers
│   ├── utils/            JWT generation, email sender, API helpers
│   └── server.js         Entry point
└── frontend/             Client-facing web application
    ├── css/              Shared stylesheets (auth.css, profile.css)
    ├── image/            Static image assets and profile pictures
    ├── api.js            Centralised fetch wrapper with auth & retry
    └── *.html            All application pages (listed below)
```

---

## 🔐 Authentication Pages

### `login.html` — Sign In
- Proper email regex validation (`/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`)
- **Remember Me** — persists email in `localStorage`, pre-fills on return
- **Failed-attempt counter** tracked in `sessionStorage`; warning shown after each failure; submitting blocked at 5 failures
- **Role-aware redirect** → `admin-dashboard.html` for admins, `student-dashboard.html` for students, with safe fallback for unknown roles
- Inline SVG password visibility toggle (no Lucide re-render cost)
- Dismiss-able toast notifications with slide-in animation
- `autocomplete="email"` and `autocomplete="current-password"` attributes
- `?session=expired` and `?registered=1` URL-param banners
- Session-expired detection with toast message

### `register.html` — Create Account (2-step)
**Step 1 — Credentials:**
- Full name (min 2 chars)
- Email (full regex, rejects weak values like `a@` or `@b`)
- Phone number (10–15 digit validation, supports `+91` prefix)
- Password with live **4-segment strength bar** (checks length, uppercase, number, symbol) — minimum 8 characters
- Confirm password match check
- Inline SVG password toggles for both fields

**Step 2 — Profile:**
- College / Organisation (text input, `autocomplete="organization"`)
- Branch / Department (9-option dropdown including Data Science & AI)
- Current Year + Passout Year (dynamically populated ±5 years from today)
- Location (with `autocomplete="address-level2"`)
- **Terms & Conditions checkbox** — blocks form submission if unchecked
- Role-aware redirect after successful registration

**Shared features:**
- Step indicators on left panel update as user progresses
- Back button in Step 2 preserves all Step 1 data
- All fields have `role="alert"` error paragraphs and `required` attributes
- Dismiss-able toast with slide-in animation
- `api.js?v=3` cache-busting

### `forgot-password.html` — Password Recovery
- Email input to trigger a password reset email
- Backend sends a 30-minute tokenised reset link
- Confirmation toast on success

### `index.html` — Root Redirect
- Checks for an active JWT token in `localStorage`
- Routes authenticated users to their dashboard (admin or student)
- Redirects unauthenticated users to `login.html`

---

## 🖥️ Student Portal Pages & Features

### 1. `student-dashboard.html` — Student Home
The central navigation hub and progress tracker shown immediately after login.
- **Progress Summary** — tests attempted, average score %, current rank
- **Quick Action Cards** — Start Aptitude / Start Technical (with direct links)
- **Recent Activity Feed** — last 5 tests with name, date, and score
- **Upcoming Scheduled Tests** — tests with future start dates, sorted by date
- **Leaderboard Preview** — top 3 students + logged-in student's own rank
- **Completion Badges** — gamified milestone badges (First Test, Perfect Score, etc.)
- **Dynamic Notification Bell** — loaded from API; new test assigned, result ready
- **Parallel API loading** — `Promise.all` for dashboard, results, leaderboard
- **Error UI** — full-page error block with Retry button on any API failure
- **AbortController timeout** (15 s) on all fetches
- Auto-logout on expired token (redirects to `login.html?session=expired`)

### 2. `student-aptitude.html` — Aptitude & Reasoning Tests
- Full-width **table layout** for active tests (100% width rows)
- Columns: #, Title, Description, Level, Quiz Date, Start Time, End Time
- **Ended tests section** below with additional "Obtained Marks" column
- **Client-side pagination** — 25 rows per page for ended tests with Prev/Next controls
- Difficulty badges (Easy / Medium / Hard) with colour coding
- Direct "Start Test" button navigates to `test-start.html?id=…`
- API query filters by `type=aptitude` so only aptitude tests appear

### 3. `student-technical.html` & `technical-hub.html` — Technical MCQ Hub
- Tests grouped under core CS subjects (DBMS, OS, Networks, OOPs, etc.)
- Displays test syllabus, total questions, passing score requirement
- Difficulty badge and time limit per test

### 4. `student-coding.html` — Coding Problems
- Filterable challenge list by **difficulty** (Easy, Medium, Hard) and **status** (Solved, Unsolved)
- Paginated list — 20 problems per page with backend `?page=&limit=` support
- Shows submission count, acceptance rate, difficulty badge per problem
- Clicking a problem navigates to `coding-editor.html?id=…`
- Only required fields fetched from API (no explanation/options in list view)

### 5. `coding-editor.html` — Coding Playground
- **Left pane** — problem description, input/output formats, constraints, sample test cases
- **Right pane** — code editor with syntax highlighting, language selector (JavaScript, Python, C++, Java)
- **Console output** — logs output for custom input runs and sample case tests
- Keyboard shortcut helper panel
- Run and Submit buttons with loading states

### 6. `student-interview-setup.html` — AI Mock Interview Setup
- Select job role (Software Engineer, Frontend Developer, Data Analyst, etc.)
- Set experience level and target company profile
- Webcam and microphone verification before starting
- Settings persisted to `sessionStorage` for the session

### 7. `student-interview-session.html` — AI Mock Interview Session
- Live webcam video feed of the student
- AI interviewer voice synthesis and transcript display
- **Speech-to-text** transcription of spoken answers in real-time
- Progress indicator (Question X of Y)
- Timer per question; auto-advances on timeout

### 8. `student-interview-result.html` — AI Interview Results
- Overall mock interview score and pass/fail status
- Detailed behavioural metrics (communication clarity, grammar, confidence, relevance)
- Full Q&A transcript with inline improvement suggestions

### 9. `student-results.html` — Examination Reports
- Chronological list of all completed tests, MCQs, and coding submissions
- Filter by category (Aptitude, Technical, Coding) and score range
- Direct link to full answer/explanation view per submission

### 10. `test-start.html` — Test Start Landing
- Displays test details: duration, question count, scoring scheme, negative marking
- Honour code acceptance checkbox before the Start button is unlocked
- Timer preview and instructions

### 11. `take-test.html` — Active Exam Console
- **Sidebar** — Question palette grid (colour-coded: Answered, Skipped, Marked for Review, Unvisited)
- **Main console** — question text, radio selection, "Clear Answer", "Mark for Review"
- **Sticky header** — live countdown timer that triggers auto-submit at zero
- Section navigation for multi-section tests

### 12. `test-result.html` — Detailed Test Results
- Pass/Fail banner with percentage score
- Breakdown: Correct / Incorrect / Skipped counts
- Scrollable Q&A list showing selected answer, correct answer, and explanation per question

### 13. `student-leaderboard.html` — Global Leaderboard
- Ranked table with profile initials, name, total score, tests taken
- Search by student name; filter by branch / year
- Admins excluded from leaderboard display
- Logged-in student's row highlighted

### 14. `student-profile.html` — Student Profile
- View and edit: Name, Phone, College, Branch, Year, Location, Passout Year
- Profile photo upload (base64 or URL)
- Placement stats: total hours prepared, tests taken, coding problems solved
- Password change section (current password + confirm new password)

---

## 🛠️ Admin Portal Pages & Features

### 1. `admin-dashboard.html` — Admin Command Centre
**Sidebar — 5 grouped sections:**
- *Overview*: Dashboard (active link highlighted)
- *Content*: Categories, Question Pool, Technical MCQs, Coding Challenges
- *Assessments*: Tests, Mock Interviews
- *People*: Students, Results
- *Insights*: Analytics

**Header:**
- Breadcrumb navigation (Admin › Dashboard)
- Admin name + avatar (fetched from `/auth/profile`)
- Theme toggle (light/dark)
- Dynamic notification bell with badge count
- Notification dropdown — Escape key + outside-click to close

**Dashboard Body:**
- Page title + **Quick Actions** panel (Create Test, Add MCQ, Add Challenge)
- **8 KPI stat cards** (all clickable with navigation):
  - Registered Students, Active Tests, MCQ Questions, Coding Problems
  - New Students (7 days), Submissions Today, Mock Interviews, Avg. Score %
- **Quick Links** panel — 6 shortcut tiles to the most-used actions
- **Recent Submissions** feed (Pass/Fail badge + score %)
- **New Students** feed (branch + year)
- **Leaderboard Preview** — top 5 by score with gold/silver/bronze icons
- **Error banner** with message + Retry button on any API failure
- **Loader spinner** shown while data is fetching; hidden on success/error

### 2. `admin-tests.html` — Tests Repository
- Tabulated list of all created tests
- Columns: Name, Category, Time Limit, Questions, Status, Created By
- Toggle Active / Inactive status inline
- Permanently delete tests with confirmation modal
- Paginated with backend `?page=&limit=` support

### 3. `admin-test-create.html` — Advanced Test Builder
- Test metadata: name, description, time limit, category, subcategory
- Configuration: negative marking, option shuffling, dynamic rule-based questions
- Interactive question selector — search and assign from question pool
- Scheduling: Quiz Date, Start Time, End Time fields
- Passing score threshold configuration

### 4. `admin-questions.html` — Questions Pool
- Searchable MCQ repository filterable by category, subcategory, difficulty
- Paginated list — 20 per page with backend support
- Edit, clone, or delete questions inline
- **Bulk CSV Import** section for uploading question batches
- Only required fields fetched in list view (no options/explanation unless needed)

### 5. `admin-question-create.html` — Add MCQ
- Category and subcategory selectors
- Question text (rich-text ready)
- 4 option inputs with correct-answer radio selector
- Explanation field for post-test review
- Difficulty tag (Easy / Medium / Hard) and marks field

### 6. `admin-coding.html` — Coding Problems Repository
- List of all coding challenges with difficulty and acceptance rate
- View boilerplate and test cases per problem
- Toggle Active / Inactive status

### 7. `admin-coding-create.html` — Add Coding Challenge
- Problem name, description, constraints, expected complexity
- Test case editor (input → expected output pairs)
- Boilerplate code editor per language (JS, Python, C++, Java)
- Difficulty and marks configuration

### 8. `admin-technical-mcq.html` — Technical MCQs List
- View, edit, delete technical MCQs grouped by subject
- Toggle visibility per question

### 9. `admin-technical-mcq-create.html` — Add Technical MCQ
- Same structure as standard MCQ create with subject-specific category selector

### 10. `admin-interviews.html` — Mock Interview Logs
- List of student interview submissions with date, role, and AI score
- Inspect individual transcripts, audio recordings, and detailed feedback

### 11. `admin-categories.html` — Category Directory
- Create and edit parent categories (Aptitude, Technical, Coding) and nested subcategories
- `type` enum: `aptitude | technical | coding`
- Used to filter tests and questions throughout the platform

### 12. `admin-results.html` — Results Log
- Complete exam submission table: student name, test name, score, percentage, pass/fail
- Searchable and filterable by student name or test name
- Export to CSV option

### 13. `admin-students.html` — Student Management
- Database of all registered students with college, branch, year, location
- Search by name, email, or college
- Delete account with confirmation

### 14. `admin-analytics.html` — Performance Analytics
- Visual charts: average scores over time, pass rates, subject-wise performance
- Student activity heatmap (tests per day)
- Category breakdown: Aptitude vs Technical vs Coding submission counts

---

## ⚙️ Backend API — Key Endpoints

| Group | Endpoint | Description |
|---|---|---|
| Auth | `POST /api/auth/register` | Register student (saves phone, college, branch, year, passoutYear, location) |
| Auth | `POST /api/auth/login` | Login, returns JWT + refresh token cookie |
| Auth | `GET /api/auth/profile` | Get logged-in user profile |
| Auth | `PUT /api/auth/profile` | Update profile (name, phone, college, branch, year, passoutYear, location, profileImage) |
| Auth | `POST /api/auth/forgot-password` | Send reset email (30-min token) |
| Auth | `POST /api/auth/reset-password/:token` | Reset password with token |
| Auth | `POST /api/auth/logout` | Invalidate session cookie |
| Auth | `POST /api/auth/refresh` | Refresh access token using httpOnly cookie |
| Tests | `GET /api/tests?type=aptitude&page=1&limit=25` | Paginated tests filtered by type |
| Tests | `GET /api/tests/:id` | Single test with questions |
| Questions | `GET /api/questions?limit=20&page=1` | Paginated question list (list fields only) |
| Results | `GET /api/results/my?limit=5` | Current student's recent results |
| Leaderboard | `GET /api/leaderboard` | Ranked students (admins excluded) |
| Analytics | `GET /api/analytics/dashboard` | Admin dashboard stats + recent data |
| Coding | `GET /api/coding/problems?page=1&limit=20` | Paginated coding problems |

---

## 🔑 Security & Architecture Notes

- **JWT access tokens** stored in `localStorage`; **refresh tokens** in `httpOnly` cookies
- All protected routes use an `authMiddleware` guard that validates the JWT and checks `activeSessionId`
- `api.js` has a 15-second `AbortController` timeout and automatic retry (up to 2×) on 5xx / timeout errors
- `api.js` auto-redirects to `login.html?session=expired` on any 401 response (outside auth pages)
- Password minimum is **8 characters** enforced both frontend and backend
- Email validated by regex on both frontend and Mongoose model (`match`)
- Role-based routing enforced on every page load (profile fetch before rendering content)
- MongoDB indexes on `category`, `subcategory`, `difficulty` on the Question model for fast filtered queries
- Question list API never returns `explanation` or full `options` in list views — only on detail fetch
