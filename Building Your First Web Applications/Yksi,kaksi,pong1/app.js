import { serve } from "https://deno.land/std@0.65.0/http/server.ts";

const server = serve({ port: 7777 });

for await (const request of server) {
    if (request.url === '/one') {
        request.respond({ body: "yksi" });
    } else if (request.url === '/two') {
        request.respond({ body: "kaksi" });
    } else {
        request.respond({ body: "pong" });
    }
}
