import express from 'express';
import mqtt from 'mqtt';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

import { logInfo } from './services/common';
import * as logService from './services/logs';
import * as deviceService from './services/devices';
import * as actionService from './services/actions';

const LISTEN_PORT = process.env.LISTEN_PORT || 5051;
const MQTT_SERVER = process.env.MQTT_SERVER || 'wss://test.mosquitto.org:8081';

const PGHOST = process.env.PGHOST || 'db'
const PGUSER = process.env.PGUSER || 'postgres';
const PGDATABASE = process.env.PGDATABASE || 'smarthome';
const PGPASSWORD = process.env.PGPASSWORD || '';

const postgresPool = new Pool({
    host: PGHOST,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    port: 5432,
});

postgresPool.on('connect', () => {
    logInfo(`Connected to Postgre SQL`);
});

const app = express();
var client = mqtt.connect(MQTT_SERVER);

client.on('connect', () => {
    logInfo(`Connected to MQTT Broker (${MQTT_SERVER})`);
});

client.on('message', (topic, message) => {
    console.log(JSON.parse(message.toString()));

    logService.putMessage(postgresPool, topic, JSON.parse(message.toString()));
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/api/devices/add', (request, response) => {
    deviceService.addDevice(postgresPool, client, request.query.userId, request.body);

    response.status(200).json({
        success: new Date()
    });
});

app.get('/api/devices', (request, response) => {
    deviceService.getMyDevices(postgresPool, request.query.userId, response);
});

app.get('/api/logs', (request, response) => {
    response.status(200).json({
        success: new Date(),
        messages: logService.getMessagesByUserId(request.query.userId)
    });
});

app.listen(LISTEN_PORT, () => {
    logInfo(`Server listening on port ${LISTEN_PORT}`);
});

actionService.addRule(postgresPool, {
    name: 'Test Angle X and Y',
    user_id: '271986833',
    rules: {
        'and': [{
            topic: '0x00158d0002b22a6d',
            criteria: 'angle_x',
            condition: '==',
            value: '10'
        },{
            topic: '0x00158d0002b22a6d',
            criteria: 'angle_y',
            condition: '==',
            value: '0'
        }]
    }
});

actionService.checkMessageByRules('271986833');
