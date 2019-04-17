import { logInfo } from './common';
import { schemaValidator } from '../models';

export default class DeviceService {
    constructor(postgresSqlPool, mqttClient) {
        if (!postgresSqlPool) {
            throw new TypeError('PostgreSQL Pool must be set!');
        }
    
        if (!mqttClient) {
            throw new TypeError('MQTT client must be set!');
        }

        this.pool = postgresSqlPool;
        this.mqttClient = mqttClient;
    }

    async getMyDevices(userId, response) {
        if (!response) {
            throw new TypeError('Express response must be set!');
        }
    
        if (userId) {
            try {
                const res = await this.pool.query(
                    'SELECT id, user_id, name, topic, image, description FROM zigbee_devices WHERE user_id = $1',
                    [userId]
                );
    
                return response.status(200).json({
                    status: 'success',
                    devices: res.rows
                });
            } catch (err) {
                return response.status(500).json({
                    status: 'error',
                    message: err.stack
                });
            }
        }
    
        return response.status(401).json({
            status: 'error',
            message: 'Unauthorized'
        });
    }

    async addDevice(userId, request, response) {
        if (!response) {
            throw new TypeError('Express response must be set!');
        }

        if (userId) {
            try {
                await schemaValidator(request, 'deviceRequestSchema');
                this.mqttClient.subscribe(request.topic, () => logInfo(`Subscribed to topic ${request.topic}`));
    
                const res = await this.pool.query(
                    'INSERT INTO zigbee_devices (user_id, name, topic, image, description) VALUES($1, $2, $3, $4, $5)', 
                    [userId, request.name, request.topic, request.image, request.description]
                );
    
                return response.status(200).json({
                    status: 'success',
                    message: res
                });
            } catch (err) {
                return response.status(500).json({
                    status: 'error',
                    message: err.stack
                });
            }
        }
    
        return response.status(401).json({
            status: 'error',
            message: 'Unauthorized'
        });
    }
}
