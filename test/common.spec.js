import assert from 'assert';
import chai from 'chai';
import sinon from 'sinon';

import { logInfo } from '../services/common';

chai.should();

describe('logInfo', () => {
    it('If message is null - return undefined', () => {
        chai.expect(logInfo(null)).to.be.undefined;
    });
});