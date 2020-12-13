import { Router } from "../deps.js";
import * as newsController from "./controllers/newsController.js";
import * as newsApi from "./apis/newsApi.js";

const router = new Router();

router.get('/', newsController.newsList);
router.get('/news/:id', newsController.newsItem);

router.get('/api/news', newsApi.getNewsList);
router.post('/api/news', newsApi.addNewsItem);
router.get('/api/news/:id', newsApi.getNewsItem);
router.delete('/api/news/:id', newsApi.deleteNewsItem);

export { router };
