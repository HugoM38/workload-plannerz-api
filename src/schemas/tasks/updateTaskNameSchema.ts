import Joi from "joi";

export const updateTaskNameSchema = Joi.object({
  name: Joi.string().required(),
});
