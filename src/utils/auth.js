

import jwtDecode from 'jwt-decode';

/**
 * Decodes a JWT token.
 * @param {string} token - The JWT token to decode.
 * @returns {Object} Decoded token payload.
 */
export function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
}