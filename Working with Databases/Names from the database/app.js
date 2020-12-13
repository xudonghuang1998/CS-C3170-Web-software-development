import { Client } from "https://deno.land/x/postgres@v0.4.5/mod.ts";

const client = new Client({});

const getNames = async() => {
    await client.connect();
    const result = await client.query("SELECT * FROM names;");
    await client.end();

    return result.rowsOfObjects();

};

export default getNames;
