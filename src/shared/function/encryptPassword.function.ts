import * as bcrypt from 'bcrypt';

/**
 * Function that is responsible for encrypting the password with bcrypt.
 * @param password - Password provided by user.
 * @returns {Promise<string>} - Password encrypted.
 */
export async function encrypt(password: string): Promise<string> {
  if (!password) return;

  return bcrypt.hashSync(password, 10);
}

/**
 * Function in charge of comparing the password provided by the user matches the one registered in the database.
 * @param {string} password - Password provided by the yser.
 * @param {string} hashedPassword - Password stored.
 * @returns {Promise<boolean>} - Password coincidence.
 */
export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  if (!hashedPassword) return;

  return await bcrypt.compare(password, hashedPassword);
}
