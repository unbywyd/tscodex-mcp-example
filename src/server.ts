import { McpServer, Type } from '@tscodex/mcp-sdk';
import type { Static } from '@sinclair/typebox';
import { ConfigSchemaExport, type Config } from './config.js';
import { loadConfigForSDK } from './config-loader.js';
import { registerNewsTools } from './tools/news.js';
import { registerGreetingTools } from './tools/greeting.js';
import { registerNewsResources } from './tools/news-resources.js';
import { registerNewsPrompts } from './tools/news-prompts.js';
import { registerAIDemoTools } from './tools/ai-demo.js';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Session schema - only email (required) and fullName (optional)
 * Other fields from token are ignored
 */
const SessionSchema = Type.Object({
  email: Type.String({ description: 'User email address' }),
  fullName: Type.Optional(Type.String({ description: 'User full name' }))
});

type Session = Static<typeof SessionSchema>;
type Roles = 'User';

/**
 * Create and configure MCP server
 * SDK handles --meta flag internally (disables logger, outputs JSON, exits)
 */
export async function createServer() {
  const server = new McpServer<Config, Roles, Session>({
    name: 'mcp-server-example',
    version: '0.1.0',
    description: 'MCP server for news headlines and articles from NewsAPI. Provides tools for searching news by topic, getting top headlines by country/category, listing available news sources, and personalized user greetings.',
    configSchema: ConfigSchemaExport,
    configFile: '.mcp-server-example.json',
    loadConfig: loadConfigForSDK,

    // Authentication configuration
    auth: {
      sessionSchema: SessionSchema,
      requireSession: false, // Session is optional - tools can work without auth

      // Load session from token - extract only email and fullName, ignore other fields
      loadSession: async (token: string, context) => {
        try {
          // Try to parse token as JSON
          const tokenData = JSON.parse(token);

          // Extract only email and fullName, ignore other fields
          const session: Session = {
            email: tokenData.email
          };

          // Add fullName only if it exists
          if (tokenData.fullName && typeof tokenData.fullName === 'string') {
            session.fullName = tokenData.fullName;
          }

          // Validate that email exists
          if (!session.email || typeof session.email !== 'string') {
            throw new Error('Email is required in session token');
          }

          return session;
        } catch (error) {
          // If token is not JSON or parsing failed, throw error
          throw new Error(`Invalid session token: ${error instanceof Error ? error.message : String(error)}`);
        }
      },

      // Single role: User
      roles: {
        User: async (session, context) => {
          // User role is granted if session has email
          return !!session.email;
        }
      }
    },

    // SDK will disable logger automatically if --meta flag is present
    logger: {
      info: (msg: string, ...args: unknown[]) => console.log(`[INFO] ${msg}`, ...args),
      error: (msg: string, ...args: unknown[]) => console.error(`[ERROR] ${msg}`, ...args),
      warn: (msg: string, ...args: unknown[]) => console.warn(`[WARN] ${msg}`, ...args),
      debug: (msg: string, ...args: unknown[]) => isDev ? console.debug(`[DEBUG] ${msg}`, ...args) : undefined
    },

    // Error handling
    errorHandler: (error: unknown, errorContext) => {
      const logger = (errorContext.context as any).server?.logger;
      if (logger) {
        logger.error('Unhandled error:', error);
      }
      return 'An error occurred while processing your request. Please try again.';
    },

    // Custom context headers - demonstrate per-request data from workspace settings
    // MCP Manager UI will show input fields for these in workspace settings
    contextHeaders: ['project-id', 'environment', 'custom-tag']
  });

  // Register tools, resources, and prompts
  // Tools can access config and projectRoot via context
  registerGreetingTools(server);
  registerNewsTools(server);
  registerNewsResources(server);
  registerNewsPrompts(server);
  registerAIDemoTools(server);

  return { server };
}

