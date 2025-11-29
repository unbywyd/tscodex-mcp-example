import { Config, ConfigSchemaExport } from './config.js';
import { Value } from '@sinclair/typebox/value';

/**
 * Load configuration for SDK
 * 
 * This function is called by SDK's loadConfig option AFTER SDK has already loaded
 * config from file, CLI args, and ENV vars.
 * 
 * SDK automatically handles (before calling this function):
 * - Config file loading (from configFile option in server options)
 * - CLI arguments parsing (--key value format)
 * - Environment variables (converts ENV_VAR_NAME to camelCase)
 * - Merging with priority: Extension > CLI > ENV > File > Defaults
 * 
 * This function receives already parsed config and can transform/validate it further.
 * Extension config (MCP_CONFIG) is merged automatically by SDK with highest priority.
 */
export async function loadConfigForSDK(parsedConfig: Partial<Config>): Promise<Config> {
  // SDK already loaded config from file/CLI/ENV and passed it here
  // We just need to ensure it matches our schema and apply defaults
  // Use Value.Cast to safely transform and apply defaults
  const config = Value.Cast(ConfigSchemaExport, parsedConfig) as Config;
  
  return config;
}

