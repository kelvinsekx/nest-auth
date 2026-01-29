import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt,
} from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const promisedKey = async () =>
  (await scryptAsync('password', 'salt', 32)) as Buffer;

export class TextCipher {
  iv = randomBytes(16);

  password = 'Password used to generate key';

  async encrypt(textToEncrypt) {
    const key = await promisedKey();
    const cipher = createCipheriv('aes-256-ctr', key, this.iv);
    return Buffer.concat([cipher.update(textToEncrypt), cipher.final()]);
  }

  async decryptedText(encryptedText) {
    const key = await promisedKey();
    const decipher = createDecipheriv('aes-256-ctr', key, this.iv);
    return Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  }
}
