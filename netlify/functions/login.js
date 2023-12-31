
"use strict"

const headers = require('./headersCORS');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");

exports.handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const data = JSON.parse(event.body);

    if (!(data.email && data.password)) {
      return { statusCode: 400, headers, body: "Both email and password are required" };
    }

    const uri = "mongodb+srv://admin:admin@cluster0.6l3gxpe.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const userCollection = client.db("tarea").collection("usuarios");
      const user = await userCollection.findOne({ email: data.email });

      let passwd = await bcrypt.hash(user.password, 10);
      
      if (user && (await bcrypt.compare(data.password, passwd))) {
        const token = jwt.sign(
          { user_id: user._id, email: data.email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        // return { statusCode: 200, headers, body: JSON.stringify({ token }) };
        return { statusCode: 200, headers, body: JSON.stringify({ user }) };
      } else {
        return { statusCode: 401, headers, body: "Invalid email or password" };
      }
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error(error);
    return { statusCode: 500, headers, body: "Internal server error" };
  }
};
