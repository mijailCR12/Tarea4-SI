"use strict"

const clientPromise = require('./mongoDB');
const headers = require('./headersCORS');

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const client = await clientPromise;
    const id = parseInt(event.path.split("/").reverse()[0]);
    const data = JSON.parse(event.body);
	console.log(event.body)

  const result = await client.db("tarea").collection("productos").updateOne(
    { _id: id },
    { $set: data } // Usamos los datos recibidos para actualizar el libro
  );  
  return { statusCode: 200, headers, body: 'OK'};
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify(error) };
  }
};