import assert from 'assert';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import * as deviceService from '../services/devices';

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

describe('getMyDevices', () => {
    it('If PostgreSQL pool is null - throw TypeError', async () => {
        await deviceService.getMyDevices(null, 12345, mockResponse()).should.be.rejectedWith(TypeError);
    });

    it('If Express response is null - throw TypeError', async () => {
        await deviceService.getMyDevices(mockPool(), 12345, null).should.be.rejectedWith(TypeError);
    });

    it('If userId is null - response status = 401', async () => {
        const response = await deviceService.getMyDevices(mockPool(), null, mockResponse());
        sinon.assert.calledWith(response.status, 401);
    });

    it('If can not connect to PostreSQL - status 500', async () => {
        const response = await deviceService.getMyDevices({}, 12345, mockResponse());
        sinon.assert.calledWith(response.status, 500);
    });

    it('If all correct - status 200', async () => {
        const response = await deviceService.getMyDevices(mockPool(), 12345, mockResponse());
        sinon.assert.calledWith(response.status, 200);
    });
});