import { getUserIdByTopic } from './common';

var logMessages = [];

export async function putMessage(pool, topic, message) {
    try {
        const res = await pool.query('INSERT INTO zigbee_log (user_id, topic, payload) VALUES($1, $2, $3::jsonb)', [getUserIdByTopic(topic), topic, message]);
        console.log(res.rows[0]);
    } catch (err) {
        console.log(err.stack);
    }
}

export function getMessagesByUserId(userId) {
    return logMessages.filter(item => item.user_id === userId);
}

export function getDeviceCriteriaLastMessage(userId, topic, criteria) {
    var myMessages = logMessages.filter(item => item.topic === topic && item[criteria]);

    return (myMessages.length > 0 ? myMessages[myMessages.length - 1] : null);
}
