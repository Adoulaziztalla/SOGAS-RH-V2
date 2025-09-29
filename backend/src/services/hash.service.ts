import bcrypt from 'bcrypt';

/**
 * Hash Service - Handles password hashing and verification using bcrypt
 */
export class HashService {
  private readonly saltRounds: number;

  constructor(config?: { saltRounds?: number }) {
    this.saltRounds = config?.saltRounds || 10;
  }

  /**
   * Hash a plain text password
   * @param password - Plain text password to hash
   * @returns Hashed password
   */
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Verify a plain text password against a hash
   * @param password - Plain text password to verify
   * @param hash - Hashed password to compare against
   * @returns True if password matches, false otherwise
   */
  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}