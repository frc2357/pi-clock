import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { recordTimeclockEvent } from "./recordTimeclockEvent";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
    path: "/record-event",
    method: "POST",
    handler: recordTimeclockEvent,
})

export default http;