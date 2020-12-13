import * as newsService from "../../services/newsService.js";

const getNewsList = async({response}) => {
    response.body = await newsService.getNewsList();
};

const getNewsItem = async({params, response}) => {
    response.body = await newsService.getNewsItem(params.id);
};

const deleteNewsItem = async({params, response}) => {
    await newsService.deleteNewsItem(params.id);
    response.status = 200;
};

const addNewsItem = async({request, response}) => {
    const body = request.body({type: 'json'});
    const document = await body.value;
    await newsService.addNewsItem(document.title, document.content);
    response.status = 200;
};

export { getNewsList, getNewsItem, deleteNewsItem, addNewsItem };
routes/controllers/newsController.js

import * as newsService from "../../services/newsService.js";

const newsList = async({render}) => {
  render('index.ejs', { news: await newsService.getNewsList() });
};
 
const newsItem = async({params, render}) => {
  render('news-item.ejs', await newsService.getNewsItem(params.id));
};

export { newsList, newsItem };
