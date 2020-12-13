import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { echo } from "./app.js";

Deno.test("Function echo returns 'echoechoecho!'", () => {
    assertEquals(echo(), 'echoechoecho!');
});

Deno.test("Random message returned from echo", () => {
    const msg = `${Math.floor(Math.random() * 1000000)}`;
    assertEquals(echo(msg), msg);
});
