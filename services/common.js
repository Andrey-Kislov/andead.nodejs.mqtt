
export function logInfo(message) {
    if (message) {
        return console.log({
            date_time: new Date(),
            info: message
        });
    }
}

export function getUserIdByTopic(topic) {
    return topic.replace(/\/([^/]+)$/, '').replace(/^(.+)\//, '');
}
