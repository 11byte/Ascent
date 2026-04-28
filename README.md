
# 🚀 Ascent – AI driven SaaS for engineering institutes to provision Student Ecosystem

> **Ascent** is a next-generation, AI-powered SaaS platform designed to revolutionize student engagement, institutional efficiency, and career readiness in modern engineering institutions.  
> It transforms fragmented digital systems into a unified, intelligent ecosystem that evolves with each student through their academic journey.

---

## 🧠 Overview

Modern engineering institutions face challenges due to disconnected systems for communication, career services, and academic management — resulting in:
- Low student engagement  
- Heavy administrative workload  
- Poor visibility into student progress  
- A widening gap between academia and industry  

**Ascent** directly addresses these challenges by providing a **single, AI-driven B2B ecosystem** designed around the **four key phases** of a student’s academic journey (FE, SE, TE, BE).  
Each phase progressively **unlocks new tools, insights, and experiences**, ensuring students receive what they need *exactly when they’re ready for it.*

---

## 🌐 Vision

To empower institutions with an **adaptive student lifecycle platform** that dynamically evolves with user behavior and data — fostering engagement, skill growth, and career success.

---

## 🧩 Core Architecture

Ascent is structured around **four progressive phases**, each unlocking more features and intelligence:

### 🩵 **Phase 1: Foundation (FE)**
> Introduction and onboarding phase to build self-awareness and interest discovery.
- **Home Dashboard** – Personalized student hub.
- **Behavior Tracker v1** – Simple trivia-based interest extraction to identify domain inclinations.
- **Timeline (DAG)** – Interactive graph of achievements and milestones (Phase 1 node unlocked).
- **BlogPost v1** – Tech newsfeed with AI-curated articles suited to beginner-level understanding.
  - Engagement metrics (likes/dislikes, dwell time) feed into AI for domain inference.

---

### 💙 **Phase 2: Exploration (SE)**
> Encourages student involvement, collaboration, and competitive growth.
- **Club Exploration** – AI-suggested clubs based on domain interests; managed by club admins.
- **Behavior Tracker v2** – Smarter trivia with refined question complexity.
- **BlogPost v2** – More advanced topics matching domain maturity.
- **Bounty Board** – Micro-challenges posted by clubs (poster design, bug bounties, etc.).
- **Monthly Macrothons** – Lightweight hackathons for consistent practice.
- **Leet Tracker** – LeetCode API integration for tracking problem-solving progress.
- **Timeline Update** – Adds achievement branches dynamically.

---

### 💜 **Phase 3: Growth (TE)**
> Transforms awareness into skill-building and professional readiness.
- **Career Roadmaps** – AI-curated, domain-specific learning and career paths updated yearly.
- **Timeline Comparison** – Compare personal growth with top alumni.
- **Git Tracker** – Tracks contributions via GitHub API.
- **Macrothon v2** – Advanced-level problem statements.
- **Behavior Tracker v3** – Deep data retrieval with domain-focused engagement.
- **BlogPost v3** – Advanced content curated per user domain.

---

### 💚 **Phase 4: Launch (BE)**
> Career readiness, interviews, and specialization culmination.
- **Interview Pods** – AI + peer-based interview simulation by job role/domain.
- **Final Timeline Completion** – All four nodes unlocked with full journey visualization.
- **Leaderboard** – Domain-wise student ranking.
- **Behavior Tracker Final** – Consolidates lifetime data to suggest the most fitting career domain.
- **Skill Tree** – Dynamic visualization of all acquired skills via Skill Log integration.

---

## 🧾 **Default Features (Available Across Phases)**

- **Skill Log** – Students input learned skills, automatically categorized and added to their skill tree.
- **Achievement Hall** – Repository for achievements, synced via LinkedIn API.
- **Data-Driven Insights** – AI models evolve based on behavioral, academic, and technical data.

---

## 🎓 **Institutional Dashboard (For HODs & Admins)**

> Gain a holistic, real-time view of student progress and institutional performance.

### Key Features:
- Phase-wise student list & filtering.  
- Individual student dashboards displaying:
  - Domain interests  
  - Placement/higher study inclinations  
  - Skill tree visualization  
  - Behavior and engagement analytics  
  - AI-powered SWOT analysis  
- Data-driven insights for curriculum improvement and mentorship.

---

## ⚙️ **Tech Stack**

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js (React), TailwindCSS, Framer Motion |
| **Backend** | Node.js / Express |
| **Database** | MongoDB |
| **AI & ML** | Python (Flask/FastAPI), TensorFlow, Scikit-learn, LangChain |
| **Integrations** | GitHub API, LeetCode API, LinkedIn API |
| **Architecture** | Microservice-based SaaS Model |
| **Deployment** | Docker + Vercel / AWS |

---

## 🧠 **AI-Driven Intelligence**

- **Behavioral Modeling:** Adaptive trivia and blog recommendation systems refine student interests.
- **Domain Prediction:** ML models analyze cumulative data (blog interactions, hackathon performance, skill logs) to identify strongest domain fit.
- **Career Personalization:** AI dynamically adjusts roadmaps and resource suggestions.
- **HOD Insights:** Aggregated AI reports highlight department-level trends and bottlenecks.

---

## 🗂️ **Folder Structure (Proposed)**

```

Ascent/
│
├── client/                    # Next.js Frontend
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── utils/
│
├── server/                    # Node.js Backend
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── middleware/
│
├── ai_service/                # Python ML Backend
│   ├── behavior_model/
│   ├── domain_predictor/
│   ├── roadmap_generator/
│   └── api.py
│
└── docs/                      # Documentation and reports

````

---

## 🧩 **System Flow**

1. Student signs up → assigned to **Phase 1 (FE)**.  
2. Platform collects behavioral + skill data → feeds to ML model.  
3. As the student advances academically, **Ascent auto-upgrades** their phase.  
4. Each new phase unlocks additional features + complexity tailored to student maturity.  
5. HODs and admins get **live analytics** through the institutional dashboard.

---

## ⚙️ **Installation & Setup**

### 🖥️ **Prerequisites**
Ensure the following are installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) *(optional for containerized deployment)*

---

### 🧩 **Clone the Repository**

```bash
git clone https://github.com/your-username/Ascent.git
cd Ascent
````

---

### 🪄 **Environment Configuration**

Create `.env` files in both `client/`, `server/`, and `ai_service/` directories.

#### `server/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
GITHUB_API_KEY=your_github_api_key
LEETCODE_API_KEY=your_leetcode_api_key
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

#### `client/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
```

#### `ai_service/.env`

```env
MODEL_PATH=./models/domain_model.pkl
FLASK_ENV=development
PORT=8000
```

---

### 💻 **Install Dependencies**

#### Frontend (Next.js)

```bash
cd client
npm install
```

#### Backend (Node.js)

```bash
cd ../server
npm install
```

#### AI Service (Python)

```bash
cd ../ai_service
pip install -r requirements.txt
```

---

### 🏃 **Run the Application**

#### Start Backend Server

```bash
cd server
npm run dev
```

#### Start AI Service

```bash
cd ../ai_service
python api.py
```

#### Start Frontend

```bash
cd ../client
npm run dev
```

Now open the app at **[http://localhost:3000](http://localhost:3000)** 🎉

---

### 🐳 **Run Using Docker (Optional)**

If you prefer containerization:

```bash
docker compose up --build -d
```

This starts the full stack defined in [docker-compose.yml](docker-compose.yml):
- `frontend` (Next.js) on `http://localhost:3000`
- `backend` (Express + Prisma) on `http://localhost:5000`
- `postgres` on `localhost:5432`
- `kafka` on `localhost:9092`
- `zookeeper` on `localhost:2181`

To stop everything:

```bash
docker compose down
```

---

## 🧑‍💻 **Developed By**

**Team Ascent**

* Omkar Chandgaonkar *(Founder & Architect)*
* [Add Contributors]

---

## 🏁 **Future Scope**

* Integration with LMS systems (e.g., Moodle, Google Classroom).
* Predictive placement analytics for institutions.
* AI mentors for personalized skill coaching.
* Resume builder & automatic portfolio generator.


