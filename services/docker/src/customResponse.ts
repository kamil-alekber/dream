import { Response } from 'express';

export class CustomResponse {
  static malformed(
    res: Response,
    message = 'Request Malformed',
    payload: Record<string, any> | null = null
  ) {
    return res.status(400).json({ data: payload, error: true, message });
  }
}
// Res.status.error[400]('message', {});
