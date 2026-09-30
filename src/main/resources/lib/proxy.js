const mustache = require('/lib/mustache');
const http = require('/lib/http-client');
const portal = require('/lib/xp/portal');
const webSocketLib = require('/lib/xp/websocket');
const util = require('/lib/util');

const stat_endpoint = 'http://localhost:2609'

function stat_req(endpoint) {
    try {
        return JSON.parse(http.request({
            url: stat_endpoint + endpoint,
            connectionTimeout: 2000,
            readTimeout: 2000,
        }).body);
    } catch (e) {
        return undefined;
    }
}

function get_es_member(id, members) {
    for (let i = 0; i < members.length; i++) {
        if (members[i].id === id) {
            return members[i];
        }
    }
    return undefined;
}

function handle200(req) {
    let server = stat_req('/server');
    let xp = {};
    if (server) {
        xp = {
            version: server.version,
            hash: server.build.hash,
        };
    }

    let es = stat_req('/cluster.elasticsearch');
    let node = {};

    if (es) {
        let member = get_es_member(es.localNode.id, es.members);

        node = {
            clusterName: es.name,
            nodeId: es.localNode.id,
            nodeName: member.name,
            nodeIsMaster: member.isMaster,
            nodeIsDataNode: member.isDataNode,
            nodeIsClientNode: member.isClientNode,
        };
    }

    if (req.params['stall']) {
        try {
            require('/lib/xp/task').sleep(Number(req.params['stall']));
        } catch (e) {
            // Ignore
        }
    }

    if (util.returnHtml(req)) {
        const view = resolve('../assets/200.html');
        return {
            contentType: 'text/html',
            body: mustache.render(view, {
                request: JSON.stringify(req, undefined, 2),
                node: JSON.stringify(node, undefined, 2),
                xp: JSON.stringify(xp, undefined, 2),
                wsApiPath: portal.apiUrl({api: app.name + ':websocket'}),
            }),
        }
    }

    return {
        contentType: 'text/json',
        body: {
            request: req,
            node: node,
            xp: xp,
        },
    };
}

function handle403(req) {
    if (util.returnHtml(req)) {
        const view = resolve('../assets/403.html');
        return {
            status: 403,
            contentType: 'text/html',
            body: mustache.render(view, {}),
        }
    }

    return {
        status: 403,
        contentType: 'text/json',
        body: {
            message: 'unauthorized'
        },
    };
}

exports.handle = function (req) {
    if (!util.isMember("role:system.admin")) {
        return handle403(req);
    }
    return handle200(req);
}

exports.handleWebSocket = function (req) {
    if (!util.isMember("role:system.admin")) {
        return handle403(req);
    }
    if (!req.webSocket) {
        return {
            status: 426,
            headers: {
                'Upgrade': 'websocket',
            },
        };
    }

    const webSocket = {
        subProtocols: ['text'],
        data: {
            request: JSON.stringify(req, undefined, 2),
        },
    };

    if (req.params['allowAnyOrigin'] === 'true') {
        webSocket.checkOrigin = function () {
            return true;
        };
    }

    if (req.params['disableSessionBinding'] === 'true') {
        webSocket.terminateOnSessionExit = false;
    }

    return {
        webSocket: webSocket,
    };
}

exports.webSocketEvent = function (event) {
    if (event.type === 'open') {
        webSocketLib.send(event.session.id, event.data.request);
    } else if (event.type === 'message') {
        webSocketLib.send(event.session.id, event.message);
    }
}