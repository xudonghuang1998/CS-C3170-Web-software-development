import { decode } from "https://deno.land/std@0.65.0/encoding/utf8.ts";
import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { renderFile } from 'https://raw.githubusercontent.com/syumai/dejs/master/mod.ts';

const server = serve({ port: 7777 });

const processBody = async(request) => {
    const bodyArr = await Deno.readAll(request.body);
    const body = decode(bodyArr);
    const params = new URLSearchParams(body);
    data.emperors.push(params.get('name'));
}

const data = {
    emperors: []
};

for await (const request of server) {
    if (request.method === 'POST') {
        await processBody(request);
        request.respond({
            status: 303,
            headers: new Headers({
                'Location': request.url
            })
        });
    } else {
        request.respond({ body: await renderFile('index.ejs', data) });
    }
}
