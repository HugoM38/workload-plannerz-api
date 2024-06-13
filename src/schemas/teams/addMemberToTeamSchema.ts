import Joi from "joi";

export const addMemberToTeamSchema = Joi.object({
    userId: Joi.string().required(),
});
