import dotenv from 'dotenv'

// The app runs with TZ=UTC. Calculated dates (see calculated-dates.helpers.js) are built using the
// water-abstraction-engine's date functions, which use local time, so we need to match the app's timezone to avoid
// off-by-one-hour discrepancies crossing date boundaries.
process.env.TZ = 'UTC'

dotenv.config()

export default {
  baseUrl: 'http://localhost:8008',
  defaultPassword: process.env.DEFAULT_USER_PASSWORD,
  externalUrl: 'http://localhost:8000',
  jwtToken: process.env.JWT_TOKEN,
  notifyCallbackToken: process.env.NOTIFY_CALLBACK_TOKEN
}
