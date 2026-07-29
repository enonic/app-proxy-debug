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
