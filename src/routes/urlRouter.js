import { Router } from "express";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import { createShortUrl, deleteShortUrl, getUrl } from "../controllers/urlController.js";
import urlSchema from "../schemas/urlSchema.js";


const urlRouter = Router();

urlRouter.post('/urls/shorten', validateTokenMiddleware, validateSchemaMiddleware(urlSchema), createShortUrl);
urlRouter.get('/urls/:shortUrl', getUrl);
urlRouter.delete('/urls/:id', validateTokenMiddleware, deleteShortUrl);



export default urlRouter;