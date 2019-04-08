import { logInfo } from './common';

export async function addDevice(pool, mqttClient, userId, request) {
    if (userId && request.topic) {
        mqttClient.subscribe(request.topic, () => logInfo(`Subscribed to topic ${request.topic}`));

        try {
            const res = await pool.query('INSERT INTO zigbee_devices (user_id, name, topic) VALUES($1, $2, $3)', 
                [userId, request.name, request.topic]);
            console.log(res.rows[0]);
        } catch (err) {
            console.log(err.stack);
        }
    }
}

export async function getMyDevices(pool, userId, response) {
    if (userId) {
        try {
            const res = await pool.query('SELECT id, user_id, name, topic FROM zigbee_devices WHERE user_id = $1', [userId]);
            console.log(res.rows);

            response.status(200).json({
                success: new Date(),
                message: res.rows
            });
        } catch (err) {
            response.status(500).json({
                error: new Date(),
                message: err.stack
            });
        }
    }

    response.status(401);
}
