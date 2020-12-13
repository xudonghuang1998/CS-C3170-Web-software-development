import { serve } from "https://deno.land/std@0.65.0/http/server.ts";

const server = serve({ port: 7777 });

for await (const request of server) {
    if (request.url.includes('css')) {
        request.respond({
            body: await Deno.readTextFile('styles.css')
        });
    } else {
        request.respond({
            body: await Deno.readTextFile('index.html')
        });
    }
}
