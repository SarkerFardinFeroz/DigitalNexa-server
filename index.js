require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("DigitalNexa server is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.frd0xwu.mongodb.net/?retryWrites=true&w=majority`;

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
    const brandCollection = client.db("brandDB").collection("brand");
    const productsCollection = client.db("brandDB").collection("products");
    const cartCollection = client.db("brandDB").collection("userCart");
    const userCollection = client.db("brandDB").collection("user");
    
    // brand related apis

    app.get("/brand", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // products related apis

    app.get("/products/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: brand };
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });
    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;
      const product = {
        $set: {
          name: updatedProduct.name,
          category: updatedProduct.category,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
          short_description: updatedProduct.short_description,
          image: updatedProduct.image,
          brand: updatedProduct.brand,
        },
      };
      const result = await productsCollection.updateOne(filter, product);
      res.send(result);
    });
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    // user related apis
    app.get("/user", async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    });
 
    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });




    
    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    });
 
    app.post("/cart", async (req, res) => {
      const cartProduct = req.body;
      const result = await cartCollection.insertOne(cartProduct);
      res.send(result);
    });
   
   
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })


 

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`DigitalNexa server is running on port : ${port}`);
});
