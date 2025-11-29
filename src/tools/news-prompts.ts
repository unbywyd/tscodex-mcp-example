import { McpServer } from '@tscodex/mcp-sdk';
import { Type } from '@sinclair/typebox';
import { Config } from '../config.js';

/**
 * Register news prompts
 */
export function registerNewsPrompts(server: McpServer<Config>) {
  // get_news_about - Template for getting news about a specific topic
  server.addPrompt({
    name: 'get_news_about',
    description: 'Template for getting news about a specific topic',
    
    arguments: Type.Object({
      topic: Type.String({
        description: 'Topic to search news for (e.g., "artificial intelligence", "climate change")'
      })
    }),

    handler: async (args, context) => {
      const topic = (args as { topic: string }).topic;
      
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please get the latest news about "${topic}" using the get_news tool. Return the top 5 most relevant articles.`
            }
          }
        ]
      };
    }
  });

  // greet_current_user - Template for greeting the current logged-in user
  server.addPrompt({
    name: 'greet_current_user',
    description: 'Template for greeting the current logged-in user',
    
    arguments: Type.Object({}),

    handler: async (args, context) => {
      const config = context.config;
      const session = context.session;
      
      const email = session?.email;
      const userName = session?.fullName || (email && typeof email === 'string' ? email.split('@')[0] : null) || 'User';
      
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please greet the current user using the greet tool. The user's name is ${userName}. Use ${config.greeting || 'Hello'} as the greeting.`
            }
          }
        ]
      };
    }
  });
}

