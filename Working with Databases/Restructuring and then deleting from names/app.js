import { decode } from "https://deno.land/std@0.65.0/encoding/utf8.ts";
import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { renderFile } from 'https://raw.githubusercontent.com/syumai/dejs/master/mod.ts';
import { Client } from "https://deno.land/x/postgres@v0.4.5/mod.ts";

const client = new Client({});

const server = serve({ port: 7777 });

const getNames = async() => {
    await client.connect();
    const result = await client.query("SELECT * FROM names;");
    await client.end();

    return result.rowsOfObjects();
}

const addName = async(request) => {
    const body = decode(await Deno.readAll(request.body));
    const params = new URLSearchParams(body);

    const name = params.get('name');

    await client.connect();
    await client.query("INSERT INTO names (name) VALUES ($1);", name);
    await client.end();
}

const deleteName = async(request) => {
    console.log(`Delete name based on request url ${request.url}`);
    const parts = request.url.split('/');
    const id = parts[2];

    await client.connect();
    await client.query("DELETE FROM names WHERE id = $1;", id);
    await client.end();
};

const redirectToNames = (request) => {
    request.respond({
        status: 303,
        // Note that we have changed the location into which 
        // the user is redirected! It is no longer request.url
        headers: new Headers({
            'Location': '/names',
        })
    });
};

const handleGetNames = async(request) => {
    const data = {
        names: await getNames()
    };
    request.respond({ body: await renderFile('index.ejs', data) });
};

const handlePostNames = async(request) => {
    await addName(request);
    redirectToNames(request);
}

const handleDeleteNames = async(request) => {
    await deleteName(request);
    redirectToNames(request);
}

for await (const request of server) {
    if (request.method === 'GET' && request.url === '/names') {
        await handleGetNames(request);
    } else if (request.method === 'POST' && request.url === '/names') {
        await handlePostNames(request);
    } else if (request.method === 'POST' && request.url.includes('delete')) {
        await handleDeleteNames(request);
    } else {
        redirectToNames(request);
    }
}
