import Joi from "joi";

export const updateTaskNameSchema = Joi.object({
  timeEstimation: Joi.string().required(),
});
