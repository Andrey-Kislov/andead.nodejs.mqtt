import joi from 'joi';

export const deviceRequestSchema = joi.object().keys({
    name: joi.string().required(),
    topic: joi.string().required()
});
