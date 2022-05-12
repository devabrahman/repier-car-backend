//db user : dbUser
//db password: yRv0A62wZmms3Wgv

const express = require("express");
var cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;

//use middle ware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running....");
});
app.listen(port, () => {
  console.log(port + "is running........");
});

const uri =
  "mongodb+srv://dbUser:yRv0A62wZmms3Wgv@cluster0.vgqhp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const usersCollection = client.db("foodExpress").collection("users");
    // post
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log("add new user", newUser);
      res.send(newUser);
      const result = await usersCollection.insertOne(newUser);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
    });
    //get
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = usersCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });
    //delete a user
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      console.log("success fully delete");
      res.send(result);
    });
    //update user
    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
            const updateDoc = {
        $set: {
          name: updateUser.name,
          email: updateUser.email,
        },
      };
      const result= await usersCollection.updateOne(query,updateDoc,options)
      res.send(result)
      console.log('updated', result)
    });
  } finally {
    // await client.close();
    
  }
}
run().catch(console.dir);
