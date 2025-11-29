import { McpServer } from '@tscodex/mcp-sdk';
import { Type } from '@sinclair/typebox';
import { Config } from '../config.js';

/**
 * Register news tools
 */
export function registerNewsTools(server: McpServer<Config>) {
  // get_news - Get news headlines from NewsAPI
  server.addTool({
    name: 'get_news',
    description: 'Get news headlines from NewsAPI. Supports top headlines by country/category or search by query. Requires SECRET_NEWSAPI_KEY environment variable.',
    
    schema: Type.Object({
      query: Type.Optional(Type.String({
        description: 'Search query (e.g., "bitcoin", "technology"). If not provided, returns top headlines'
      })),
      country: Type.Optional(Type.String({
        description: 'ISO 3166-1 alpha-2 country code (e.g., "us", "gb", "ru"). Only for top headlines'
      })),
      category: Type.Optional(Type.String({
        enum: ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'],
        description: 'News category. Only for top headlines'
      })),
      pageSize: Type.Optional(Type.Number({
        default: 10,
        minimum: 1,
        maximum: 100,
        description: 'Number of articles to return (1-100)'
      }))
    }),

    handler: async (params, context) => {
      const { query, country, category, pageSize = 10 } = params;
      
      // Get API key from secrets (SECRET_NEWSAPI_KEY)
      const apiKey = context.secrets.get('SECRET_NEWSAPI_KEY');
      
      if (!apiKey) {
        return {
          content: [
            {
              type: 'text',
              text: 'Error: NewsAPI key not found. Please set SECRET_NEWSAPI_KEY environment variable.\n\nGet your free API key at: https://newsapi.org/register'
            }
          ],
          isError: true
        };
      }

      try {
        // Build NewsAPI URL
        let url: string;
        if (query) {
          // Search everything endpoint
          url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&apiKey=${apiKey}`;
        } else {
          // Top headlines endpoint
          const params = new URLSearchParams({
            pageSize: pageSize.toString(),
            apiKey: apiKey
          });
          if (country) params.append('country', country);
          if (category) params.append('category', category);
          url = `https://newsapi.org/v2/top-headlines?${params.toString()}`;
        }

        // Make API request
        const response = await fetch(url);
        const data = await response.json() as {
          status: string;
          message?: string;
          articles?: Array<{
            title: string;
            source?: { name?: string };
            url: string;
          }>;
        };

        if (data.status === 'error') {
          return {
            content: [
              {
                type: 'text',
                text: `NewsAPI Error: ${data.message || 'Unknown error'}`
              }
            ],
            isError: true
          };
        }

        // Format response
        const articles = data.articles || [];
        if (articles.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'No articles found for your query.'
              }
            ]
          };
        }

        // Format articles list
        const articlesList = articles.map((article, index) => {
          return `${index + 1}. ${article.title}\n   Source: ${article.source?.name || 'Unknown'}\n   ${article.url}`;
        }).join('\n\n');

        const summary = query 
          ? `Found ${articles.length} articles for "${query}":\n\n${articlesList}`
          : `Top ${articles.length} headlines:\n\n${articlesList}`;

        return {
          content: [
            {
              type: 'text',
              text: summary
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching news: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  });
}

