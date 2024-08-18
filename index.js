const { MongoClient } = require("mongodb");

const uri = process.env.MongoDB_URI;

const client = new MongoClient(uri);

async function run(phrase, response) {
  try {
    const database = client.db("voiceAI");

    const resultsCollection = database.collection("results");

    const result = {
      phrase: phrase,
      response: response,
    };
    await resultsCollection.insertOne(result);
  } finally {
    await client.close();
  }
}
run(process.argv[2], process.argv[3]).catch(console.dir);
