const { jsonBody, onError, sendJson } = require('./lib/io');
const { getContext, setContext } = require('./lib/db');
const { getIntent, getNextContext, getResponse } = require('./lib/dialog');

module.exports = (req, res) => {
    (async () => {
        const request = await jsonBody(req, res);
        const context = await getContext(request);
        const intent = getIntent(request, context);
        const nextContext = getNextContext(intent, request, context);
        const response = getResponse(intent, request, nextContext);

        await setContext(request, nextContext);
        await sendJson(req, res, response);
    })().catch(onError(req, res));
};


