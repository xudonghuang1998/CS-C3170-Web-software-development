import { serve } from "https://deno.land/std@0.65.0/http/server.ts";

const server = serve({ port: 7777 });

for await (const request of server) {
    if (request.method === 'GET') {
        request.respond({ body: "Retrieving data..." });
    } else if (request.method === 'POST') {
        request.respond({ body: "Posting data..." });
    } else {
        request.respond({ body: "Unable to comply..." });
    }
}
