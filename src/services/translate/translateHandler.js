import { Translate } from "@google-cloud/translate/build/src/v2/index.d.ts";
import { getSecret } from "../../utils/secretManager";

const translate = new Translate({
    projectId: JSON.parse(getSecret('TRANSLATE_CREDENTIALS')).projectId,
    credentials: JSON.parse(getSecret('TRANSLATE_CREDENTIALS'))
});

const translateText = async (text, target) => {
    try {
        const [translation] = await translate.translate(text, target);
        return translation;
    } catch (error) {
        console.error(error);
    }
};

export const translateHandler = async (req, res) => {
    try {
        const {text, target} = req.body;

        if (!text || !target) {
            return res.status(400).json({
                message: "Missing required fields: text and target"
            });
        }

        const translation = await translateText(text, target);
        return res.status(200).json({ translation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}