import bcrypt from 'bcrypt';

export class HashService {
  async hash(plainText): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(plainText, saltRounds);
  }

  async unhash(plainText, hash): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}
