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

  // context_info - Demo resource showing context headers received from workspace
  server.addResource({
    name: 'context_info',
    description: 'Shows current request context including workspace ID, project root, and custom context headers configured in MCP Manager',
    uri: 'context',

    handler: async (uri, context) => {
      const info = {
        workspaceId: context.workspaceId || '(not set)',
        projectRoot: context.projectRoot || '(not set)',
        contextHeaders: context.contextHeaders || {},
        timestamp: new Date().toISOString()
      };

      const headersList = Object.entries(info.contextHeaders)
        .map(([key, value]) => `  - ${key}: ${value}`)
        .join('\n') || '  (no context headers configured)';

      const text = `Request Context Information
===========================

Workspace ID: ${info.workspaceId}
Project Root: ${info.projectRoot}

Custom Context Headers:
${headersList}

Timestamp: ${info.timestamp}

---
This resource demonstrates how context headers flow from
MCP Manager workspace settings to the server handler.

To configure context headers:
1. Open MCP Manager
2. Go to a workspace
3. Click on this server
4. Fill in the Context Headers fields (project-id, environment, custom-tag)
5. Call this resource again to see the values`;

      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text
          }
        ]
      };
    }
  });
}

