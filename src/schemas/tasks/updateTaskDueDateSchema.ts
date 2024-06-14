import Joi from "joi";

export const updateTaskDueDateSchema = Joi.object({
    dueDate: Joi.number().required(),
});
