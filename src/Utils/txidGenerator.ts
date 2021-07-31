import crypto from 'crypto'

const RandomTxid = (): string => crypto.randomBytes(16).toString('hex') 

export default RandomTxid