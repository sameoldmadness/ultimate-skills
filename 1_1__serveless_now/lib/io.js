const jsonBody_ = require('body/json');
const sendJson_ = require('send-data/json');
const sendError_ = require('send-data/error');
const { promisify } = require('util');

const jsonBody = promisify(jsonBody_);
const sendJson = promisify(sendJson_);
const sendError = promisify(sendError_);

const onError = (req, res) => async (err) => {
    console.error(err);
    await sendError(req, res, { body: err });
};

module.exports = {
    jsonBody,
    sendJson,
    onError,
};
