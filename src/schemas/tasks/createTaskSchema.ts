import Joi from "joi";

export const createTaskSchema = Joi.object({
    name: Joi.string().required(),
    owner: Joi.string(),
    team: Joi.string().required(),
    priority: Joi.number().required(),
    timeEstimation: Joi.number(),
    dueDate: Joi.number().required(),
});
