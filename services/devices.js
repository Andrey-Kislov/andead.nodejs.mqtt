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
