// lib/auth.js
// JWT helpers and middleware

import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production'

/**
 * Sign a JWT token
 * @param {Object} payload - Data to encode
 * @param {string} expiresIn - Token expiry (default 7 days)
 */
export function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

/**
 * Verify a JWT token
 * @param {string} token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

/**
 * Middleware to protect API routes
 * Returns decoded payload or null
 */
export function getAuthFromRequest(req) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null

  const token = authHeader.split(' ')[1]
  return verifyToken(token)
}

/**
 * Response helper for unauthorized requests
 */
export function unauthorizedResponse() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}