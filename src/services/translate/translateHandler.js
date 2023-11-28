import { v2 } from "@google-cloud/translate";
import { getSecret } from "../../utils/secretManager.js";


const translateText = async (texto, idiomaDestino) => {
    try {

        const credentialsSecret = await getSecret('TRANSLATE_CREDENTIALS');

        const translate = new v2.Translate({
            credentials: JSON.parse(credentialsSecret),
            projectId: JSON.parse(credentialsSecret).projectId
        });

        const [translation] = await translate.translate(texto, idiomaDestino);
        return translation;
    } catch (error) {
        console.error(error);
    }
};

export const translateHandler = async (req, res) => {
    try {
        console.log(req.body)
        const {texto, idiomaDestino} = req.body;

        if (!texto || !idiomaDestino) {
            console.log("Missing required fields: text and target")
            return res.status(400).json({
                message: "Missing required fields: text and target"
            });
        }

        const translation = await translateText(texto, idiomaDestino);
        return res.status(200).json({ translation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}