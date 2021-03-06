const { MongoClient } = require('mongodb');

const client = MongoClient
    .connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true })
    .then(client => client.db('1_1__serveless_now'));

function createContext(userId) {
    return {
        userId,
    };
}

async function getContext(request) {
    const userId = request.session.user_id;
    const db = await client;
    const result = await db.collection('sessions').findOneAndUpdate(
        { userId },
        { $setOnInsert: createContext(userId) },
        { returnOriginal: false, upsert: true }
    );

    return result.value;
}

async function setContext(request, context) {
    const userId = request.session.user_id;
    const db = await client;

    const fields = JSON.parse(JSON.stringify(context));
    delete fields._id;

    await db.collection('sessions').updateOne(
        { userId },
        { $set: fields }
    );
}

module.exports = {
    getContext,
    setContext,
};
