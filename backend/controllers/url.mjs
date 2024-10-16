import { nanoid } from "nanoid";
import URL from "../models/url.mjs";

function isValidHttpUrl(str) {
    const pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$", // fragment locator
        "i"
    );
    return pattern.test(str);
}

export const generateShortURL = async function generateShortURL(req, res) {
    const body = req.body;

    if (!body.url) {
        return res.sendStatus(400).json({ error: "url is Required!" });
    }
    if (!isValidHttpUrl(body.url)) {
        // console.log("appple")
        return res.json({ error: "Require full valid URL" });
    }

    const checkInDB = await URL.findOne({ redirectURL: body.url });
    if (checkInDB) {
        try {
            // res.sendStatus(200).json({ id: checkInDB.shortId });
            res.send({ id: checkInDB.shortId });
            return;
        } catch (err) {
            console.log(err);
            return res.sendStatus(404);
        }
    }
    const shortId = nanoid(5);

    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        vistHistory: [],
    });

    res.send({ id: shortId });
};

export const redirectShortURL = async function redirectShortURL(req, res) {
    let shortId;
    try {
        shortId = req.params.shortId;
    } catch (err) {
        console.log(err);
        return res.sendStatus(404);
    }

    const matchedURL = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                vistHistory: {
                    timestamps: Date.now(),
                },
            },
        }
    );
    if (matchedURL) {
        res.redirect(matchedURL.redirectURL);
        return;
    } else {
        return res.status(404).json({ error: "not found" });
    }
    return;
};
