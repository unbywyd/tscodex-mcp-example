import { McpServer, getAIClient, AIClientError } from '@tscodex/mcp-sdk';
import { Type } from '@sinclair/typebox';
import { Config } from '../config.js';

/**
 * Register AI demo tools
 * Demonstrates AI Client integration with proper error handling
 */
export function registerAIDemoTools(server: McpServer<Config>) {
  const ai = getAIClient();

  // ai_summarize - Summarize text using AI
  server.addTool({
    name: 'ai_summarize',
    description: 'Summarize the provided text using AI. Returns a concise summary of the input text. Requires AI proxy to be configured in MCP Manager.',

    schema: Type.Object({
      text: Type.String({
        description: 'Text to summarize',
        minLength: 10
      }),
      style: Type.Optional(Type.Union([
        Type.Literal('brief'),
        Type.Literal('detailed'),
        Type.Literal('bullet-points')
      ], {
        default: 'brief',
        description: 'Summary style: brief (1-2 sentences), detailed (paragraph), or bullet-points'
      }))
    }),

    handler: async (params, context) => {
      const { text, style = 'brief' } = params;

      // Check if AI is configured (synchronous check)
      if (!ai.isConfigured()) {
        return {
          content: [{
            type: 'text',
            text: `⚠️ AI is not configured.

To use AI features:
1. Open MCP Manager settings
2. Configure an AI provider (OpenAI, OpenRouter, or Ollama)
3. Add your API key
4. Restart the server

The AI proxy provides secure access to AI models without exposing API keys to individual servers.`
          }],
          isError: true
        };
      }

      // Check if AI proxy is available (async check with health endpoint)
      if (!await ai.isAvailable()) {
        return {
          content: [{
            type: 'text',
            text: `⚠️ AI proxy is not available.

The AI proxy endpoint is configured but not responding.
Please check:
1. MCP Manager is running
2. AI provider is properly configured
3. API key is valid`
          }],
          isError: true
        };
      }

      // Build system prompt based on style
      const styleInstructions: Record<string, string> = {
        'brief': 'Provide a very concise summary in 1-2 sentences.',
        'detailed': 'Provide a comprehensive summary in a well-structured paragraph.',
        'bullet-points': 'Provide a summary as a bulleted list of key points (3-5 bullets).'
      };

      const systemPrompt = `You are a helpful assistant that creates ${style} summaries. ${styleInstructions[style]} Be accurate and capture the main ideas.`;

      try {
        const summary = await ai.completeWithSystem(
          systemPrompt,
          `Please summarize the following text:\n\n${text}`
        );

        return {
          content: [{
            type: 'text',
            text: `📝 Summary (${style}):\n\n${summary}`
          }]
        };
      } catch (error) {
        return handleAIError(error, 'summarize text');
      }
    }
  });

  // ai_translate - Translate text using AI
  server.addTool({
    name: 'ai_translate',
    description: 'Translate text to a specified language using AI. Supports any language pair.',

    schema: Type.Object({
      text: Type.String({
        description: 'Text to translate',
        minLength: 1
      }),
      targetLanguage: Type.String({
        description: 'Target language (e.g., "Spanish", "French", "Japanese", "Russian")',
        minLength: 2
      }),
      preserveTone: Type.Optional(Type.Boolean({
        default: true,
        description: 'Preserve the original tone and style of the text'
      }))
    }),

    handler: async (params, context) => {
      const { text, targetLanguage, preserveTone = true } = params;

      // Check AI availability
      if (!ai.isConfigured()) {
        return {
          content: [{
            type: 'text',
            text: '⚠️ AI is not configured. Please configure AI proxy in MCP Manager to use translation features.'
          }],
          isError: true
        };
      }

      if (!await ai.isAvailable()) {
        return {
          content: [{
            type: 'text',
            text: '⚠️ AI proxy is not available. Please check MCP Manager settings.'
          }],
          isError: true
        };
      }

      const toneInstruction = preserveTone
        ? 'Preserve the original tone, style, and register of the text.'
        : 'Use a neutral tone.';

      const systemPrompt = `You are a professional translator. Translate text accurately to ${targetLanguage}. ${toneInstruction} Only output the translated text, no explanations.`;

      try {
        const translation = await ai.completeWithSystem(
          systemPrompt,
          text
        );

        return {
          content: [{
            type: 'text',
            text: `🌐 Translation (${targetLanguage}):\n\n${translation}`
          }]
        };
      } catch (error) {
        return handleAIError(error, 'translate text');
      }
    }
  });

  // ai_analyze_sentiment - Analyze sentiment of text
  server.addTool({
    name: 'ai_analyze_sentiment',
    description: 'Analyze the sentiment and emotional tone of text using AI. Returns sentiment score and analysis.',

    schema: Type.Object({
      text: Type.String({
        description: 'Text to analyze',
        minLength: 5
      })
    }),

    handler: async (params, context) => {
      const { text } = params;

      if (!ai.isConfigured()) {
        return {
          content: [{
            type: 'text',
            text: '⚠️ AI is not configured. Please configure AI proxy in MCP Manager to use sentiment analysis.'
          }],
          isError: true
        };
      }

      if (!await ai.isAvailable()) {
        return {
          content: [{
            type: 'text',
            text: '⚠️ AI proxy is not available. Please check MCP Manager settings.'
          }],
          isError: true
        };
      }

      const systemPrompt = `You are a sentiment analysis expert. Analyze the emotional tone and sentiment of the provided text.

Respond in this exact format:
Sentiment: [Positive/Negative/Neutral/Mixed]
Confidence: [High/Medium/Low]
Emotions: [list primary emotions detected]
Analysis: [1-2 sentence explanation]`;

      try {
        const analysis = await ai.completeWithSystem(
          systemPrompt,
          `Analyze the sentiment of this text:\n\n${text}`
        );

        return {
          content: [{
            type: 'text',
            text: `🎭 Sentiment Analysis:\n\n${analysis}`
          }]
        };
      } catch (error) {
        return handleAIError(error, 'analyze sentiment');
      }
    }
  });

  // ai_chat - General purpose chat completion
  server.addTool({
    name: 'ai_chat',
    description: 'Send a message to AI and get a response. General purpose AI chat for any question or task.',

    schema: Type.Object({
      message: Type.String({
        description: 'Your message or question to the AI',
        minLength: 1
      }),
      systemPrompt: Type.Optional(Type.String({
        description: 'Optional system prompt to customize AI behavior'
      })),
      temperature: Type.Optional(Type.Number({
        minimum: 0,
        maximum: 2,
        default: 0.7,
        description: 'Temperature for response creativity (0 = deterministic, 2 = very creative)'
      }))
    }),

    handler: async (params, context) => {
      const { message, systemPrompt, temperature = 0.7 } = params;

      if (!ai.isConfigured()) {
        return {
          content: [{
            type: 'text',
            text: '⚠️ AI is not configured. Please configure AI proxy in MCP Manager to use chat features.'
          }],
          isError: true
        };
      }

      if (!await ai.isAvailable()) {
        return {
          content: [{
            type: 'text',
            text: '⚠️ AI proxy is not available. Please check MCP Manager settings.'
          }],
          isError: true
        };
      }

      try {
        let response: string;

        if (systemPrompt) {
          response = await ai.completeWithSystem(
            systemPrompt,
            message,
            { temperature }
          );
        } else {
          response = await ai.complete(message, { temperature });
        }

        return {
          content: [{
            type: 'text',
            text: `🤖 AI Response:\n\n${response}`
          }]
        };
      } catch (error) {
        return handleAIError(error, 'chat');
      }
    }
  });

  // ai_status - Check AI availability and get available models
  server.addTool({
    name: 'ai_status',
    description: 'Check AI proxy status and list available models. Useful for debugging AI configuration.',

    schema: Type.Object({}),

    handler: async (params, context) => {
      const isConfigured = ai.isConfigured();

      if (!isConfigured) {
        return {
          content: [{
            type: 'text',
            text: `📊 AI Status: Not Configured

The AI proxy is not configured. Environment variables missing:
- MCP_AI_PROXY_URL: ${process.env.MCP_AI_PROXY_URL ? '✓ Set' : '✗ Not set'}
- MCP_AI_PROXY_TOKEN: ${process.env.MCP_AI_PROXY_TOKEN ? '✓ Set' : '✗ Not set'}

To enable AI features:
1. Open MCP Manager
2. Go to Settings → AI Provider
3. Configure your preferred AI provider
4. Restart this server`
          }]
        };
      }

      const isAvailable = await ai.isAvailable(true); // Force check

      if (!isAvailable) {
        return {
          content: [{
            type: 'text',
            text: `📊 AI Status: Configured but Unavailable

Configuration:
- MCP_AI_PROXY_URL: ✓ Set
- MCP_AI_PROXY_TOKEN: ✓ Set

However, the AI proxy is not responding.
Please check MCP Manager is running and AI provider is properly configured.`
          }]
        };
      }

      // Try to get available models
      try {
        const modelsResponse = await ai.getModels();
        const modelsList = modelsResponse.data
          .map((m) => `  - ${m.id}${m.owned_by ? ` (${m.owned_by})` : ''}`)
          .join('\n') || '  (no models available)';

        return {
          content: [{
            type: 'text',
            text: `📊 AI Status: Available ✓

Configuration:
- MCP_AI_PROXY_URL: ✓ Set
- MCP_AI_PROXY_TOKEN: ✓ Set
- Proxy Health: ✓ Responding

Available Models:
${modelsList}

You can now use AI tools like ai_summarize, ai_translate, ai_analyze_sentiment, and ai_chat.`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `📊 AI Status: Available ✓

Configuration:
- MCP_AI_PROXY_URL: ✓ Set
- MCP_AI_PROXY_TOKEN: ✓ Set
- Proxy Health: ✓ Responding

Could not fetch model list: ${error instanceof Error ? error.message : String(error)}

AI is available for use despite model list error.`
          }]
        };
      }
    }
  });
}

/**
 * Handle AI errors with user-friendly messages
 */
function handleAIError(error: unknown, operation: string): { content: Array<{ type: 'text'; text: string }>; isError: true } {
  if (error instanceof AIClientError) {
    const messages: Record<string, string> = {
      'NOT_CONFIGURED': 'AI proxy is not configured. Please set up AI in MCP Manager.',
      'UNAUTHORIZED': 'AI proxy authentication failed. The token may be invalid or expired. Try restarting the server.',
      'RATE_LIMITED': 'Too many AI requests. Please wait a moment and try again.',
      'API_ERROR': `AI provider error: ${error.message}`,
      'TIMEOUT': 'AI request timed out. The model may be overloaded, please try again.',
      'NETWORK_ERROR': 'Network error connecting to AI proxy. Check your connection and MCP Manager status.'
    };

    const message = messages[error.code] || `AI error: ${error.message}`;

    return {
      content: [{
        type: 'text',
        text: `❌ Failed to ${operation}\n\n${message}`
      }],
      isError: true
    };
  }

  return {
    content: [{
      type: 'text',
      text: `❌ Failed to ${operation}\n\nUnexpected error: ${error instanceof Error ? error.message : String(error)}`
    }],
    isError: true
  };
}
