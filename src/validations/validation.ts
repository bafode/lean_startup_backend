import Joi from "joi/lib";

/* eslint-disable @typescript-eslint/no-explicit-any */
const passwordSchema = Joi.string()
  .min(8)
  .regex(/(?=.*[a-zA-Z])(?=.*\d)/) // At least one letter and one number
  .regex(/(?=.*[@$!%*?&])/)
  .messages({
    'string.min': 'le mot de passe doit comporter au moins 8 caractères',
    'string.pattern.base': 'le mot de passe doit comporter au moins une lettre, un chiffre et un caractère spécial',
  });

const objectIdSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .messages({
    'string.pattern.base': '"{{#label}}" must be a valid MongoDB ObjectId',
  });

const objectId = (value: string, helpers: any) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};


export default { objectId, passwordSchema };
  