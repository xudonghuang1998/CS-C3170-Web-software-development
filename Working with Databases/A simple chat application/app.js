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

const getMessages = async() => {
    const result = await executeQuery("SELECT sender, message FROM messages ORDER BY id DESC LIMIT 5;");
    if (result) {
        return result.rowsOfObjects();
    }

    return [];
}

const addMessage = async(request) => {
    const body = decode(await Deno.readAll(request.body));
    const params = new URLSearchParams(body);

    const sender = params.get('sender');
    const message = params.get('message');

    executeQuery("INSERT INTO messages (sender, message) VALUES ($1, $2);", sender, message);
}

const redirectToRoot = (request) => {
    request.respond({
        status: 303,
        headers: new Headers({
            'Location': '/',
        })
    });
};

const handleGetMessages = async(request) => {
    const data = {
        messages: await getMessages()
    };
    request.respond({ body: await renderFile('index.ejs', data) });
};

const handlePostMessage = async(request) => {
    await addMessage(request);
    redirectToRoot(request);
}

for await (const request of server) {
    if (request.method === 'GET') {
        await handleGetMessages(request);
    } else if (request.method === 'POST') {
        await handlePostMessage(request);
    } 
}
