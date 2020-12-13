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

const handleGetSongs = async(request) => {
    const result = await executeQuery("SELECT * FROM songs");

    request.respond({
        body: JSON.stringify(result.rowsOfObjects()),
        headers: new Headers({
            "Content-Type": "application/json"
        })
    });
}


const handleGetSong = async(request) => {
    const parts = request.url.split("/");
    const id = parts[2];

    const result = await executeQuery("SELECT * FROM songs WHERE id = $1;", id);

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

const handlePostSong = async(request) => {
    const body = decode(await Deno.readAll(request.body));
    let name;
    let rating;

    try {
        const obj = JSON.parse(body);
        name = obj.name;
        rating = obj.rating;
    } catch (e) {
        console.log(e);
    }

    if (name) {
        executeQuery("INSERT INTO songs (name, rating) VALUES ($1, $2);", name, rating);
    }

    request.respond({
        status: 200
    });
}

const handleDeleteSong = async(request) => {
    const parts = request.url.split("/");
    const id = parts[2];

    executeQuery("DELETE FROM songs WHERE id = $1;", id);

    request.respond({
        status: 200
    });
}

const process = async(request) => {
    console.log(`${request.method} to ${request.url}`);
    if (request.method === 'GET' && request.url === '/songs') {
        handleGetSongs(request);
    } else if (request.method === 'POST' && request.url === '/songs') {
        handlePostSong(request);
    } else if (request.method === 'GET' && request.url.includes('/songs/')) {
        handleGetSong(request);
    } else if (request.method === 'DELETE' && request.url.includes('/songs/')) {
        handleDeleteSong(request);
    } else {
        request.respond({
            status: 404
        });
    }
}

for await (const request of server) {
    process(request);
}
