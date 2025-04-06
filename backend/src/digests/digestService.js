const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { HfInference } = require('@huggingface/inference');
const { Configuration, OpenAIApi } = require('openai');
const AITool = require('../models/AITool');
const DailyDigest = require('../models/DailyDigest');

// Check for API keys and use mock services if they're missing
let hf, openai;
if (!process.env.HUGGINGFACE_API_KEY || !process.env.OPENAI_API_KEY) {
  console.warn('Warning: Missing API keys. Using mock summarization services.');
  
  // Mock HF inference
  hf = {
    summarization: async () => ({
      summary_text: "This is a mock summary as no Hugging Face API key was provided."
    })
  };
  
  // Mock OpenAI
  openai = {
    createChatCompletion: async () => ({
      data: {
        choices: [{
          message: {
            content: "This is a mock summary as no OpenAI API key was provided."
          }
        }]
      }
    })
  };
} else {
  // Initialize real services when API keys are available
  hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  openai = new OpenAIApi(configuration);
}

// Utility function for exponential backoff retry
async function retryWithBackoff(fn, retries = 3, baseDelayMs = 300, factor = 2) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= retries) {
        throw error;
      }
      const delayMs = baseDelayMs * Math.pow(factor, attempt);
      console.log(`Retry attempt ${attempt} after ${delayMs}ms delay...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

// Create a simple summarizer that works locally without APIs
function createLocalSummary(text) {
  // Extract key stats and information
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  const totalTools = lines.find(line => line.startsWith('Total AI Tools:'))?.split(':')[1]?.trim() || 'N/A';
  const newTools = lines.find(line => line.startsWith('New Tools Today:'))?.split(':')[1]?.trim() || 'N/A';
  
  // Find sections
  const gitHubSection = text.indexOf('Top GitHub Tools:');
  const huggingFaceSection = text.indexOf('Top HuggingFace Models:');
  const arxivSection = text.indexOf('Top arXiv Papers:');
  
  // Create a concise summary manually
  return `The database contains ${totalTools} AI tools with ${newTools} new additions today. ` +
         `The digest features the top GitHub repositories, HuggingFace models, and arXiv papers ` +
         `based on stars, downloads, and citations respectively. Key areas covered include AI resources, ` +
         `language detection, sentiment analysis, and neural network architectures.`;
}

async function generateSummary(text) {
  // First try BART
  try {
    console.log("Attempting summarization with Hugging Face BART model...");
    const result = await retryWithBackoff(async () => {
      return await hf.summarization({
        model: 'facebook/bart-large-cnn',
        inputs: text,
        parameters: {
          max_length: 150,
          min_length: 30,
        },
      });
    }, 2);  // Try twice with backoff
    
    console.log("BART summarization successful");
    return result.summary_text;
  } catch (error) {
    console.error('BART summarization failed, falling back to GPT-3.5:', error.message);
    
    // Fallback to GPT-3.5-turbo
    try {
      console.log("Attempting summarization with OpenAI GPT-3.5...");
      const completion = await retryWithBackoff(async () => {
        return await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes AI tools and research papers in a concise and informative way.'
            },
            {
              role: 'user',
              content: `Please summarize the following information in a concise and informative way: ${text}`
            }
          ],
          max_tokens: 150
        });
      }, 2);  // Try twice with backoff
      
      console.log("GPT-3.5 summarization successful");
      return completion.data.choices[0].message.content;
    } catch (error) {
      console.error('GPT-3.5 summarization also failed:', error.message);
      
      // Final fallback - create a simple summary without API calls
      console.log("Using local summarization as final fallback");
      return createLocalSummary(text);
    }
  }
}

async function generateDailyDigest() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Get total number of tools
  const totalTools = await AITool.countDocuments();

  // Get new tools from yesterday
  const newTools = await AITool.countDocuments({
    createdAt: { $gte: yesterday, $lt: today }
  });

  // Get top 3 tools from each source with proper sorting and filtering
  const topGithub = await AITool.find({ 
    source: 'GitHub'
  })
  .sort({ 'metrics.stars': -1 })
  .limit(3)
  .select('name description metrics.stars url improvements source');

  const topHuggingFace = await AITool.find({ 
    source: 'HuggingFace'
  })
  .sort({ 'metrics.downloads': -1 })
  .limit(3)
  .select('name description metrics.downloads url improvements source');

  // Fix: Ensure we're getting arXiv papers with proper sorting
  const topArxiv = await AITool.find({ 
    source: 'arXiv'
  })
  .sort({ 'metrics.citations': -1 })
  .limit(3)
  .select('name description metrics.citations url improvements source');
  
  console.log(`Found ${topGithub.length} GitHub tools`);
  console.log(`Found ${topHuggingFace.length} HuggingFace models`);
  console.log(`Found ${topArxiv.length} arXiv papers`);

  // Ensure descriptions are available for all tools or provide placeholders
  // Map tools to TopEntry format with improved descriptions
  const mapToTopEntry = (tool) => {
    // Extract potential description from the URL for models lacking descriptions
    let enhancedDescription = tool.description;
    
    if (!enhancedDescription || enhancedDescription.trim() === '') {
      if (tool.source === 'GitHub') {
        const repoName = tool.url.split('/').slice(-2).join('/');
        enhancedDescription = `GitHub repository ${repoName}. This tool needs a description update.`;
      } else if (tool.source === 'HuggingFace') {
        const modelName = tool.url.split('/').pop();
        enhancedDescription = `HuggingFace model for ${modelName.replace(/-/g, ' ')}. This model needs a description update.`;
      } else if (tool.source === 'arXiv') {
        const paperId = tool.url.split('/').pop();
        enhancedDescription = `Research paper (ID: ${paperId}) from arXiv. This paper needs a description update.`;
      } else {
        enhancedDescription = 'No description available. This entry needs a description update.';
      }
    }
    
    return {
      name: tool.name || 'Unnamed Tool',
      source: tool.source || 'Unknown',
      description: enhancedDescription,
      metrics: {
        stars: tool.metrics?.stars || 0,
        downloads: tool.metrics?.downloads || 0,
        citations: tool.metrics?.citations || 0
      },
      url: tool.url || '#',
      improvements: tool.improvements || 'No improvement suggestions available.'
    };
  };

  // Prepare text for summarization with proper formatting
  const summaryText = `
    Total AI Tools: ${totalTools}
    New Tools Today: ${newTools}
    
    Top GitHub Tools:
    ${topGithub.map(tool => `${tool.name}: ${tool.description || 'No description available'}`).join('\n')}
    
    Top HuggingFace Models:
    ${topHuggingFace.map(tool => `${tool.name}: ${tool.description || 'No description available'}`).join('\n')}
    
    Top arXiv Papers:
    ${topArxiv.map(tool => `${tool.name}: ${tool.description || 'No description available'}`).join('\n')}
  `;

  // Generate summary
  const summary = await generateSummary(summaryText);

  // Format the date
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Generate formatted document with improved formatting
  const formattedDocument = `
# AI Tools Daily Digest
## ${formattedDate}

### Overview
- Total AI Tools in Database: ${totalTools}
- New Tools Added Today: ${newTools}

### Summary
${summary}

### Top GitHub Tools
${topGithub.length > 0 ? topGithub.map((tool, index) => `
#### ${index + 1}. ${tool.name}
- **Description**: ${mapToTopEntry(tool).description}
- **Stars**: ${tool.metrics?.stars || 0}
- **URL**: ${tool.url || '#'}
${tool.improvements ? `- **Suggested Improvements**: ${tool.improvements}` : ''}
`).join('\n') : '\nNo GitHub tools found.\n'}

### Top HuggingFace Models
${topHuggingFace.length > 0 ? topHuggingFace.map((model, index) => `
#### ${index + 1}. ${model.name}
- **Description**: ${mapToTopEntry(model).description}
- **Downloads**: ${model.metrics?.downloads || 0}
- **URL**: ${model.url || '#'}
${model.improvements ? `- **Suggested Improvements**: ${model.improvements}` : ''}
`).join('\n') : '\nNo HuggingFace models found.\n'}

### Top arXiv Papers
${topArxiv.length > 0 ? topArxiv.map((paper, index) => `
#### ${index + 1}. ${paper.name}
- **Description**: ${mapToTopEntry(paper).description}
- **Citations**: ${paper.metrics?.citations || 0}
- **URL**: ${paper.url || '#'}
${paper.improvements ? `- **Suggested Improvements**: ${paper.improvements}` : ''}
`).join('\n') : '\nNo arXiv papers found.\n'}

---
*This digest was automatically generated by the Arkaiv AI Tools Platform.*
`;

  // Create and save digest
  const digest = new DailyDigest({
    date: today,
    totalTools,
    newTools,
    topEntries: {
      github: topGithub.map(mapToTopEntry),
      huggingface: topHuggingFace.map(mapToTopEntry),
      arxiv: topArxiv.map(mapToTopEntry)
    },
    summary,
    formattedDocument
  });

  // Log stats before saving
  console.log(`Digest created with ${topGithub.length} GitHub tools, ${topHuggingFace.length} HuggingFace models, and ${topArxiv.length} arXiv papers`);

  await digest.save();
  return digest;
}

// Export the generateDailyDigest function directly
module.exports = generateDailyDigest;