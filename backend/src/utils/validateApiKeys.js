const { HfInference } = require('@huggingface/inference');
const OpenAI = require('openai');
const chalk = require('chalk'); // You may need to install this dependency

/**
 * Validates the Hugging Face API token
 * @returns {Promise<boolean>} True if the token is valid
 */
async function validateHuggingFaceToken() {
  try {
    const token = process.env.HUGGINGFACE_TOKEN;
    
    if (!token || token === 'your-huggingface-token') {
      console.error(chalk.red('❌ HUGGINGFACE_TOKEN is missing or using default value'));
      console.log(chalk.yellow('  → Set a valid token in your .env file'));
      return false;
    }
    
    const hf = new HfInference(token);
    // Simple request that should work with a valid token
    await hf.tokenClassification({
      model: 'dbmdz/bert-large-cased-finetuned-conll03-english',
      inputs: 'Hello world'
    });
    
    console.log(chalk.green('✅ HuggingFace token is valid'));
    return true;
  } catch (error) {
    console.error(chalk.red(`❌ HuggingFace token validation failed: ${error.message}`));
    console.log(chalk.yellow('  → Check your HuggingFace token in the .env file'));
    return false;
  }
}

/**
 * Validates the OpenAI API key
 * @returns {Promise<boolean>} True if the key is valid
 */
async function validateOpenAIKey() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'your-openai-api-key' || !apiKey.startsWith('sk-')) {
      console.error(chalk.red('❌ OPENAI_API_KEY is missing or using default/invalid value'));
      console.log(chalk.yellow('  → Set a valid API key in your .env file (should start with sk-)'));
      return false;
    }
    
    const openai = new OpenAI({ apiKey });
    await openai.models.list();
    
    console.log(chalk.green('✅ OpenAI API key is valid'));
    return true;
  } catch (error) {
    console.error(chalk.red(`❌ OpenAI API key validation failed: ${error.message}`));
    console.log(chalk.yellow('  → Check your OpenAI API key in the .env file'));
    
    // Give more context for specific error codes
    if (error.status === 401) {
      console.log(chalk.yellow('  → Status 401 indicates an invalid API key'));
    } else if (error.status === 429) {
      console.log(chalk.yellow('  → Status 429 indicates rate limiting or insufficient quota'));
    }
    
    return false;
  }
}

/**
 * Validates all required API keys
 * @returns {Promise<boolean>} True if all keys are valid
 */
async function validateAllApiKeys() {
  console.log(chalk.blue('Validating API credentials...'));
  
  const hfValid = await validateHuggingFaceToken();
  const openaiValid = await validateOpenAIKey();
  
  if (!hfValid && !openaiValid) {
    console.error(chalk.red('Both HuggingFace and OpenAI credentials are invalid.'));
    console.log(chalk.yellow('Summary generation may fail or use fallback methods.'));
  }
  
  return hfValid || openaiValid;
}

module.exports = {
  validateHuggingFaceToken,
  validateOpenAIKey,
  validateAllApiKeys
};
