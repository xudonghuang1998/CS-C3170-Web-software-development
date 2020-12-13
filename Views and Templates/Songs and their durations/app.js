import { decode } from "https://deno.land/std@0.65.0/encoding/utf8.ts";
import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { renderFile } from 'https://raw.githubusercontent.com/syumai/dejs/master/mod.ts';

const server = serve({ port: 7777 });

const data = {
    songs: []
};

const processBody = async(request) => {
    const bodyArr = await Deno.readAll(request.body);
    const body = decode(bodyArr);
    const params = new URLSearchParams(body);

    if (params.has('name') && params.has('duration')) {
        data.songs.push({
            name: params.get('name'),
            duration: params.get('duration')
        })
    }
}

for await (const request of server) {
    if (request.method === 'POST') {
        processBody(request);
    }

    request.respond({ body: await renderFile('index.ejs', data) });
}
