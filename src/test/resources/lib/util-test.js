var assert = require('/lib/xp/testing');

assert.mock('/lib/xp/auth', {
    getUser: function () {
        return null;
    },
    getMemberships: function () {
        return [];
    }
});

var util = require('/lib/util');

exports.returnHtmlTrueWhenAcceptHasTextHtml = function () {
    assert.assertTrue(util.returnHtml({ headers: { Accept: 'text/html,application/xhtml+xml' } }));
};

exports.returnHtmlFalseWhenAcceptLacksTextHtml = function () {
    assert.assertFalse(util.returnHtml({ headers: { Accept: 'application/json' } }));
};
