import { serve } from "https://deno.land/std@0.65.0/http/server.ts";

const server = serve({ port: 7777 });

for await (const request of server) {
    if (request.url.includes('secret')) {
        request.respond({ body: "The recipe is: ..." });
    } else {
        request.respond({ body: "Nothing to see here." });
    }
}
