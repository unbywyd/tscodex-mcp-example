# @tscodex/mcp-server-example

MCP (Model Context Protocol) server example demonstrating news headlines and articles from NewsAPI. Built with TypeScript and **[@tscodex/mcp-sdk](https://www.npmjs.com/package/@tscodex/mcp-sdk)** for rapid MCP server development.

**Built on [@tscodex/mcp-sdk](https://www.npmjs.com/package/@tscodex/mcp-sdk)** - This project uses the official TSCodex MCP SDK for server infrastructure, authentication, configuration management, and protocol handling.

---

## 🚀 Quick Links

<div align="center">

**[📦 MCP Manager](https://github.com/unbywyd/tscodex-mcp-manager-app)** | **[🌉 MCP Bridge](https://github.com/unbywyd/tscodex-mcp-manager-bridge)**

Desktop application for managing MCP servers | VS Code/Cursor extension bridge

</div>

---

## 🎯 What is This?

This is an **example MCP server** built on the **[@tscodex/mcp-sdk](https://www.npmjs.com/package/@tscodex/mcp-sdk)** that demonstrates best practices for creating MCP servers. It provides news search capabilities using NewsAPI and can work in two ways:

1. **Standalone Mode**: Run directly via `npx` or `npm`, passing environment variables and configuration

2. **Managed Mode**: Use with **[MCP Manager](https://github.com/unbywyd/tscodex-mcp-manager-app)** for workspace isolation, visual configuration, and seamless integration with Cursor

### About TSCodex

**TSCodex** is a project for building tools that work with LLMs. The first tool in this ecosystem is **MCP Manager** - a process manager that:

- **Manages MCP Server Processes**: Controls server lifecycle, monitors health, and handles restarts
- **Provides Visual Interface**: Beautiful UI built with React Flow to visualize and manage your MCP infrastructure
- **Enables Workspace Isolation**: Creates workspace proxies so one server can serve multiple Cursor projects
- **Manages Secrets Securely**: 3-level secret override system (Global → Workspace → Server) with OS keychain storage
- **Handles Authentication**: Centralized auth management for all servers
- **AI Agent Integration**: Register OpenAI-compatible APIs and proxy them to servers without exposing keys
- **Dynamic MCP Tools**: Create tools and resources dynamically through a special MCP server with AI-powered form generation

The **[@tscodex/mcp-sdk](https://www.npmjs.com/package/@tscodex/mcp-sdk)** is the foundation - a fast, type-safe SDK for building HTTP-based MCP servers. It doesn't require MCP Manager and can run standalone, but MCP Manager adds powerful management capabilities on top.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Cursor (IDE Editor)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         MCP Manager Bridge Extension                  │  │
│  │  - Auto-registers workspace                           │  │
│  │  - Syncs with MCP Manager                             │  │
│  │  - Updates Cursor mcp.json                            │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│              HTTP API + WebSocket                            │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
┌─────────────────────────┼────────────────────────────────────┐
│              MCP Manager (Desktop App)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  - Process Management                                  │  │
│  │  - Workspace Isolation (Proxy)                        │  │
│  │  - Visual Configuration UI                            │  │
│  │  - Secrets Management (3-level override)              │  │
│  │  - Permissions System                                 │  │
│  │  - AI Agent Proxy                                     │  │
│  │  - MCP Tools (Dynamic Server)                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│         ┌────────────────┴────────────────┐                  │
│         │                                 │                  │
│  ┌──────▼──────┐                  ┌──────▼──────┐          │
│  │ MCP Tools   │                  │ MCP Servers │          │
│  │ (Dynamic)   │                  │ (e.g. this) │          │
│  └──────┬──────┘                  └──────┬──────┘          │
│         │                                 │                  │
└─────────┼─────────────────────────────────┼──────────────────┘
          │                                 │
          └────────────┬────────────────────┘
                       │
          ┌────────────▼────────────┐
          │  @tscodex/mcp-sdk       │
          │  (Core SDK)              │
          └─────────────────────────┘
```

### How It Works

**The Problem**: Real projects require each Cursor workspace to work with its own workspace context. For example, a news server might need the root path of the current project to save articles or cache data. But you can't run a separate server instance for each project.

**The Solution**: **[MCP Manager](https://github.com/unbywyd/tscodex-mcp-manager-app)** allows you to:

- Run **one server instance** (e.g., `@tscodex/mcp-server-example`)
- Create **multiple workspace proxies** that forward requests with workspace context
- The SDK receives headers from the current workspace and allows one server to work with different workspaces

**The Bridge**: **[MCP Manager Bridge](https://github.com/unbywyd/tscodex-mcp-manager-bridge)** automatically:

- Registers the workspace in MCP Manager by project path
- Syncs Cursor with the manager
- Registers proxy MCP servers in local `mcp.json`
- Provides perfect encapsulation and connection between workspaces

---

## 🎨 Features

- 📰 **News Search**: Search news by topic, get top headlines by country/category
- 🌍 **News Sources**: List available news sources from NewsAPI
- 👋 **Personalized Greetings**: Greet users using session information
- 🤖 **AI Integration**: Example tools demonstrating AI Agent integration
- 📝 **Prompt Templates**: Pre-built prompt templates for common tasks
- 🔒 **Authentication**: Session-based authentication with role support
- ⚙️ **Type-Safe Config**: JSON Schema-based configuration with TypeBox
- 🔐 **Secrets Management**: Secure API key handling via `SECRET_*` prefix

---

## 📦 Installation

### Option 1: Standalone (via npx)

```bash
npx @tscodex/mcp-server-example@latest
```

### Option 2: Global Installation

```bash
npm install -g @tscodex/mcp-server-example
```

### Option 3: Managed Mode (Recommended)

Use with **[MCP Manager](https://github.com/unbywyd/tscodex-mcp-manager-app)** for the best experience:

1. **Install MCP Manager**: Download from [GitHub Releases](https://github.com/unbywyd/tscodex-mcp-manager-app/releases)

2. **Install Bridge Extension**: [MCP Manager Bridge](https://marketplace.visualstudio.com/items?itemName=unbywyd.mcp-manager-bridge) from VS Code Marketplace

3. **Add Server**: In MCP Manager, add `@tscodex/mcp-server-example` as a new server

4. **Configure**: Use the visual UI to configure the server (JSON Schema-based)

5. **Enable**: Enable the server for your workspace in Cursor

**Benefits of Managed Mode:**

- ✅ **Visual Configuration**: No need to edit JSON files manually
- ✅ **Workspace Isolation**: Each project gets its own workspace proxy
- ✅ **Secure Secrets**: 3-level secret override (Global → Workspace → Server)
- ✅ **Permissions Control**: Granular control over what each server can access
- ✅ **AI Agent Integration**: Use AI agents without exposing API keys to servers
- ✅ **Token Statistics**: Track AI usage transparently
- ✅ **Auto-sync**: Bridge automatically syncs with Cursor

---

## 🚀 Quick Start

### Standalone Mode

```bash
# Start server with default settings
npx @tscodex/mcp-server-example@latest

# Server will start on port 3000 by default (host: 0.0.0.0)
# MCP endpoint: http://localhost:3000/mcp

# With custom host and port
npx @tscodex/mcp-server-example@latest --host 127.0.0.1 --port 3000

# With project root (REQUIRED for standalone mode)
npx @tscodex/mcp-server-example@latest --host 127.0.0.1 --port 3000 --root /path/to/project

# Get server metadata (for MCP Manager integration)
npx @tscodex/mcp-server-example@latest --meta
```

### Managed Mode

1. **Start MCP Manager** desktop application

2. **Open Cursor** with your project

3. **Bridge Extension** automatically:
   - Registers your workspace
   - Connects to MCP Manager
   - Syncs enabled servers to Cursor's `mcp.json`

4. **Enable Server**: Click the play icon on `@tscodex/mcp-server-example` in the Bridge panel

5. **Configure**: Use MCP Manager UI to configure the server (if needed)

---

## ⚙️ Configuration

### Configuration File

Create `.mcp-server-example.json` in your project root:

```json
{
  "greeting": "Hello",
  "maxItems": 10
}
```

**Configuration Options:**

- `greeting` (string, optional, default: `"Hello"`): Default greeting message
- `maxItems` (number, optional, default: `10`): Maximum number of news items to return (1-100)

### Configuration Sources

SDK loads configuration from multiple sources with the following priority:

1. **Extension Config** (`MCP_CONFIG` env var) - Highest priority
2. **CLI Arguments** (`--key value` format)
3. **Environment Variables** (converted from `ENV_VAR_NAME` to `camelCase`)
4. **Config File** (`.mcp-server-example.json`)
5. **Schema Defaults** - Lowest priority

### Secrets Management

**⚠️ Security Note:** API keys are stored as **secrets** (environment variables with `SECRET_` prefix) instead of in configuration files.

**In Standalone Mode:**

```bash
export SECRET_NEWSAPI_KEY=your_newsapi_key
```

**In Managed Mode:**

MCP Manager provides a **3-level secret override system**:

1. **Global**: Secrets available to all servers
2. **Workspace**: Secrets specific to a workspace
3. **Server**: Secrets specific to a server instance

This allows fine-grained control over what secrets each server can access.

**Get API Keys:**

- **NewsAPI**: https://newsapi.org/register (Free tier available)

---

## 🔒 Security & Permissions

### Security Features

**MCP Manager** provides enterprise-grade security:

1. **OS Keychain Storage**: Secrets are stored in the operating system's secure keychain (Windows Credential Manager, macOS Keychain, Linux Secret Service)

2. **No Key Exposure**: API keys are never passed directly to MCP servers. Servers that need AI access use the AI Agent proxy mechanism

3. **Process Isolation**: Each server runs in its own process with isolated environment

4. **Permission System**: Granular control over what each server can access

5. **Workspace Scoping**: File system access is always scoped to the project root - servers cannot access files outside the workspace

### Permissions System

MCP Manager's permission system allows you to configure:

- **Environment Variables**: Which environment variables are available to the server
- **Secrets Access**: Which secrets the server can access (3-level override: Global → Workspace → Server)
- **AI Agent Access**: Whether the server can use the AI Agent proxy, and which models are allowed
- **File System Access**: Workspace root access (always scoped to project, cannot access parent directories)

**Example Permission Configuration:**

```json
{
  "envVars": ["NODE_ENV", "DEBUG"],
  "secrets": ["SECRET_NEWSAPI_KEY"],
  "aiAgent": {
    "enabled": true,
    "allowedModels": ["gpt-4", "gpt-3.5-turbo"]
  }
}
```

### MCP Manager Key Features

**MCP Manager** is a comprehensive desktop application that provides:

#### 1. **Visual Server Management**
- Beautiful React Flow-based interface to visualize your MCP infrastructure
- See all servers, workspaces, and their connections at a glance
- Drag-and-drop interface for managing server configurations

#### 2. **Server Discovery & Metadata**
- Automatically discovers tools, resources, and prompts from MCP servers
- Displays JSON Schema for server configuration
- Visual configuration editor based on schema - no manual JSON editing needed

#### 3. **Workspace Isolation**
- Create workspace proxies for each Cursor project
- One server instance can serve multiple workspaces
- Each workspace gets its own isolated context and project root
- SDK automatically receives workspace headers and adapts behavior

#### 4. **3-Level Secret Override System**
```
Global Secrets (All Servers)
    ↓
Workspace Secrets (All Servers in Workspace)
    ↓
Server-Specific Secrets (Only This Server)
```
- Fine-grained control over secret access
- Secrets stored securely in OS keychain
- Never exposed in logs or configuration files

#### 5. **AI Agent Proxy**
- Register OpenAI-compatible APIs (any baseUrl + API key)
- Proxy AI requests to servers without exposing keys
- Track token usage transparently
- Permission-based access control per server
- Cost monitoring and statistics

#### 6. **Dynamic MCP Tools Server**
- Special MCP server that allows dynamic creation of tools and resources
- AI-powered form generation - describe what you need, AI fills the form
- Perfect for rapid prototyping and custom tool creation
- Integration with AI Agent for intelligent tool generation

#### 7. **Process Management**
- Start, stop, restart servers with one click
- Health monitoring and automatic recovery
- Real-time logs and status updates
- Resource usage tracking

#### 8. **Cursor Integration via Bridge**
- Automatic workspace registration by project path
- Real-time synchronization between Cursor and MCP Manager
- Automatic `mcp.json` updates in Cursor
- Seamless enable/disable of servers per workspace

---

## 🤖 AI Agent Integration

MCP Manager includes a built-in **AI Agent** that:

1. **Registers OpenAI-compatible APIs**: Configure via `baseUrl` and API key
2. **Provides Proxy**: Servers can use AI without direct API key access
3. **Token Statistics**: Track all AI usage transparently
4. **Permission-Based**: Each server must have AI Agent access enabled in permissions

**How It Works:**

1. **Register AI Provider** in MCP Manager:
   - Base URL: `https://api.openai.com/v1`
   - API Key: (stored securely in OS keychain)
   - Model: `gpt-4`, `gpt-3.5-turbo`, etc.

2. **Enable for Server**: In server permissions, enable AI Agent access

3. **Use in Server**: The SDK provides methods to access the AI Agent:

   ```typescript
   const aiResponse = await server.getAiAgent().chat({
     model: 'gpt-4',
     messages: [{ role: 'user', content: 'Generate news summary' }]
   });
   ```

4. **Track Usage**: All token usage is tracked and displayed in MCP Manager

**Benefits:**

- ✅ No API keys exposed to servers
- ✅ Centralized AI usage tracking
- ✅ Easy to switch AI providers
- ✅ Cost monitoring

---

## 🛠️ Available Tools

### News Tools

- `get_news` - Get news headlines from NewsAPI. Supports top headlines by country/category or search by query
  - Arguments: `query` (optional), `country` (optional), `category` (optional), `pageSize` (optional, 1-100, default: 10)

### Greeting Tools

- `greet` - Greet the current user using their session information (email, fullName)
  - Arguments: `formal` (boolean, optional): Use formal greeting style (default: false)

### AI Demo Tools

- `ai_demo_chat` - Example tool demonstrating AI Agent integration
  - Shows how to use the AI Agent proxy from MCP Manager

---

## 📚 Resources

### `newsapi://sources`

Returns list of available news sources from NewsAPI with their categories, countries, and languages.

---

## 📝 Prompts

### `get_news_about`

Template for getting news about a specific topic.

**Arguments:**
- `topic` (string, required): Topic to search news for (e.g., "artificial intelligence", "climate change")

### `greet_current_user`

Template for greeting the current logged-in user. Uses session data automatically.

---

## 📚 Example Usage

### Example 1: Get Top Headlines

```bash
# Tool: get_news
# Country: us
# Category: technology
# Page Size: 5
```

### Example 2: Search News

```bash
# Tool: get_news
# Query: "artificial intelligence"
# Page Size: 10
```

### Example 3: Greet User

```bash
# Tool: greet
# Formal: false
```

---

## 🔧 Environment Variables

All environment variables are optional with sensible defaults:

```bash
# Server settings
MCP_PORT=3000              # Server port (default: 3000)
MCP_HOST=0.0.0.0          # Server host (default: 0.0.0.0)
MCP_PATH=/mcp             # MCP endpoint path (default: /mcp)
MCP_PROJECT_ROOT=/path     # Project root directory

# Configuration (alternative to config file)
GREETING=Hello
MAX_ITEMS=10

# API Keys (required for news tools)
SECRET_NEWSAPI_KEY=your_key
```

---

## 🏗️ Built on @tscodex/mcp-sdk

This project is built on top of **[@tscodex/mcp-sdk](https://www.npmjs.com/package/@tscodex/mcp-sdk)**, which provides:

- ✅ **MCP Server Infrastructure**: HTTP transport, protocol handling, request routing
- ✅ **Authentication & Session Management**: Secure session handling
- ✅ **Configuration Loading**: CLI args, env vars, config files with priority system
- ✅ **Secrets Management**: `SECRET_*` environment variable handling
- ✅ **Workspace Context**: Automatic workspace root detection and header handling
- ✅ **AI Agent Integration**: Built-in support for AI Agent proxy
- ✅ **Type Safety**: Full TypeScript support with TypeBox schemas

**Key Features of the SDK:**

- Fast HTTP-based MCP server creation
- No database required - stateless design
- Works with or without MCP Manager
- Automatic workspace context from headers
- JSON Schema-based configuration

---

## 🧪 Development

```bash
# Clone repository
git clone https://github.com/unbywyd/tscodex-mcp-server-example.git
cd tscodex-mcp-server-example

# Install dependencies
npm install

# Build
npm run build

# Run in development mode
npm run dev

# Run production build
npm start

# Get metadata (for MCP Manager)
npm run meta
```

---

## 📁 Project Structure

```
mcp-server-example/
├── src/
│   ├── index.ts              # Entry point
│   ├── server.ts             # Server setup
│   ├── config.ts             # Configuration schema
│   ├── config-loader.ts      # Config loading logic
│   ├── utils.ts              # Utility functions
│   └── tools/                # MCP tools
│       ├── greeting.ts       # Greeting tools
│       ├── news.ts           # News API tools
│       ├── news-resources.ts # News resources
│       ├── news-prompts.ts   # News prompts
│       └── ai-demo.ts        # AI demo tools
├── dist/                     # Compiled JavaScript
├── package.json
├── tsconfig.json
├── example-config.json       # Example configuration
└── README.md
```

---

## 📋 Requirements

- Node.js >= 18.0.0
- NewsAPI key (optional, but required for news tools) - Get free key at https://newsapi.org/register

---

## 🖥️ Platform Support

**Windows**: ✅ Fully supported - Pre-built binaries available with code signing

**macOS**: ⚠️ Requires code signing - The project is built for Windows primarily. macOS requires code signing for distribution. Developers can build and sign their own binaries using the available resources in the repository. **If you'd like to collaborate on macOS support or have code signing capabilities, please contact the author.**

**Linux**: ✅ Fully supported - Pre-built binaries available

> **Note**: MCP Manager is currently built primarily for Windows. macOS support requires code signing certificates. All source code and build resources are available in the repository for developers who want to build and sign their own macOS binaries. If you're interested in collaborating on macOS support, please reach out!

---

## 🔗 Related Projects

- **[MCP Manager](https://github.com/unbywyd/tscodex-mcp-manager-app)** - Desktop application for MCP server management
- **[MCP Manager Bridge](https://github.com/unbywyd/tscodex-mcp-manager-bridge)** - VS Code/Cursor extension bridge
- **[@tscodex/mcp-sdk](https://www.npmjs.com/package/@tscodex/mcp-sdk)** - SDK for building MCP servers
- **[@tscodex/mcp-images](https://github.com/unbywyd/tscodex-mcp-images)** - Image processing MCP server
- **[MCP Server Example (this project)](https://github.com/unbywyd/tscodex-mcp-server-example)** - Example MCP server

---

## 📄 License

MIT

---

## 👤 Author

[unbywyd](https://github.com/unbywyd)

**Website**: [tscodex.com](https://tscodex.com)

---

## 🔗 Links

- **Website**: https://tscodex.com
- **GitHub**: https://github.com/unbywyd/tscodex-mcp-server-example
- **NPM**: https://www.npmjs.com/package/@tscodex/mcp-server-example
- **Issues**: https://github.com/unbywyd/tscodex-mcp-server-example/issues
- **MCP SDK**: https://www.npmjs.com/package/@tscodex/mcp-sdk
- **MCP SDK GitHub**: https://github.com/unbywyd/tscodex-mcp-sdk
- **MCP Manager**: https://github.com/unbywyd/tscodex-mcp-manager-app
- **MCP Bridge**: https://github.com/unbywyd/tscodex-mcp-manager-bridge
