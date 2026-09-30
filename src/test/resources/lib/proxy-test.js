var assert = require('/lib/xp/testing');

var sleptFor = null;

assert.mock('/lib/util', {
    isMember: function () {
        return true;
    },
    returnHtml: function () {
        return false;
    }
});
assert.mock('/lib/http-client', {
    request: function () {
        return { body: 'null' };
    }
});
assert.mock('/lib/mustache', {
    render: function () {
        return '';
    }
});
assert.mock('/lib/xp/task', {
    sleep: function (ms) {
        sleptFor = ms;
    }
});

var sent = [];

assert.mock('/lib/xp/websocket', {
    send: function (id, message) {
        sent.push({ id: id, message: message });
    }
});

var proxy = require('/lib/proxy');

exports.stallSleepsForParsedMillis = function () {
    sleptFor = null;
    proxy.handle({ params: { stall: '250' }, headers: {} });
    assert.assertTrue(sleptFor === 250, 'expected sleep(250), got ' + sleptFor);
};

exports.noStallDoesNotSleep = function () {
    sleptFor = null;
    proxy.handle({ params: {}, headers: {} });
    assert.assertTrue(sleptFor === null, 'expected no sleep, got ' + sleptFor);
};

function messageEvent(message, data) {
    return { type: 'message', session: { id: 's1' }, message: message, data: data };
}

exports.ackHeartbeatFlagFromParam = function () {
    var on = proxy.handleWebSocket({ params: { ackHeartbeat: 'true' }, headers: {}, webSocket: true });
    var off = proxy.handleWebSocket({ params: {}, headers: {}, webSocket: true });
    assert.assertTrue(on.webSocket.data.ackHeartbeat === 'true', 'expected ackHeartbeat \'true\'');
    assert.assertTrue(off.webSocket.data.ackHeartbeat === 'false', 'expected ackHeartbeat \'false\'');
};

exports.echoesRegularMessage = function () {
    sent = [];
    proxy.webSocketEvent(messageEvent('debug-1', { ackHeartbeat: 'false' }));
    assert.assertTrue(sent.length === 1 && sent[0].message === 'debug-1', 'expected echo, got ' + JSON.stringify(sent));
};

exports.acksHeartbeatWhenEnabled = function () {
    sent = [];
    proxy.webSocketEvent(messageEvent('heartbeat-1', { ackHeartbeat: 'true' }));
    assert.assertTrue(sent.length === 1 && sent[0].message === 'ack-heartbeat-1', 'expected ack, got ' + JSON.stringify(sent));
};

exports.ignoresHeartbeatWhenAckDisabled = function () {
    sent = [];
    proxy.webSocketEvent(messageEvent('heartbeat-1', { ackHeartbeat: 'false' }));
    assert.assertTrue(sent.length === 0, 'expected no reply, got ' + JSON.stringify(sent));
};
