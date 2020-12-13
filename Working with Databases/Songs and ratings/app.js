import { decode } from "https://deno.land/std@0.65.0/encoding/utf8.ts";
import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { renderFile } from 'https://raw.githubusercontent.com/syumai/dejs/master/mod.ts';
import { Client } from "https://deno.land/x/postgres@v0.4.5/mod.ts";

const client = new Client({
    hostname: "hostname-possibly-at-elephantsql.com",
    database: "database-name",
    user: "user-name-typically-same-as-database-name",
    password: "password",
    port: 5432
});

const server = serve({ port: 7777 });

const getSongs = async() => {
    await client.connect();
    const result = await client.query("SELECT * FROM songs;");
    await client.end();

    return result.rowsOfObjects();
}

const addSong = async(request) => {
    const body = decode(await Deno.readAll(request.body));
    const params = new URLSearchParams(body);

    const name = params.get('name');
    const rating = params.get('rating');

    await client.connect();
    await client.query("INSERT INTO songs (name, rating) VALUES ($1, $2);", name, rating);
    await client.end();
}

for await (const request of server) {
    if (request.method === 'GET') {
        const data = {
            songs: await getSongs()
        };
        request.respond({ body: await renderFile('index.ejs', data) });
    } else {
        // assuming that the method is POST
        await addSong(request);
        request.respond({
            status: 303,
            headers: new Headers({
                'Location': request.url,
            })
        });
    }
}
