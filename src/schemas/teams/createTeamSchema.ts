import Joi from "joi";

export const createTeamSchema = Joi.object({
    name: Joi.string().required(),
    owner: Joi.string().required(),
});
