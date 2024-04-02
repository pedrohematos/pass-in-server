import fastify from "fastify";

const port = parseInt(process.env.PORT);

if (isNaN(port)) {
  console.error("Invalid or missing PORT in environment variables");
  process.exit(1);
}

const app = fastify();

app.post("/events", (request, reply) => {
  return console.log(request.body);
});

app.listen({ port }).then(() => {
  console.log("HTTP server running on port", port);
});
