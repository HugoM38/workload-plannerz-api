import Joi from "joi";

export const updateTaskPrioritySchema = Joi.object({
    priority: Joi.number().required(),
});
