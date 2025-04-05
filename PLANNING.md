Main problem statement:

AI Discovery Agent & Digest Generator
Objective: Create an automated agent that tracks, summarizes, and displays the latest AI tools/models from platforms like GitHub, Hugging Face, and ArXiv.

Real-Time Aggregation: Fetch AI releases via APIs/scraping from trusted sources, categorized by type (NLP, CV, etc.).

Digest & Subscription: Summarize updates and offer daily/weekly subscriptions via email or notifications.

Search & Visualization: Filter and search updates with trend graphs showing model/tool growth over time.

CODING TECH-STACK: VITE, MONGODB, EXPRESS, NODE

Phase 1: Data Pipeline Setup (5 Hours)
Goal: Automate fetching/storing AI tools from 3 sources
Tools: GitHub API, Hugging Face Hub API, arXiv API, Playwright
Tasks:

Implement rate-limited API clients for GitHub (repo metadata), Hugging Face (model cards), and arXiv (paper abstracts)

Create unified schema:

ts
interface AITool {
  name: string;
  source: "GitHub" | "HuggingFace" | "arXiv";
  metrics: { stars?: number; downloads?: number; citations?: number };
  timeline: { date: Date; value: number }[];
  url: string;
}
Write cron job to fetch data daily at 3 AM IST

Handle API pagination and error retries

Phase 2: Backend Core (4 Hours)
Goal: Build REST API + Real-time Updates
Tools: Express.js, WebSocket, MongoDB
Tasks:

Create endpoints:

GET /tools (filter by type/source/date)

GET /trends (growth data for charts)

POST /subscribe (email management)

Implement WebSocket server for live dashboard updates

Configure MongoDB indexes for fast text search

Add request validation middleware

Phase 3: AI-Powered Summarization (3 Hours)
Goal: Auto-generate tool descriptions
Tools: Hugging Face Inference API
Workflow:

text
Raw Data → Text Extraction → BART-Large-CNN → Summary Storage
Tasks:

Extract key text from GitHub READMEs/arXiv abstracts

Implement chunked processing for long texts

Cache summaries to avoid reprocessing

Phase 4: Dashboard Development (6 Hours)
Goal: Interactive user interface
Tools: React, Chart.js, React-Query
Components:

text
Dashboard Layout
├─ Metrics Overview (Total/Today/Subscriptions)
├─ Trending Chart (6-month growth)
├─ Top Tools Carousel
└─ Quick Subscribe Panel
Tasks:

Build responsive grid layout

Implement search with debouncing

Add source/type filters

Create subscription preference modal

Phase 5: Digest System (4 Hours)
Goal: Scheduled email delivery
Tools: Nodemailer, Handlebars
Workflow:

text
Daily Cron → Generate Digest → Apply Template → Send Emails
Tasks:

Design HTML email template

Implement unsubscribe mechanism

Add digest preview in dashboard

Set up email tracking (open rates)

Phase 6: Deployment (2 Hours)
Goal: Production-ready setup
Tools: Docker, Heroku
Tasks:

Create Dockerfile for backend + frontend

Configure environment variables

Set up MongoDB Atlas cluster

Deploy to Heroku with Postbuild script

Critical Path Checklist
API rate limit handling (GitHub: 10 req/hr)

Unified data normalization

WebSocket connection stability

Email deliverability testing

Responsive mobile layout

Time-Saving Strategies
Use Material-UI template for dashboard

Precache Hugging Face models during build

Mock API responses during frontend dev

Use existing arXiv parser library

Skip user auth initially (anonymous subs)