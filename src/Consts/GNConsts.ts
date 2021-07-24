import fs from 'fs'
import path from 'path'
import https from 'https'
import dotenv from 'dotenv'

dotenv.config()
export const CONTENT_TYPE = 'application/json'
export const CREDENTIALS = Buffer.from(`${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENT_SECRET}`).toString('base64')
export const CERTIFICATE = fs.readFileSync(path.resolve(__dirname, '..', 'certs', process.env.GN_CERT))
export const AGENT = new https.Agent({pfx: CERTIFICATE,passphrase: ''})