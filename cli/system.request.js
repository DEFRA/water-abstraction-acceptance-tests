/**
 * Make HTTP calls to the service using native JavaScript fetch API
 *
 * > The Fetch API provides an interface for fetching resources (including across the network). It is a more powerful
 * > and flexible replacement for XMLHttpRequest.
 * >
 * > {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API|MDN Web Docs: Fetch API}
 *
 * This module handles checking whether the response was ok, and formulating an error if not. It avoids the need to
 * repeat this logic elsewhere.
 *
 * @module SystemRequest
 */

import fs from 'fs'
import path from 'path'

const ENVS_DIR = 'environments'

export async function get (path) {
  const env = await _environment()

  const url = new URL(path, env.config.baseUrl)
  const requestOptions = _requestOptions('GET')

  const response = await fetch(url, requestOptions)

  if (!response.ok) {
    await _error(path, response)
  }

  return response
}

export async function post (path, body = null) {
  const env = await _environment()

  const url = new URL(path, env.config.baseUrl)
  const requestOptions = _requestOptions('POST', body)

  const response = await fetch(url, requestOptions)

  if (!response.ok) {
    await _error(path, response)
  }

  return response
}

/**
 * Loads the 'local' environment config.
 *
 * @private
 */
async function _environment () {
  const configPath = path.join(process.cwd(), ENVS_DIR, 'local.json')
  const fileContent = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

  return {
    name: 'local',
    ...fileContent
  }
}

async function _error (path, response) {
  let message = `Request to ${path} failed with ${response.status} ${response.statusText}`

  const errorData = await response.json().catch(() => {
    return null
  })

  if (errorData) {
    message += `\n${JSON.stringify(errorData)}`
  }

  throw new Error(message)
}

function _requestOptions (method, body) {
  const requestOptions = {
    method
  }

  if (body) {
    requestOptions.headers = {
      'User-Agent': 'undici-stream-example',
      'Content-Type': 'application/json'
    }
    requestOptions.body = JSON.stringify(body)
  }

  return requestOptions
}
