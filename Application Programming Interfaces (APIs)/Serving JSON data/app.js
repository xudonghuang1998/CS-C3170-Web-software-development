import { serve } from "https://deno.land/std@0.65.0/http/server.ts";

const server = serve({ port: 7777 });

for await (const request of server) {
    let file = 'data.json';
    if (request.url === '/admin') {
        file = 'secret.json';
    }

    request.respond({
        body: await Deno.readTextFile(file),
        headers: new Headers({
            "Content-Type": "application/json",
        })
    });
}
