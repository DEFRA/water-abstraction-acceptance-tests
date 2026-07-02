/**
 * Extracts a link from a Notify email body and rewrites its host to point at the given base URL
 *
 * @param {object} body - The response body from the `/notifications/last` endpoint
 * @param {string} linkType - The personalisation key the link is stored under, for example 'reset_url'
 * @param {string} baseUrl - The base URL to rewrite the link's host to
 *
 * @returns {string} The link with its host replaced by `baseUrl`
 */
export function extractNotificationLink(body, linkType, baseUrl) {
  const link = body.data[0].personalisation[linkType]

  return link.replace(/^https?:\/\/[^/]+/, baseUrl)
}
