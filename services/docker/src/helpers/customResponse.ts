import { Response } from 'express';

type Payload = Record<string, any> | null;

export class CustomResponse {
  static ok(res: Response, message = 'OK', payload: Payload = null) {
    return res.status(200).json({ data: payload, error: false, message });
  }

  static created(res: Response, message = 'Created', payload: Payload = null) {
    return res.status(201).json({ data: payload, error: false, message });
  }

  static accepted(res: Response, message = 'Accepted', payload: Payload = null) {
    return res.status(202).json({ data: payload, error: false, message });
  }

  static badRequest(res: Response, message = 'Bad Request', payload: Payload = null) {
    return res.status(400).json({ data: payload, error: true, message });
  }

  static unauthorized(res: Response, message = 'Unauthorized', payload: Payload = null) {
    return res.status(401).json({ data: payload, error: false, message });
  }

  static forbidden(res: Response, message = 'Forbidden', payload: Payload = null) {
    return res.status(403).json({ data: payload, error: false, message });
  }

  static notFound(res: Response, message = 'Not Found', payload: Payload = null) {
    return res.status(404).json({ data: payload, error: false, message });
  }
}
