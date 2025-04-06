const { generateDailyDigest } = require('../services/digestService');
const AITool = require('../models/AITool');
const DailyDigest = require('../models/DailyDigest');
const mongoose = require('mongoose');

// Mock the external API calls
jest.mock('@huggingface/inference', () => ({
  HfInference: jest.fn()
}));

jest.mock('openai', () => ({
  Configuration: jest.fn(),
  OpenAIApi: jest.fn().mockImplementation(() => ({
    createChatCompletion: jest.fn().mockResolvedValue({
      data: {
        choices: [{
          message: {
            content: 'Mocked GPT-3.5 summary'
          }
        }]
      }
    })
  }))
}));

describe('Digest Service', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const mockTools = [
    {
      name: 'Test GitHub Tool 1',
      source: 'GitHub',
      metrics: { stars: 1000, downloads: 0, citations: 0 },
      description: 'A test GitHub tool',
      url: 'https://github.com/test1',
      createdAt: yesterday
    },
    {
      name: 'Test GitHub Tool 2',
      source: 'GitHub',
      metrics: { stars: 800, downloads: 0, citations: 0 },
      description: 'Another test GitHub tool',
      url: 'https://github.com/test2',
      createdAt: yesterday
    },
    {
      name: 'Test HF Model 1',
      source: 'HuggingFace',
      metrics: { stars: 0, downloads: 500, citations: 0 },
      description: 'A test HuggingFace model',
      url: 'https://huggingface.co/test1',
      createdAt: yesterday
    },
    {
      name: 'Test ArXiv Paper 1',
      source: 'arXiv',
      metrics: { stars: 0, downloads: 0, citations: 200 },
      description: 'A test arXiv paper',
      url: 'https://arxiv.org/test1',
      createdAt: yesterday
    }
  ];

  beforeEach(async () => {
    // Reset mocks
    const { HfInference } = require('@huggingface/inference');
    HfInference.mockImplementation(() => ({
      summarization: jest.fn().mockResolvedValue({
        summary_text: 'Mocked BART summary'
      })
    }));
    await AITool.insertMany(mockTools);
  });

  describe('generateDailyDigest', () => {
    it('should generate a digest with correct statistics', async () => {
      const digest = await generateDailyDigest();

      expect(digest).toBeDefined();
      expect(digest.totalTools).toBe(4);
      expect(digest.newTools).toBe(4);
      expect(digest.summary).toBeDefined();
    });

    it('should include top 3 tools from each source', async () => {
      const digest = await generateDailyDigest();

      expect(digest.topEntries.github).toHaveLength(2);
      expect(digest.topEntries.huggingface).toHaveLength(1);
      expect(digest.topEntries.arxiv).toHaveLength(1);

      // Verify sorting
      expect(digest.topEntries.github[0].metrics.stars).toBeGreaterThanOrEqual(
        digest.topEntries.github[1].metrics.stars
      );
    });

    it('should handle empty database gracefully', async () => {
      await AITool.deleteMany({});
      const digest = await generateDailyDigest();

      expect(digest).toBeDefined();
      expect(digest.totalTools).toBe(0);
      expect(digest.newTools).toBe(0);
      expect(digest.topEntries.github).toHaveLength(0);
      expect(digest.topEntries.huggingface).toHaveLength(0);
      expect(digest.topEntries.arxiv).toHaveLength(0);
    });

    it('should use GPT-3.5 when BART fails', async () => {
      const { HfInference } = require('@huggingface/inference');
      HfInference.mockImplementation(() => ({
        summarization: jest.fn().mockRejectedValue(new Error('BART failed'))
      }));

      const digest = await generateDailyDigest();
      expect(digest.summary).toBe('Mocked GPT-3.5 summary');
    });

    it('should handle API errors gracefully', async () => {
      const { HfInference } = require('@huggingface/inference');
      HfInference.mockImplementation(() => ({
        summarization: jest.fn().mockRejectedValue(new Error('BART failed'))
      }));

      const { OpenAIApi } = require('openai');
      OpenAIApi.mockImplementation(() => ({
        createChatCompletion: jest.fn().mockRejectedValue(new Error('GPT failed'))
      }));

      const digest = await generateDailyDigest();
      expect(digest.summary).toBeDefined();
      expect(typeof digest.summary).toBe('string');
    });
  });
}); 