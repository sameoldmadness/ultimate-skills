const { jsonBody, onError, sendJson } = require('./lib/io');
const { getContext, setContext } = require('./lib/db');
const { getResponse } = require('./lib/dialog');

module.exports = (req, res) => {
    (async () => {
        const request = await jsonBody(req, res);
        const { user_id: userId } = request.session;
        const context = await getContext(userId);
        const response = getResponse(request);

        await setContext(userId, context);
        await sendJson(req, res, response);
    })().catch(onError(req, res));
};


