const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
// mongoDb
const { MongoClient, ServerApiVersion } = require("mongodb");

// bcrypt
const bcrypt = require("bcryptjs");

// middleware
const corsOptions = {
  origin: ["http://localhost:5173"],

  optionSuccessStatus: 200,
};
app.use(express.json());
app.use(cors(corsOptions));

// mongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ixszr3u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const usersCollection = client.db("swift-cash").collection("all-user");
    // post user data
    app.post("/users", async (req, res) => {
      const user_info = req.body;
      const { name, phone_number, email, password, status, role } = user_info;

      //unique user
      const query = { phone_number: phone_number };
      const existing_user = usersCollection.findOne(query);
      if (existing_user) {
        res.send({ message: "Already existed" });
        return;
      }

      //   has password
      const saltRound = 8;
      const hash_pass = await bcrypt.hash(password, saltRound);
      console.log(hash_pass);
      const new_user = {
        name,
        email,
        phone_number,
        password: hash_pass,
        status,
        role,
      };
      const result = await usersCollection.insertOne(new_user);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// test
app.get("/", (req, res) => {
  res.send("successfully working");
});
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
