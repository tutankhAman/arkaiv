# arkaiv

Arkaiv is an AI tool discovery platform that tracks, summarizes, and displays the latest AI tools and models from GitHub, Hugging Face, and arXiv papers.

## Project Overview

Arkaiv automatically scrapes data from popular AI resources, analyzes trends, and generates daily digests of the most important developments in the AI ecosystem. The platform helps researchers, developers, and enthusiasts stay up-to-date with the rapidly evolving field of artificial intelligence.

## Features Implemented

- **Multi-Source Data Scraping**:
  - GitHub repositories (sorted by stars)
  - Hugging Face models (sorted by downloads)
  - arXiv papers (sorted by citations)

- **Daily Digest Generation**:
  - Automated summaries of new AI tools and models
  - Top entries from each source
  - Metrics tracking (stars, downloads, citations)
  - Formatted markdown output for easy sharing

- **MongoDB Integration**:
  - Persistent storage of AI tools and models
  - Historical tracking of metrics
  - Efficient querying and filtering

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Hugging Face API key (for summarization)
- OpenAI API key (as fallback for summarization)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/arkaiv.git
   cd arkaiv
   ```

2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

### Usage

#### Running the Scrapers

Run the scrapers to collect data from GitHub, Hugging Face, and arXiv:

```bash
cd backend
node src/scripts/run-scrapers.js
```

#### Generating a Digest

Generate a daily digest of AI tools and trends:

```bash
cd backend
node src/scripts/generate-digest-now.js
```

#### Clearing the Database

If you need to clear the database and start fresh:

```bash
cd backend
node src/scripts/clear-db.js
```

## Project Structure

```
arkaiv/
├── backend/
│   ├── digests/             # Generated daily digests
│   ├── src/
│   │   ├── api/             # API routes and controllers
│   │   ├── config/          # Configuration files
│   │   ├── models/          # MongoDB schemas
│   │   ├── scrapers/        # Data collection modules
│   │   ├── services/        # Business logic
│   │   ├── scripts/         # Utility and runner scripts
│   │   ├── tests/           # Test suites
│   │   └── app.js           # Express API server
│   └── package.json
└── README.md
```

## Current Status

The project has implemented the core data pipeline for collecting and storing AI tool information. The digest generation system is working and producing formatted reports of the most notable tools in the ecosystem.

### What's Working

- ✅ GitHub, Hugging Face, and arXiv scrapers
- ✅ MongoDB data storage with appropriate schemas
- ✅ Daily digest generation with data from all sources
- ✅ Fallback summarization when API keys are unavailable

### Next Steps

- 🔲 Frontend dashboard for visualizing AI tool trends
- 🔲 Email subscription system for digest delivery
- 🔲 Search functionality with filtering options
- 🔲 API endpoints for accessing tool data
- 🔲 Trend analysis and visualization

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.