const { DateTime } = require('luxon');
const { Reply } = require('yandex-dialogs-sdk');
const { makeResponse } = require('./alice');

function getResponse(request) {
    const time = DateTime.local().setLocale('ru').toLocaleString(DateTime.TIME_SIMPLE);

    return makeResponse(request, Reply.text(`Сейчас ${time}`));
}

module.exports = {
    getResponse,
};
