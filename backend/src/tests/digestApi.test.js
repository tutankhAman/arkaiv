// Tests for the digest API endpoints
const request = require('supertest');
const app = require('../app');
const DailyDigest = require('../models/DailyDigest');

describe('Digest API Endpoints', () => {
  // Mock data for testing digest endpoints
  const mockDigests = [
    {
      date: new Date('2024-01-01'),
      totalTools: 10,
      newTools: 2,
      topEntries: {
        github: [],
        huggingface: [],
        arxiv: []
      },
      summary: 'Test summary 1'
    },
    {
      date: new Date('2024-01-02'),
      totalTools: 12,
      newTools: 2,
      topEntries: {
        github: [],
        huggingface: [],
        arxiv: []
      },
      summary: 'Test summary 2'
    }
  ];

  beforeEach(async () => {
    await DailyDigest.insertMany(mockDigests);
  });

  describe('GET /api/digest/latest', () => {
    // Test no digests scenario
    it('should return 404 when no digests exist', async () => {
      await DailyDigest.deleteMany({});
      
      const response = await request(app)
        .get('/api/digest/latest')
        .expect(404);

      expect(response.body.error).toBe('No digest found');
    });

    // Test latest digest retrieval
    it('should return the most recent digest', async () => {
      const response = await request(app)
        .get('/api/digest/latest')
        .expect(200);

      expect(response.body.date).toBe('2024-01-02T00:00:00.000Z');
      expect(response.body.totalTools).toBe(12);
      expect(response.body.summary).toBe('Test summary 2');
    });
  });

  describe('GET /api/digest/:date', () => {
    // Test non-existent date
    it('should return 404 for non-existent date', async () => {
      const response = await request(app)
        .get('/api/digest/2024-01-03')
        .expect(404);

      expect(response.body.error).toBe('Digest not found for the specified date');
    });

    // Test specific date retrieval
    it('should return digest for specific date', async () => {
      const response = await request(app)
        .get('/api/digest/2024-01-01')
        .expect(200);

      expect(response.body.date).toBe('2024-01-01T00:00:00.000Z');
      expect(response.body.totalTools).toBe(10);
      expect(response.body.summary).toBe('Test summary 1');
    });

    // Test invalid date format handling
    it('should handle invalid date format', async () => {
      const response = await request(app)
        .get('/api/digest/invalid-date')
        .expect(500);

      expect(response.body.error).toBe('Failed to fetch digest');
    });

    // Test malformed date handling
    it('should handle malformed date string', async () => {
      const response = await request(app)
        .get('/api/digest/2024-13-45') // Invalid date
        .expect(500);

      expect(response.body.error).toBe('Failed to fetch digest');
    });
  });
}); 