import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { app } from "./app.js";
import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";

Deno.test("POST request to / containing JSON document echos the same document", async () => {
    const testClient = await superoak(app);
    await testClient.post("/").send({"name": "test", content: "Hello"}).expect({"name": "test", content: "Hello"});
});

Deno.test("POST request to /name containing JSON document echos the document's name", async () => {
    const testClient = await superoak(app);
    await testClient.post("/name").send({"name": "test", content: "Hello"}).expect({"name": "test"});
});

Deno.test("POST request to /name containing JSON document without 'name', status code isn't 200", async () => {
    const testClient = await superoak(app);
    let response = await testClient.get("/").set('Cookie', 'name=Jane').send();
    assertEquals(response.statusCode, 404);
});
