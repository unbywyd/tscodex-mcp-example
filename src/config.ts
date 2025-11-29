/**
 * Configuration Schema for Example MCP Server
 * 
 * This file demonstrates how to define a TypeBox schema for your server configuration.
 * The schema is used for:
 * - Type-safe configuration in TypeScript
 * - Automatic validation and transformation
 * - Default values application
 * - Extension UI generation (if using Cursor Extension)
 */

import { Type } from '@sinclair/typebox';
import type { Static, TSchema } from '@sinclair/typebox';

/**
 * Define your configuration schema using TypeBox
 * 
 * TypeBox provides runtime validation and type inference.
 * The Static<> utility type extracts TypeScript types from the schema.
 */
const ConfigSchema = Type.Object({
  // Optional string field with description
  // This will be used in Extension UI and documentation
  greeting: Type.Optional(Type.String({
    default: 'Hello',
    description: 'Default greeting message for tools'
  })),

  // Number field with constraints
  maxItems: Type.Number({
    default: 10,
    minimum: 1,
    maximum: 100,
    description: 'Maximum number of items to return in list operations'
  })
});

/**
 * TypeScript type extracted from schema
 * Use this type throughout your codebase for type safety
 */
export type Config = Static<typeof ConfigSchema>;

/**
 * Export schema for SDK
 * SDK uses this schema for:
 * - Configuration validation
 * - Default value application
 * - Extension UI generation
 */
export const ConfigSchemaExport: TSchema = ConfigSchema;

