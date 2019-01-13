const { Reply } = require('yandex-dialogs-sdk');

const makeResponse = (request, body) => ({
    response: body,
    session: request.session,
    version: request.version,
});

module.exports = {
    makeResponse,
};
