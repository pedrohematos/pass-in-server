import fastify from "fastify";

const port = parseInt(process.env.PORT);

if (isNaN(port)) {
  console.error("Invalid or missing PORT in environment variables");
  process.exit(1);
}

const app = fastify();

app.get("/", () => {
  return "Hello world!";
});

app.listen({ port }).then(() => {
  console.log("HTTP server running on port", port);
});
