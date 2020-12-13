import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.4.5/mod.ts";

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


const handleGetName = async(request) => {
    const parts = request.url.split("/");
    const id = parts[2];

    const result = await executeQuery("SELECT * FROM names WHERE id = $1;", id);

    if (result && result.rowCount > 0) {
        const resultList = result.rowsOfObjects();

        request.respond({
            body: JSON.stringify(resultList[0]),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        });

    } else {
        request.respond({
            status: 404
        });
    }
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

const handleDeleteName = async(request) => {
    const parts = request.url.split("/");
    const id = parts[2];

    executeQuery("DELETE FROM names WHERE id = $1;", id);

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
    } else if (request.method === 'GET' && request.url.includes('/names/')) {
        handleGetName(request);
    } else if (request.method === 'DELETE' && request.url.includes('/names/')) {
        handleDeleteName(request);
    } else {
        request.respond({
            status: 404
        });
    }
}

for await (const request of server) {
    process(request);
}
