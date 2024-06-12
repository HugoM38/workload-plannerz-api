import Joi from "joi";

export const createTaskSchema = Joi.object({
    name: Joi.string().required(),
    owner: Joi.string(),
    priority: Joi.number().required(),
    dueDate: Joi.number().required(),
});
