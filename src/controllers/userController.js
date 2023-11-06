import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { generateRandomNumber } from '../utils/utils.js';
import { sendGenericEmail } from '../utils/email.js';
import moment from 'moment'

export const findOrCreateLocalUser = async (payload) => {
    try {
        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = new User({
                name: payload.name,
                email: payload.email,
                picture: payload.picture
            });
            await user.save();
        }

        return user;
    } catch (error) { throw new Error(error); }
};

export const signup = async (req, res) => {
    try {
        let { name, email, birthDay, interests } = req.body;
        name = name.trim();
        email = email.trim();

        console.log(interests)

        const existingUser = await User.findOne({ email });
        const formatedDate = moment(birthDay).add(3, 'hours').format('DD-MM-YYYY');

        if (existingUser) { return res.status(400).json({ error: 'Usuario ya existe' }); }

        const saltRound = 12;
        const expirationCode = moment().subtract(2, 'hours').subtract(50, 'minutes');
        const code = generateRandomNumber().toString()
        const hashedCode = await bcrypt.hash(code, saltRound)


        const newUser = new User({
            name,
            email,
            birthDay: formatedDate,
            interests,
            code: hashedCode,
            expirationCode,
        });

        const savedUser = await newUser.save();
        const emailSent = await sendVerificationEmail(email, name, code);

        if (emailSent) { return res.status(201).json({ message: 'Usuario creado con éxito y correo enviado', data: savedUser }); }
        else { return res.status(200).json({ message: 'Usuario creado con éxito, pero no se pudo enviar el correo', data: savedUser }); }

    } catch (err) {

        res.status(500).json({ error: 'Error en el servidor' });
    }
};

async function sendVerificationEmail(email, name, code) {
    const subject = "Verificación de tu cuenta - Expoactiva Nacional";
    const htmlContent = `
            Hola ${name},<br><br>
            Tu código de verificación es: 
            <a href="#" style="color: blue; text-decoration: underline; cursor: pointer;">${code}</a>
            <br><br>
        `;

    try {
        await sendGenericEmail(email, subject, htmlContent);
        return true;
    } catch (error) { return false; }
}

export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const foundUser = await User.findOne({ email: email });

        if (!foundUser) return res.status(403).json({ error: "User not found" })

        if (foundUser) return res.status(200).json(foundUser);

    } catch (error) { return res.status(500).json({ error: error.message }); }
};


export const getCode = async (req, res) => {
    try {
        const { email, code } = req.query;
        const foundUser = await User.findOne({ email: email });

        if (!foundUser) { return res.status(404).json({ error: "Usuario no encontrado" }); }
        var now = moment().subtract(3, 'hours');

        bcrypt.compare(code, foundUser.code, async (err, result) => {
            if (result) {
                if (now.isAfter(foundUser.expirationCode)) {

                    return res.status(403).json({ error: "Código vencido" });
                } else {

                    return res.status(200).json({ error: "Código Correcto" });
                }
            } else {

                return res.status(400).json({ error: "Código incorrecto" });
            }
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

export const updateUser = async function (req, res) {
    try {
        const updatedUser = await User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });

        if (updatedUser) { res.json(updatedUser); }
        else { res.status(404).json({ error: "Usuario no encontrado" }); }

    } catch (err) { res.status(500).json({ error: err.message }); }
};


export const resendCode = async function (req, res) {
    try {
        const saltRound = 12;
        const user = await User.findOne({ email: req.params.email });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const now = moment().subtract(3, 'hours');
        if (now.isAfter(user.expirationCode) || user.expirationCode === null) {

            const code = generateRandomNumber().toString();
            const hashedCode = await bcrypt.hash(code, saltRound);

            const updateData = {
                code: hashedCode,
                expirationCode: now.add(10, 'minutes')
            };

            const updatedUser = await User.findOneAndUpdate({ email: req.params.email }, updateData, { new: true });
            const emailSent = await sendVerificationEmail(updatedUser.email, updatedUser.name, code);

            if (emailSent) {
                return res.status(201).json({ message: 'Código enviado con éxito', data: updatedUser });
            } else {
                return res.status(403).json({ message: 'Código actualizado, pero no se pudo enviar el correo', data: updatedUser });
            }
        } else {
            return res.status(200).json({ message: 'El código aún es válido', data: user });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
