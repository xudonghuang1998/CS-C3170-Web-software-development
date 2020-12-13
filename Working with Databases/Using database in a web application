import { Client } from "https://deno.land/x/postgres@v0.4.5/mod.ts";

const client = new Client({});

const addName = async(name) => {
    await client.connect();
    await client.query("INSERT INTO names (name) VALUES ($1);", name);
    await client.end();
};

export default addName;
