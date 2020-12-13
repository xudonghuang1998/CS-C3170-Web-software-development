import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { app } from "../app.js";

Deno.test("GET '/'", async () => {
    const testClient = await superoak(app);
    await testClient.get("/");
});

Deno.test("GET '/static'", async () => {
    const testClient = await superoak(app);
    await testClient.get("/static");
});
