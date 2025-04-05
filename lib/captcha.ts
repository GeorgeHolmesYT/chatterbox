/**
 * Verifies an hCaptcha token with the hCaptcha API
 * @param token The token from the hCaptcha widget
 * @returns A promise that resolves to a boolean indicating if the token is valid
 */
export async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.HCAPTCHA_SECRET_KEY || '0x0000000000000000000000000000000000000000',
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Error verifying captcha:', error);
    return false;
  }
}
