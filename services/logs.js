import { getUserIdByTopic } from './common';

var logMessages = [];

export function putMessage(topic, message) {
    logMessages.push({
        user_id: getUserIdByTopic(topic),
        topic: topic,
        payload: message
    });
}

export function getMessagesByUserId(userId) {
    return logMessages.filter(item => item.user_id === Number(userId));
}

export function getDeviceCriteriaLastMessage(userId, topic, criteria) {
    var myMessages = getMessagesByUserId(userId).filter(item => item.topic === topic && item[criteria]);

    return (myMessages.length > 0 ? myMessages[myMessages.length - 1] : null);
}
