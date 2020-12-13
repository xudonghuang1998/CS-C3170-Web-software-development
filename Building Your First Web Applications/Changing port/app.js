import { serve } from "https://deno.land/std@0.65.0/http/server.ts";

const server = serve({ port: 31337 });

for await (const request of server) {
    request.respond({ body: "Hello world!\n" });
}
