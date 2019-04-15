import { logInfo } from './common';

export async function addDevice(pool, mqttClient, userId, request, response) {
    if (!pool) {
        throw new TypeError('PostgreSQL Pool must be set!');
    }

    if (!mqttClient) {
        throw new TypeError('MQTT client must be set!');
    }

    if (userId) {
        try {
            if (!request || !request.name || !request.topic) {
                throw new TypeError('Invalid request object!');
            }

            mqttClient.subscribe(request.topic, () => logInfo(`Subscribed to topic ${request.topic}`));

            const res = await pool.query('INSERT INTO zigbee_devices (user_id, name, topic) VALUES($1, $2, $3)', 
                [userId, request.name, request.topic]);

            return response.status(200).json({
                success: new Date(),
                message: res
            });
        } catch (err) {
            return response.status(500).json({
                error: new Date(),
                message: err.stack
            });
        }
    }

    return response.status(401).json({
        error: new Date(),
        message: 'Unauthorized'
    });
}

export async function getMyDevices(pool, userId, response) {
    if (!pool) {
        throw new TypeError('PostgreSQL Pool must be set!');
    }
    
    if (!response) {
        throw new TypeError('Express response must be set!');
    }

    if (userId) {
        try {
            const res = await pool.query('SELECT id, user_id, name, topic FROM zigbee_devices WHERE user_id = $1', [userId]);

            return response.status(200).json({
                success: new Date(),
                devices: res.rows
            });
        } catch (err) {
            return response.status(500).json({
                error: new Date(),
                message: err.stack
            });
        }
    }

    return response.status(401).json({
        error: new Date(),
        message: 'Unauthorized'
    });
}
