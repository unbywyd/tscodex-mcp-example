# MCP News Server

> **This is an example server for [@tscodex/mcp-sdk](https://www.npmjs.com/package/@tscodex/mcp-sdk)** - TypeScript SDK for creating MCP (Model Context Protocol) servers.

MCP server for news headlines and articles from NewsAPI. Provides tools for searching news by topic, getting top headlines by country/category, listing available news sources, and personalized user greetings.

This server integrates with **NewsAPI** (https://newsapi.org/) - a popular free API for news articles. You can get a free API key at https://newsapi.org/register.

> **Note:** This project also serves as a reference implementation demonstrating best practices for using `@tscodex/mcp-sdk` to create MCP servers.

## Features Demonstrated

- ✅ **Configuration Management**: Type-safe config with TypeBox schema
- ✅ **Tool Registration**: Real-world example with NewsAPI integration
- ✅ **Resource Registration**: Exposing news sources from NewsAPI
- ✅ **Prompt Registration**: Template prompts for AI models
- ✅ **Authentication**: Session-based auth with User role
- ✅ **User Data**: Using session information (email, fullName) in tools
- ✅ **Error Handling**: Custom error handlers
- ✅ **Logging**: Custom logging configuration
- ✅ **Secrets Management**: Secure access to API keys (SECRET_NEWSAPI_KEY)

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Project Structure

```
mcp-server-example/
├── src/
│   ├── config.ts          # Configuration schema definition
│   ├── config-loader.ts   # Configuration loading logic
│   ├── server.ts          # Server creation and configuration
│   ├── index.ts           # Main entry point
│   ├── utils.ts           # Utility functions (error sanitization)
│   └── tools/
│       ├── greeting.ts    # Greeting tools
│       ├── news.ts        # News API tools
│       ├── news-resources.ts  # News resources
│       └── news-prompts.ts    # News prompts
├── package.json
├── tsconfig.json
├── example-config.json    # Example configuration file
└── README.md
```

## Configuration

### Configuration File

Create a `.mcp-server-example.json` file in your project root (or use `example-config.json` as a template):

```json
{
  "greeting": "Hello",
  "maxItems": 10
}
```

### Configuration Sources

SDK loads configuration from multiple sources with the following priority:

1. **Extension Config** (`MCP_CONFIG` env var) - Highest priority
2. **CLI Arguments** (`--key value` format)
3. **Environment Variables** (converted from `ENV_VAR_NAME` to `camelCase`)
4. **Config File** (`.mcp-server-example.json`)
5. **Schema Defaults** - Lowest priority

### Override Config File Path

You can specify a custom config file path via CLI:

```bash
node dist/index.js --config ./custom-config.json
```

## Environment Variables

### Server Settings (Automatically Read by SDK)

- `MCP_HOST` - Server host (default: `0.0.0.0`)
- `MCP_PORT` - Server port (default: `3000`)
- `MCP_PROJECT_ROOT` - Project root directory
- `MCP_CONFIG` - Extension configuration (JSON string)
- `MCP_AUTH_TOKEN` - Authentication token (if auth is enabled)

### Secrets (Automatically Extracted by SDK)

Secrets are environment variables prefixed with `SECRET_`:

- `SECRET_NEWSAPI_KEY` - **Required**: NewsAPI key (get free key at https://newsapi.org/register)

**Important**: Secrets are automatically filtered from configuration and never exposed in logs or responses.

**Get your NewsAPI key:**
1. Visit https://newsapi.org/register
2. Sign up for free account
3. Copy your API key
4. Set it as environment variable: `SECRET_NEWSAPI_KEY=your_api_key_here`

### Custom Configuration

You can set any config field via environment variable:

```bash
# Set greeting via ENV (converted to camelCase automatically)
GREETING="Hi there" npm run dev

# Set maxItems
MAX_ITEMS=20 npm run dev
```

## Usage Examples

### Basic Server

```bash
# Start server (reads config from .mcp-server-example.json)
npm run dev
```

### With Custom Config

```bash
# Use custom config file
npm run dev -- --config ./my-config.json

# Override specific values via CLI
npm run dev -- --greeting "Hi" --maxItems 20
```

### With Environment Variables

```bash
# Set via ENV
GREETING="Hello World" MAX_ITEMS=50 npm run dev
```

### With NewsAPI Key

```bash
# Set NewsAPI key (required for news tools)
# Get your free key at: https://newsapi.org/register
SECRET_NEWSAPI_KEY="your-newsapi-key" npm run dev
```

## Tools

This example server includes the following tools:

### `greet`

Greet the current user using their session information (email, fullName).

**Arguments:**
- `formal` (boolean, optional): Use formal greeting style (default: false)

**Example:**
```json
{
  "name": "greet",
  "arguments": {
    "formal": false
  }
}
```

**Note**: Uses user's `fullName` from session if available, otherwise uses email username. Requires valid session.

### `get_news`

Get news headlines from NewsAPI. Supports top headlines by country/category or search by query.

**Arguments:**
- `query` (string, optional): Search query (e.g., "bitcoin", "technology"). If not provided, returns top headlines
- `country` (string, optional): ISO 3166-1 alpha-2 country code (e.g., "us", "gb", "ru"). Only for top headlines
- `category` (string, optional): News category - one of: business, entertainment, general, health, science, sports, technology. Only for top headlines
- `pageSize` (number, optional): Number of articles to return (1-100, default: 10)

**Examples:**

Get top headlines for US:
```json
{
  "name": "get_news",
  "arguments": {
    "country": "us",
    "pageSize": 5
  }
}
```

Search for news about a topic:
```json
{
  "name": "get_news",
  "arguments": {
    "query": "artificial intelligence",
    "pageSize": 10
  }
}
```

Get technology news:
```json
{
  "name": "get_news",
  "arguments": {
    "category": "technology",
    "country": "us"
  }
}
```

**Note**: Requires `SECRET_NEWSAPI_KEY` environment variable. Get free key at https://newsapi.org/register

## Resources

### `newsapi://sources`

Returns list of available news sources from NewsAPI.

**Note**: Requires `SECRET_NEWSAPI_KEY` environment variable. Returns list of sources with their categories, countries, and languages.

## Prompts

### `get_news_about`

Template for getting news about a specific topic.

**Arguments:**
- `topic` (string, required): Topic to search news for (e.g., "artificial intelligence", "climate change")

**Example:**
```json
{
  "name": "get_news_about",
  "arguments": {
    "topic": "artificial intelligence"
  }
}
```

### `greet_current_user`

Template for greeting the current logged-in user.

**Arguments:** None (uses session data automatically)

**Example:**
```json
{
  "name": "greet_current_user",
  "arguments": {}
}
```

## Code Walkthrough

### 1. Configuration Schema (`src/config.ts`)

Defines TypeBox schema for type-safe configuration:

```typescript
const ConfigSchema = Type.Object({
  greeting: Type.Optional(Type.String({
    default: 'Hello',
    description: 'Default greeting message'
  })),
  // ... more fields
});

export type Config = Static<typeof ConfigSchema>;
```

### 2. Server Creation (`src/index.ts`)

Main server setup with all features:

```typescript
const server = new McpServer<Config, Roles, Session>({
  name: 'mcp-server-example',
  version: '0.1.0',
  configSchema: ConfigSchemaExport,
  configFile: '.mcp-server-example.json',
  // ... more options
});
```

### 3. Tool Registration

Register tools with type-safe handlers:

```typescript
server.tool({
  name: 'greet',
  description: 'Greet a user',
  arguments: Type.Object({
    name: Type.String({ description: 'Name to greet' })
  }),
  handler: async (args, context) => {
    // Access config, projectRoot, secrets, session
    const config = context.config;
    // ... handler logic
  }
});
```

### 4. Resource Registration

Expose read-only data:

```typescript
server.resource({
  name: 'config',
  description: 'Current server configuration',
  uri: 'config://current',
  handler: async (uri, context) => {
    // Return resource content
  }
});
```

### 5. Prompt Registration

Create template prompts:

```typescript
server.prompt({
  name: 'greet_user',
  description: 'Template for greeting',
  arguments: Type.Object({
    userName: Type.String()
  }),
  handler: async (args, context) => {
    // Return prompt messages
  }
});
```

## Context Object

All handlers receive a `context` object with:

- `config`: Your configuration object (type-safe)
- `projectRoot`: Project root directory (from `MCP_PROJECT_ROOT`)
- `secrets`: Map of `SECRET_*` environment variables
- `session`: User session (if auth is enabled)
- `logger`: Logger instance

## Authentication

### Session Schema

Define what user data is available:

```typescript
const SessionSchema = Type.Object({
  email: Type.String(),
  fullName: Type.Optional(Type.String())
});
```

### Load Session

Extract session from auth token:

```typescript
loadSession: async (token: string, context) => {
  const tokenData = JSON.parse(token);
  return {
    email: tokenData.email,
    fullName: tokenData.fullName
  };
}
```

### Role-Based Access

Define roles and restrict tool access:

```typescript
roles: {
  User: async (session) => !!session.email,
  Admin: async (session) => session.email?.endsWith('@admin.com')
}
```

## Error Handling

Custom error handler for unhandled errors:

```typescript
server.onError((error, context) => {
  context.logger?.error('Error:', error);
  return {
    content: [{ type: 'text', text: 'An error occurred' }],
    isError: true
  };
});
```

## Security Best Practices

1. **Path Validation**: Always validate paths relative to project root
2. **Secrets**: Never expose secrets in logs or responses
3. **Input Validation**: Use TypeBox schemas for all inputs
4. **Error Messages**: Don't expose internal error details to clients
5. **Role-Based Access**: Use roles to restrict sensitive operations

## Extension Integration

When used with Cursor Extension:

1. Extension automatically sets `MCP_HOST`, `MCP_PORT`, `MCP_PROJECT_ROOT`
2. Extension can pass configuration via `MCP_CONFIG`
3. Extension can pass auth token via `MCP_AUTH_TOKEN`
4. Server automatically exposes Extension endpoints (`/health`, `/config`, etc.)

## Development Tips

1. **Type Safety**: Use TypeScript types extracted from schemas
2. **Default Values**: Define defaults in schema, not in code
3. **Logging**: Use context.logger for consistent logging
4. **Error Handling**: Always return proper error responses
5. **Testing**: Test tools with different configurations and contexts

## Next Steps

1. **Add More Tools**: Implement your own tools for your use case
2. **Add Resources**: Expose project files, documentation, etc.
3. **Add Prompts**: Create helpful prompt templates
4. **Customize Auth**: Implement your authentication logic
5. **Add Validation**: Add business logic validation in `loadConfig`

## License

MIT

