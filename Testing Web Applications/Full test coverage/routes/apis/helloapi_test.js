import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { app } from "../../app.js";

Deno.test("GET '/api/hello'", async () => {
    const testClient = await superoak(app);
    await testClient.get("/api/hello");
});

Deno.test("POST '/api/hello'", async () => {
    const testClient = await superoak(app);
    await testClient.post("/api/hello").send({"message":"test"});
});
