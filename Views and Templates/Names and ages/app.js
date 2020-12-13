import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { renderFile } from 'https://deno.land/x/dejs@0.8.0/mod.ts';

const server = serve({ port: 7777 });

const data = {
    emperors: [{
        name: 'Augustus',
        yearOfBirth: -63
    }, {
        name: 'Tiberius',
        yearOfBirth: -42
    }, {
        name: 'Caligula',
        yearOfBirth: 12
    }, {
        name: 'Claudius',
        yearOfBirth: -10
    }, {
        name: 'Nero',
        yearOfBirth: 37
    }]
};

for await (const request of server) {
    request.respond({ body: await renderFile('index.ejs', data) });
}
