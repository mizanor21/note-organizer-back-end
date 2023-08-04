const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://notesAdmin:6YjAX14mmtlWN4K6@cluster0.disah5t.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    const noteCollection = client.db("KeepNotesDB").collection("notes");

    app.get("/", (req, res) => {
      res.send("Node Server is running!");
    });

    app.get("/notes", async (req, res) => {
      const query = {};
      const notes = await noteCollection.find(query).toArray();
      res.send(notes);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
