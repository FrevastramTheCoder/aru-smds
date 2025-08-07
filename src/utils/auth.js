
// /**
//  * Decodes a JWT token.
//  * @param {string} token - The JWT token.
//  * @returns {Object} Decoded token payload or empty object on error.
//  */
// export function decodeToken(token) {
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split('')
//         .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//         .join('')
//     );
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     console.error('Token decoding failed:', error);
//     return {};
//   }
// }

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