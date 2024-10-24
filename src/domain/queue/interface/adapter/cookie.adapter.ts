import { Response } from 'express';

export class CookieAdapter {
  setCookie(response: Response, token: string, expiryDate: Date): void {
    response.cookie('token', token, {
      expires: expiryDate,
      httpOnly: true,
      signed: true,
    });
  }

  clearCookie(response: Response): void {
    response.clearCookie('token');
  }
}
