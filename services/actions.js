import { getDeviceCriteriaLastMessage } from './logs';

var rules = [];

function isLogic(logic) {
    return (
        typeof logic === "object" &&    // An object
        logic !== null &&               // but not null
        !Array.isArray(logic) &&        // and not an array
        Object.keys(logic).length === 1 // with exactly one key
    );
}

export async function addRule(pool, rule) {
    try {
        const res = await pool.query('INSERT INTO zigbee_rules (user_id, name, rules) VALUES($1, $2, $3::jsonb)', [rule.user_id, rule.name, rule.rules]);
        console.log(res.rows[0]);
    } catch (err) {
        console.log(err.stack);
    }
}

function getRulesByUserId(userId) {
    return rules.filter(rule => rule.user_id === userId);
}

export function checkMessageByRules(userId) {
    var myRules = getRulesByUserId(userId);

    myRules.filter(rule => {
        if (!isLogic(rule.rules)) {
            return checkRules(userId, rule.rules);
        } else {
            return checkRule(userId, rule.rules);
        }
    });
}

function checkRules(userId, rules) {
    switch (Object.keys(rules)[0]) {
        case 'and':
            return rules[Object.keys(rules)[0]].every(rule => checkRule(userId, rule));
        case 'or':
            return rules[Object.keys(rules)[0]].some(rule => checkRule(userId, rule));
        default:
            return false;
    }
}

function checkRule(userId, rule) {
    const deviceLastMessage = getDeviceLastMessage(userId, rule);

    if (deviceLastMessage) {
        return checkCondition(rule, deviceLastMessage);
    }

    return false;
}

function checkCondition(rule, lastMesssage) {
    switch (rule.condition) {
        case '==':
            return (rule.value == lastMesssage[rule.criteria]);
        default:
            return false;
    }
}

function getDeviceLastMessage(userId, rule) {
    return getDeviceCriteriaLastMessage(userId, rule.topic, rule.criteria);
}
