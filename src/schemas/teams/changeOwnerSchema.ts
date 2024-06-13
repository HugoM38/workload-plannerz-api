import Joi from "joi";

export const changeOwnerSchema = Joi.object({
    userId: Joi.string().required(),
});
