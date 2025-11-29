import { McpServer } from '@tscodex/mcp-sdk';
import { Config } from '../config.js';

/**
 * Register news resources
 */
export function registerNewsResources(server: McpServer<Config>) {
  // news_sources - List of available news sources from NewsAPI
  server.addResource({
    name: 'news_sources',
    description: 'List of available news sources from NewsAPI',
    uri: 'sources',
    
    handler: async (uri, context) => {
      // Get API key from secrets
      const apiKey = context.secrets.get('SECRET_NEWSAPI_KEY');
      
      if (!apiKey) {
        return {
          contents: [
            {
              uri,
              mimeType: 'text/plain',
              text: 'Error: NewsAPI key not found. Please set SECRET_NEWSAPI_KEY environment variable.'
            }
          ]
        };
      }

      try {
        // Fetch sources from NewsAPI
        const response = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
        const data = await response.json() as {
          status: string;
          message?: string;
          sources?: Array<{
            name: string;
            id: string;
            category: string;
            country: string;
            language: string;
          }>;
        };

        if (data.status === 'error') {
          return {
            contents: [
              {
                uri,
                mimeType: 'text/plain',
                text: `Error: ${data.message || 'Failed to fetch sources'}`
              }
            ]
          };
        }

        // Format sources list
        const sources = data.sources || [];
        const sourcesList = sources.map((source) => {
          return `- ${source.name} (${source.id})\n  Category: ${source.category}\n  Country: ${source.country}\n  Language: ${source.language}`;
        }).join('\n\n');

        return {
          contents: [
            {
              uri,
              mimeType: 'text/plain',
              text: `Available News Sources (${sources.length}):\n\n${sourcesList}`
            }
          ]
        };
      } catch (error) {
        return {
          contents: [
            {
              uri,
              mimeType: 'text/plain',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    }
  });
}

