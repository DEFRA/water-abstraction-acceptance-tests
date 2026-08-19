import dotenv from 'dotenv'

dotenv.config()

export default {
  baseUrl: 'http://localhost:8008',
  defaultPassword: 'P@55word',
  externalUrl: 'http://localhost:8000',
  jwtToken: process.env.JWT_TOKEN,
  notifyCallbackToken: process.env.NOTIFY_CALLBACK_TOKEN
}
