const { MongoClient } = require('mongodb');

const client = MongoClient
    .connect(process.env.DB_CONNECTION_STRING)
    .then(client => client.db('1_1__serveless_now'));

function createContext(userId) {
    return {
        userId,
    };
}

async function getContext(userId) {
    const db = await client;
    const result = await db.collection('sessions').findOneAndUpdate(
        { userId },
        { $setOnInsert: createContext(userId) },
        { returnOriginal: false, upsert: true }
    );

    return result.value;
}

async function setContext(userId, context) {
    const db = await client;

    await db.collection('sessions').updateOne(
        { userId },
        { $set: context }
    );
}

module.exports = {
    getContext,
    setContext,
};
