import { decode } from "https://deno.land/std@0.65.0/encoding/utf8.ts";
import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { renderFile } from 'https://raw.githubusercontent.com/syumai/dejs/master/mod.ts';

const server = serve({ port: 7777 });

const data = {
    board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ],
    turn: 'X'
};

const processBody = async(request) => {
    const bodyArr = await Deno.readAll(request.body);
    const body = decode(bodyArr);
    const params = new URLSearchParams(body);

    if (params.has('x') && params.has('y')) {
        const x = Number(params.get('x'));
        const y = Number(params.get('y'));

        data.board[y][x] = data.turn;

        if (data.turn === 'X') {
            data.turn = 'O';
        } else {
            data.turn = 'X';
        }
    }
}

for await (const request of server) {
    if (request.method === 'POST') {
        await processBody(request);
    }

    request.respond({ body: await renderFile('index.ejs', data) });
}
