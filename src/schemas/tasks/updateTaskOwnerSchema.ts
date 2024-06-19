import Joi from "joi";

export const updateTaskOwnerSchema = Joi.object({
  ownerId: Joi.string().required(),
});
