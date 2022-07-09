import { writeFileSync } from 'fs'
import { generateKeyPair } from 'crypto'

const passphrase = process.env.PASSPHRASE || 'secret'

type Command = 'generate'

const args = process.argv.slice(2)

const command: Command = args[0] as Command || 'generate'

switch (command) {
  case 'generate':
    console.log('[keys] <generate> generating new key pair')

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
      writeFileSync('certs/jwtRS256.pem', publicKey)
      console.log('[keys] <generate> <public> \'certs/jwtRS256.pem\'')

      writeFileSync('certs/jwtRS256.key', privateKey)
      console.log('[keys] <generate> <private> \'certs/jwtRS256.key\'')
    })
    break

  default:
    console.log('[keys] <error> invalid command')
    break
}
