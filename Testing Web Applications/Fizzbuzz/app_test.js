import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { fizzbuzz } from "./app.js";

Deno.test("from 1 to 10", () => {
    assertEquals(fizzbuzz(1), 1);
    assertEquals(fizzbuzz(2), 'Fizz');
    assertEquals(fizzbuzz(3), 'Buzz');
    assertEquals(fizzbuzz(4), 'Fizz');
    assertEquals(fizzbuzz(5), 5);
    assertEquals(fizzbuzz(6), 'FizzBuzz');
    assertEquals(fizzbuzz(7), 7);
    assertEquals(fizzbuzz(8), 'Fizz');
    assertEquals(fizzbuzz(9), 'Buzz');
    assertEquals(fizzbuzz(10), 'Fizz');
});
