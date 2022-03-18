import { v4 as uuid } from "uuid";
import { connection } from "../database.js";

export async function deleteShortUrl (req, res) {

    const userId = res.locals.user.id;
    const {id} = req.params; 

    try {
        const result = connection.query(`
            SELECT * FROM "shortenedUrls"
            WHERE id = $1 AND "userId" = $2
        `, [id, userId]);

        if(result){
            await connection.query(`
                DELETE FROM "shortenedUrls"
                WHERE id = $1
            `, [id]);
        } else {
            return res.sendStatus(401)
        }

        res.sendStatus(204);


    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
}

export async function getUrl(req, res) {
    const { shortUrl } = req.params;

    try {

        const result = await connection.query(`
            SELECT * FROM "shortenedUrls"
            WHERE "shortUrl" = $1
        `, [shortUrl]);

        if(result.rows.length === 0){
            return res.sendStatus(404);
        }

        const {id, url, visitCount} = result.rows[0];
        
        await connection.query(`
            UPDATE "shortenedUrls"
            SET "visitCount" = $1
            WHERE id = $2
        `, [(visitCount + 1), id]);

        res.status(200).send({
            id, shortUrl, url
        });


    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function createShortUrl(req, res) {
    const { user: id } = res.locals;
    const { url } = req.body;
    try {

        const shortUrl = uuid().split('-')[0];

        await connection.query(`
            INSERT INTO "shortenedUrls" ("shortUrl", url, "userId")
            VALUES ($1, $2, $3)
        `, [shortUrl, url, id]);

        res.status(201).send({ shortUrl });

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}