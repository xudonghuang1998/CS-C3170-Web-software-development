import { decode } from "https://deno.land/std@0.65.0/encoding/utf8.ts";
import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { renderFile } from 'https://raw.githubusercontent.com/syumai/dejs/master/mod.ts';
import { Client } from "https://deno.land/x/postgres@v0.4.5/mod.ts";

const client = new Client({});

const server = serve({ port: 7777 });

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

const getSongs = async() => {
    const result = await executeQuery("SELECT * FROM songs;");
    if (result) {
        return result.rowsOfObjects();
    }

    return [];
}

const addSong = async(request) => {
    const body = decode(await Deno.readAll(request.body));
    const params = new URLSearchParams(body);

    const name = params.get('name');
    const rating = params.get('rating');

    await executeQuery("INSERT INTO songs (name, rating) VALUES ($1, $2);", name, rating);
}

const deleteSong = async(request) => {
    console.log(`Delete name based on request url ${request.url}`);
    const parts = request.url.split('/');
    const id = parts[2];

    await executeQuery("DELETE FROM songs WHERE id = $1;", id);
};

const redirectToSongs = (request) => {
    request.respond({
        status: 303,
        // Note that we have changed the location into which 
        // the user is redirected! It is no longer request.url
        headers: new Headers({
            'Location': '/songs',
        })
    });
};


const handleGetSongs = async(request) => {
    const data = {
        songs: await getSongs()
    };
    request.respond({ body: await renderFile('index.ejs', data) });
};

const handlePostSong = async(request) => {
    await addSong(request);
    redirectToSongs(request);
}

const handleDeleteSong = async(request) => {
    await deleteSong(request);
    redirectToSongs(request);
}

for await (const request of server) {
    if (request.method === 'GET' && request.url === '/songs') {
        await handleGetSongs(request);
    } else if (request.method === 'POST' && request.url === '/songs') {
        await handlePostSong(request);
    } else if (request.method === 'POST' && request.url.includes('delete')) {
        await handleDeleteSong(request);
    } else {
        redirectToSongs(request);
    }
}
