import { serve } from "https://deno.land/std@0.65.0/http/server.ts";

const server = serve({ port: 7777 });

const requestParams = (url) => {
    let queryParams = '';
    if (url.includes('?')) {
        queryParams = url.slice(url.indexOf('?'));
    }

    return new URLSearchParams(queryParams);
}

for await (const request of server) {
    const params = requestParams(request.url);

    let outcome = null;

    if (params.has('operation') && params.has('number1') && params.has('number2')) {
        const operation = params.get('operation');
        const number1 = Number(params.get('number1'));
        const number2 = Number(params.get('number2'));

        if (operation === 'sum') {
            outcome = number1 + number2;
        } else if (operation === 'difference') {
            outcome = number1 - number2;
        } else if (operation === 'product') {
            outcome = number1 * number2;
        } else if (operation === 'quotient') {
            outcome = number1 / number2;
        }

    }

    if (outcome) {
        request.respond({ body: `${outcome}` });
    } else {
        request.respond({ body: 'Invalid parameters.' });
    }

}
