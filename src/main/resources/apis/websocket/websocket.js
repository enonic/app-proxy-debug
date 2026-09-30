const proxy = require('/lib/proxy');
exports.GET = proxy.handleWebSocket;
exports.webSocketEvent = proxy.webSocketEvent;