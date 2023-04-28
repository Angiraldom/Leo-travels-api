import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Function in charge of evaluating based on the expected result.
 * @param {boolean} expectAction - Value that is expect.
 * @param {boolean} action - Value offered.
 * @param {string} message - Personalized message.
 */
export async function validateAction(
  expectAction: boolean,
  action: boolean,
  message: string,
): Promise<void> {
  if (!expectAction) {
    if (!action) {
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  await validateFlat(action, message);
}

/**
 * Helper function of validateAction.
 * @param {boolean} action - Value offered.
 * @param {string} message - Personalized message.
 */
async function validateFlat(action: boolean, message: string) {
  if (action) {
    throw new HttpException(message, HttpStatus.BAD_REQUEST);
  }
}
