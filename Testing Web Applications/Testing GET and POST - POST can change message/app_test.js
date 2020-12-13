import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { app } from "./app.js";

Deno.test("GET request to / should return 'Hello'", async () => {
    const testClient = await superoak(app);
    await testClient.get("/").expect('Hello');
});


Deno.test("POST request to / without parameter 'message' should set 'We are not sure what you planned!'", async () => {
    const testClient = await superoak(app);
    await testClient.post("/").send('a=test').expect('We are not sure what you planned!');
});

Deno.test("POST request to / sets the message", async () => {
    const testClient = await superoak(app);
    await testClient.post("/").send('message=test').expect('Done!');
});

Deno.test("GET request to / should return 'test'", async () => {
    const testClient = await superoak(app);
    await testClient.get("/").expect('test');
});
