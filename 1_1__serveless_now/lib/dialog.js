const { DateTime } = require('luxon');
const { makeTextResponse } = require('./alice');

const INTENT = {
    sayHello: Symbol(),
    askHelp: Symbol(),
    askTime: Symbol(),
    setCity: Symbol(),
};

function getIntent(request, context) {
    if (request.session.new) {
        return INTENT.sayHello;
    }

    if (request.request.command.match(/(помощь|что ты умеешь)/)) {
        return INTENT.askHelp;
    }

    if (context.cityRequested) {
        return INTENT.setCity;
    }

    return INTENT.askTime;
}

function getResponse(intent, request, context) {
    const textResponse = makeTextResponse(request);

    switch (intent) {
        case INTENT.sayHello:
            return textResponse(`
                Привет! Я могу указать точное время! Просто спроси меня, который час.

                Пока что я умею говорить только московское время, но скоро научусь узнавать время во всех городах.
            `);
        case INTENT.askHelp:
            return textResponse(`
                Просто спроси меня, который час.

                Пока что я умею говорить только московское время, но скоро научусь узнавать время во всех городах.
            `);
        case INTENT.setCity:
            if (context.city) {
                return textResponse(`Я это запомню.`);
            } else {
                return textResponse(`Это точно город?`);
            }
            break;
        case INTENT.askTime:
            if (context.city) {
                const time = DateTime
                    .local()
                    .setZone('Europe/Moscow')
                    .setLocale('ru')
                    .toLocaleString(DateTime.TIME_SIMPLE);

                return textResponse(`В Москве сейчас ${time}`);
            } else {
                return textResponse(`Назовите город`);
            }
            break;
    }


}

function extractCity(request) {
    for (const entity of request.request.nlu.entities) {
        if (entity.type === 'YANDEX.GEO' && 'city' in entity.value) {
            return entity.value.city;
        } 
    }

    return null;
}

function getNextContext(intent, request, context) {
    const nextContext = JSON.parse(JSON.stringify(context));

    switch (intent) {
        case INTENT.setCity: {
            const city = extractCity(request);

            if (city) {
                nextContext.city = city;
                nextContext.cityRequested = false;
            }
            break;
        }
        case INTENT.askTime: {
            const city = extractCity(request);

            if (city) {
                nextContext.city = city;
            }

            if (!nextContext.city) {
                nextContext.cityRequested = true;
            }
            break;
        }
    }

    return nextContext;
}

module.exports = {
    getIntent,
    getResponse,
    getNextContext,
};
