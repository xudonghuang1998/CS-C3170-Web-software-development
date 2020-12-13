import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { decode } from "https://deno.land/std@0.65.0/encoding/utf8.ts";

const server = serve({ port: 7777 });

const getBody = async(request) => {
    return decode(await Deno.readAll(request.body));
}

for await (const request of server) {
    if (request.method === 'POST') {
        const body = await getBody(request);
        const obj = JSON.parse(body);
        request.respond({
            body: obj.name
        });
    } else {
        request.respond({
            body: 'Send a JSON document here using the POST method.'
        });
    }
}
