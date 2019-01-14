const { Reply } = require('yandex-dialogs-sdk');

const makeResponse = (request, body) => ({
    response: body,
    session: request.session,
    version: request.version,
});

const makeTextResponse = request => text => {
    return makeResponse(request)(Reply.text(text));
};

module.exports = {
    makeResponse,
    makeTextResponse,
};
