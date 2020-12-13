import { serve } from "https://deno.land/std@0.65.0/http/server.ts";

const server = serve({ port: 7777 });

for await (const request of server) {
    if (request.method === 'PEEK' && request.url === '/secret') {
        request.respond({ body: "Peeking at secret data..." });
    } else {
        request.respond({ body: "There is nothing to see here..." });
    }
}
