import { decode } from "https://deno.land/std@0.65.0/encoding/utf8.ts";
import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { renderFile } from 'https://raw.githubusercontent.com/syumai/dejs/master/mod.ts';
import { Client } from "https://deno.land/x/postgres@v0.4.5/mod.ts";

const client = new Client({});

const server = serve({ port: 7777 });

const getNames = async() => {
    await client.connect();
    const result = await client.query("SELECT name FROM names;");
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

for await (const request of server) {
    if (request.method === 'GET') {
        const data = {
            names: await getNames()
        };
        request.respond({ body: await renderFile('index.ejs', data) });
    } else {
        // assuming that the method is POST
        await addName(request);
        request.respond({
            status: 303,
            headers: new Headers({
                'Location': request.url,
            })
        });
    }
}
