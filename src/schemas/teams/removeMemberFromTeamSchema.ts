import Joi from "joi";

export const removeMemberFromTeamSchema = Joi.object({
    userId: Joi.string().required(),
});
