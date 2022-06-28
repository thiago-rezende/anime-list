const fs = require('fs')
const { generateKeyPair } = require('crypto')

const passphrase = process.env.PASSPHRASE || 'secret'

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase
  }
}, (_err, publicKey, privateKey) => {
  fs.writeFileSync('certs/jwtRS256.pem', publicKey)
  fs.writeFileSync('certs/jwtRS256.key', privateKey)
})
