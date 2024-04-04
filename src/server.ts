import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { checkIn } from "./routes/check-in";
import { createEvent } from "./routes/create-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { getEvent } from "./routes/get-event";
import { getEventAttendees } from "./routes/get-event-attendees";
import { registerForEvent } from "./routes/register-for-event";

const port = parseInt(process.env.PORT);

if (isNaN(port)) {
  console.error("Invalid or missing PORT in environment variables");
  process.exit(1);
}

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);

app.listen({ port }).then(() => {
  console.log("HTTP server running on port", port);
});
