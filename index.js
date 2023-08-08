const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
      // const search = req.query.search;
      const email = req.query.email;
      const query = {
        email: email,
        // $text: {
        //   $search: search,
        // },
      };
      const notes = await noteCollection.find(query).toArray();
      res.send(notes);
    });

    app.post("/notes", async (req, res) => {
      const note = req.body;
      const result = await noteCollection.insertOne(note);
      res.send(result);
    });

    app.patch("/notes/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedNote = req.body;
        const options = { upsert: true };

        const result = await noteCollection.updateOne(
          filter,
          { $set: updatedNote },
          options
        );

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while updating the note.");
      }
    });

    app.delete("/note/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await noteCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
