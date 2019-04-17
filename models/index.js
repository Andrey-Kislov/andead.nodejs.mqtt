import joi from 'joi';

import { deviceRequestSchema } from './device-request.model';

const schemas = Object.create({ deviceRequestSchema });

export const schemaValidator = async (object, type) => {
    if (!object) {
        throw new Error('Object to validate not provided');
    }

    if (!type) {
        throw new Error('Schema type to validate not provided');
    }

    const {error, value} = await joi.validate(object, schemas[type]);

    if (error) {
        throw new Error(`Invalid ${type} data, err: ${error}`);
    }

    return value;
}
