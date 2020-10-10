import validator from 'joi';

export function registerValidation(data: any) {
    const schema = validator.object({
      username: validator.string().min(4).max(100).required(),
      email: validator.string().min(6).max(100).required().email(),
      password: validator.string().min(8).max(100).required(),
    });
  
    return schema.validate(data);
}

export function loginValidation(data: any) {
    const schema = validator.object({
      email: validator.string().min(6).max(100).required().email(),
      password: validator.string().min(8).max(100).required(),
      redirectUrl: validator.string().min(3).max(255),
    });
  
    return schema.validate(data);
  }
  