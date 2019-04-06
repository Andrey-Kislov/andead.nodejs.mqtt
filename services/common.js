
export function logInfo(message) {
    console.log({
        date_time: new Date(),
        info: message
    });
}

export function getUserIdByTopic(topic) {
    return Number(topic.replace(/\/([^/]+)$/, '').replace(/^(.+)\//, ''));
}
