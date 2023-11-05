"use strict";

const { MongoClient } = require("mongodb");
const headers = require("./headersCORS");

exports.handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    // Establece la conexión a MongoDB
    const client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const id = parseInt(event.path.split("/").reverse()[0]);

    // Intenta eliminar el editor con el ID proporcionado
    const result = await client.db("tarea").collection("publishers").findOneAndDelete({ _id:id});

    if (result.value) {
      console.log("Editor eliminado:", result.value);
      return { statusCode: 200, headers, body: JSON.stringify(result.value) };
    } else {
      console.log("Editor no encontrado");
      return { statusCode: 404, headers, body: "Editor no encontrado" };
    }
  } catch (error) {
    console.error("Error al eliminar el editor:", error);
    return { statusCode: 500, headers, body: JSON.stringify(error) };
  } finally {
    // Cierra la conexión a MongoDB después de realizar la operación
    if (client) {
      client.close();
    }
  }
};
