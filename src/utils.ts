/**
 * Utility functions for security and error handling
 */

/**
 * Sanitize error message to remove potentially sensitive information
 * Removes API keys, tokens, and other sensitive data
 */
export function sanitizeError(errorText: string, maxLength: number = 200): string {
  if (!errorText) return '';
  
  let sanitized = errorText;
  
  // Remove potential API keys (long alphanumeric strings)
  sanitized = sanitized.replace(/[a-zA-Z0-9]{32,}/g, (match) => {
    // Only mask if it looks like an API key (long alphanumeric)
    if (match.length > 40) {
      return '[API_KEY_REMOVED]';
    }
    return match;
  });
  
  // Remove bearer tokens
  sanitized = sanitized.replace(/Bearer\s+[a-zA-Z0-9_-]+/gi, 'Bearer [TOKEN_REMOVED]');
  
  // Remove authorization headers
  sanitized = sanitized.replace(/authorization[:\s]+[^\s]+/gi, 'authorization: [REMOVED]');
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength) + '...';
  }
  
  return sanitized;
}

/**
 * Sanitize error object for logging/returning
 */
export function sanitizeErrorForResponse(error: unknown): string {
  if (error instanceof Error) {
    return sanitizeError(error.message);
  }
  return sanitizeError(String(error));
}

