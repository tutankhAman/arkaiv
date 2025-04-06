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

### Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/arkaiv.git
   cd arkaiv
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install Playwright for web scraping:
   ```bash
   npx playwright install
   ```

4. Configure environment variables:
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

### Running the Project

Follow these steps in order to run the project:

1. Clear the database (optional, but recommended for fresh start):
   ```bash
   cd backend/scripts
   node clearDb.js
   ```

2. Test the scrapers:
   ```bash
   cd ../src/scrapers
   node testScrapers.js
   ```

3. Generate a digest:
   ```bash
   cd ../digests
   node generateDigestNow.js
   ```

## Project Structure

```
arkaiv/
├── backend/
│   ├── src/
│   │   ├── api/             # API routes and controllers
│   │   │   ├── routes/      # Express route definitions
│   │   │   └── controllers/ # Route handlers and business logic
│   │   ├── config/          # Configuration files and environment setup
│   │   ├── models/          # MongoDB schemas and database models
│   │   │   ├── AITool.js    # Schema for AI tools from all sources
│   │   │   └── DailyDigest.js # Schema for daily digest documents
│   │   ├── scrapers/        # Data collection modules
│   │   │   ├── githubScraper.js    # Scrapes GitHub repositories
│   │   │   ├── huggingfaceScraper.js # Scrapes Hugging Face models
│   │   │   ├── arxivScraper.js     # Scrapes arXiv papers
│   │   │   └── testScrapers.js     # Tests all scrapers
│   │   ├── digests/         # Digest generation and formatting
│   │   │   ├── generateDigest.js       # Main digest generation logic
│   │   │   ├── generateDigestNow.js    # Script to generate digest immediately
│   │   │   ├── generateDigestDocument.js # Document formatting utilities
│   │   │   └── digestService.js        # Core digest generation service
│   │   ├── scripts/         # Utility and runner scripts
│   │   │   ├── clearDb.js   # Script to clear the database
│   │   │   └── runScrapers.js # Script to run all scrapers
│   │   ├── tests/           # Test suites and test utilities
│   │   └── app.js           # Express API server entry point
│   ├── digests/             # Generated daily digest markdown files
│   ├── .env                 # Environment variables and configuration
│   ├── package.json         # Project dependencies and scripts
│   └── package-lock.json    # Lock file for dependencies
└── README.md
```

### Directory and File Descriptions

#### Backend Structure

- **src/api/**
  - Contains all API-related code
  - `routes/`: Defines API endpoints and URL patterns
  - `controllers/`: Implements business logic for each route

- **src/config/**
  - Configuration files and environment setup
  - Handles loading of environment variables
  - Defines application-wide settings

- **src/models/**
  - MongoDB schemas and database models
  - `AITool.js`: Defines the schema for AI tools from all sources
  - `DailyDigest.js`: Defines the schema for daily digest documents

- **src/scrapers/**
  - Data collection modules for different sources
  - `githubScraper.js`: Collects AI tools from GitHub repositories
  - `huggingfaceScraper.js`: Collects models from Hugging Face
  - `arxivScraper.js`: Collects papers from arXiv
  - `testScrapers.js`: Tests all scrapers and verifies data collection

- **src/digests/**
  - Digest generation and formatting
  - `generateDigest.js`: Main logic for generating daily digests
  - `generateDigestNow.js`: Script to generate digest immediately
  - `generateDigestDocument.js`: Utilities for formatting digest documents
  - `digestService.js`: Core service for digest generation and summarization

- **src/scripts/**
  - Utility scripts for project management
  - `clearDb.js`: Clears the database for fresh starts
  - `runScrapers.js`: Runs all scrapers in sequence

- **src/tests/**
  - Test suites and test utilities
  - Contains test files for different components
  - Includes test data and mock services

- **src/app.js**
  - Main Express application entry point
  - Sets up middleware and routes
  - Initializes database connection

#### Root Level Files

- **digests/**
  - Directory containing generated daily digest markdown files
  - Each digest is named with its date (e.g., `digest_2024-04-05.md`)

- **.env**
  - Environment configuration file
  - Contains sensitive information and API keys
  - Not committed to version control

- **package.json**
  - Project metadata and dependencies
  - Defines npm scripts and project configuration
  - Lists all required packages

- **package-lock.json**
  - Lock file for npm dependencies
  - Ensures consistent dependency versions

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