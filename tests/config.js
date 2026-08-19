import dotenv from 'dotenv'

dotenv.config()

export default {
  baseUrl: 'http://localhost:8008',
  defaultPassword: process.env.DEFAULT_USER_PASSWORD,
  externalUrl: 'http://localhost:8000',
  jwtToken: process.env.JWT_TOKEN,
  notifyCallbackToken: process.env.NOTIFY_CALLBACK_TOKEN
}
