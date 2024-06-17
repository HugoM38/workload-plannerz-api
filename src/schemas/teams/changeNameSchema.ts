import Joi from "joi";

export const changeNameSchema = Joi.object({
    name: Joi.string().required(),
});
