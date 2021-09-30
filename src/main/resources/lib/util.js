const authLib = require('/lib/xp/auth');

exports.isMember = function (key) {
    const user = authLib.getUser();
    if (!user) {
        return false;
    }

    const memberships = authLib.getMemberships(user.key, true);
    if (!memberships) {
        return false;
    }

    for (var i = 0; i < memberships.length; i++) {
        if (memberships[i].key === key) {
            return true;
        }
    }

    return false;
}

exports.returnHtml = function (req) {
    return req.headers['Accept'] && req.headers['Accept'].contains('text/html');
}