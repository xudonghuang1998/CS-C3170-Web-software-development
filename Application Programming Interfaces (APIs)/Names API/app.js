import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.4.5/mod.ts";
import { decode } from "https://deno.land/std@0.65.0/encoding/utf8.ts";

const server = serve({ port: 7777 });

const client = new Client({});

const executeQuery = async(query, ...args) => {
    try {
        await client.connect();
        return await client.query(query, ...args);
    } catch (e) {
        console.log(e);
    } finally {
        await client.end();
    }
}

const handleGetNames = async(request) => {
    const result = await executeQuery("SELECT * FROM names");

    request.respond({
        body: JSON.stringify(result.rowsOfObjects()),
        headers: new Headers({
            "Content-Type": "application/json"
        })
    });
}

const handlePostName = async(request) => {
    const body = decode(await Deno.readAll(request.body));
    let name;

    try {
        const obj = JSON.parse(body);
        name = obj.name;
    } catch (e) {
        console.log(e);
    }

    if (name) {
        executeQuery("INSERT INTO names (name) VALUES ($1);", name);
    }

    request.respond({
        status: 200
    });
}

const process = async(request) => {
    console.log(`${request.method} to ${request.url}`);
    if (request.method === 'GET' && request.url === '/names') {
        handleGetNames(request);
    } else if (request.method === 'POST' && request.url === '/names') {
        handlePostName(request);
    }
}

for await (const request of server) {
    process(request);
}
