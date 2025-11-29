import { McpServer } from '@tscodex/mcp-sdk';
import { Type } from '@sinclair/typebox';
import { Config } from '../config.js';

/**
 * Register greeting tools
 */
export function registerGreetingTools(server: McpServer<Config>) {
  // greet - Greet the current user using their session information
  server.addTool({
    name: 'greet',
    description: 'Greet the current user using their session information (email, fullName)',
    
    schema: Type.Object({
      formal: Type.Optional(Type.Boolean({
        default: false,
        description: 'Use formal greeting style'
      }))
    }),

    handler: async (params, context) => {
      const { formal } = params;
      const config = context.config;
      const session = context.session;
      const greeting = config.greeting || 'Hello';
      
      // Use user's name from session if available, otherwise use email username
      const email = session?.email;
      const userName = session?.fullName || (email && typeof email === 'string' ? email.split('@')[0] : null) || 'User';
      
      const message = formal 
        ? `${greeting}, ${userName}. How may I assist you today?`
        : `${greeting}, ${userName}!`;
      
      // Include user email in response if available
      const details = session?.email ? `\n\nLogged in as: ${session.email}` : '';
      
      return {
        content: [
          {
            type: 'text',
            text: message + details
          }
        ]
      };
    }
  });
}

