import ValidatorCode from "../models/ValidatorCode.js";
import moment from 'moment'



export const getCodeByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const foundUser = await ValidatorCode.findOne({ email: email });

        if (!foundUser) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(foundUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const saveCodeValidator = async (code, email) => {
    try {
        const trimmedCode = code.trim();
        const trimmedEmail = email.trim();

        const existCode = await ValidatorCode.findOne({ code: trimmedCode });

        if (existCode) return { success: false, error: 'El código ya existe' };

        const newCode = new ValidatorCode({
            code: trimmedCode,
            email: trimmedEmail,
            expirationDate: moment().add(24, 'hours'),
        });

        const saveCode = await newCode.save();
        if (saveCode) return { success: true, message: 'Código persistido' };
    } catch (error) {
        return { success: false, error: 'Error en el servidor' };
    }
}