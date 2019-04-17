import assert from 'assert';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import DeviceService from '../services/devices';

chai.use(chaiAsPromised);
chai.should();

const mockPool = () => {
    const pool = {};
    pool.query = sinon.stub().returns(pool);
    return pool;
}

const mockResponse = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
};

const mockMqttClient = () => {
    const mqttClient = {};
    mqttClient.subscribe = sinon.stub().returns(mqttClient);
    return mqttClient;
};

const mockRequest = {
    name: 'Aqara Wall Wireless Switch',
    topic: 'TestTopic',
    image: '/images/devices/WXKG03LM.jpg',
    description: 'This is test description'
};

const deviceService = new DeviceService(mockPool(), mockMqttClient());

describe('DeviceService', async () => {
    describe('getMyDevices', () => {
        it('If Express response is null - throw TypeError', async () => {
            await deviceService.getMyDevices(12345, null).should.be.rejectedWith(TypeError);
        });

        it('If userId is null - response status = 401', async () => {
            const response = await deviceService.getMyDevices(null, mockResponse());
            sinon.assert.calledWith(response.status, 401);
        });

        it('If all correct - status 200', async () => {
            const response = await deviceService.getMyDevices(12345, mockResponse());
            sinon.assert.calledWith(response.status, 200);
        });
    });

    describe('addDevice', async () => {
        it('If userId is null - status 401', async () => {
            const response = await deviceService.addDevice(null, null, mockResponse());
            sinon.assert.calledWith(response.status, 401);
        });

        it('If request is null - status 500', async () => {
            const response = await deviceService.addDevice(12345, null, mockResponse());
            sinon.assert.calledWith(response.status, 500);
        });

        it('If request is empty - status 500', async () => {
            const response = await deviceService.addDevice(12345, {}, mockResponse());
            sinon.assert.calledWith(response.status, 500);
        });

        it('If request have only topic - status 500', async () => {
            const response = await deviceService.addDevice(12345, { topic: 'TestTopic' }, mockResponse());
            sinon.assert.calledWith(response.status, 500);
        });

        it('If response is null - throw TypeError', async () => {
            await deviceService.addDevice(12345, mockRequest, null).should.be.rejectedWith(TypeError);
        });

        it('If all correct - status 200', async () => {
            const response = await deviceService.addDevice(12345, mockRequest, mockResponse());
            sinon.assert.calledWith(response.status, 200);
        });
    });
});
