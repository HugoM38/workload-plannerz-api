import Joi from "joi";

export const updateTimeEstimationSchema = Joi.object({
  timeEstimation: Joi.number().required(),
});
