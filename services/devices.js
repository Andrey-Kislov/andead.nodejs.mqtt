import { logInfo } from './common';

export function addDevice(mqttClient, request) {
    if (request.topic) {
        mqttClient.subscribe(request.topic, () => logInfo(`Subscribed to topic ${request.topic}`));

        // console.log(mqttClient);
    }
}
