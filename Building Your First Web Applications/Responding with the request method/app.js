import { serve } from "https://deno.land/std@0.65.0/http/server.ts";

const server = serve({ port: 7777 });

for await (const request of server) {
    request.respond({ body: `You made a request with method ${request.method}` });
}
