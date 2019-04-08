import { logInfo } from './common';

export function addDevice(mqttClient, request) {
    if (request.topic) {
        mqttClient.subscribe(request.topic, () => logInfo(`Subscribed to topic ${request.topic}`));

        try {
            const res = await pool.query('INSERT INTO zigbee_devices (user_id, name, topic) VALUES($1, $2, $3)', 
                [getUserIdByTopic(request.topic), request.name, request.topic]);
            console.log(res.rows[0]);
        } catch (err) {
            console.log(err.stack);
        }
    }
}
