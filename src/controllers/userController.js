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
        let { name, email, password, birthDay } = req.body;
        name = name.trim();
        email = email.trim();
        password = password.trim();

        const existingUser = await User.findOne({ email });

        if (existingUser) { return res.status(400).json({ error: 'Usuario ya existe' }); }

        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);
        const expirationCode = moment().add(24, 'hours');
        const code = generateRandomNumber().toString()
        const hashedCode = await bcrypt.hash(code, saltRound)
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            birthDay,
            code: hashedCode,
            expirationCode,
            validateEmail: false
        });

        const savedUser = await newUser.save();
        const emailSent = await sendVerificationEmail(email, name, code);

        if (emailSent) { return res.status(201).json({ message: 'Usuario creado con éxito y correo enviado', data: savedUser }); }
        else { return res.status(200).json({ message: 'Usuario creado con éxito, pero no se pudo enviar el correo', data: savedUser }); }

    } catch (err) { res.status(500).json({ error: 'Error en el servidor' }); }
};

async function sendVerificationEmail(email, name, code) {

    const subject = "Verificación de tu cuenta - Expoactiva Nacional";
    const text = `Hola ${name}, tu código de verificación es: ${code}`;

    try {
        await sendGenericEmail(email, subject, text);
        return true;
    } catch (error) { return false; }
}



export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const foundUser = await User.findOne({ email: email });

        if (!foundUser) { return res.status(403).json({ error: "User not found" }); }
        return res.status(200).json(foundUser);

    } catch (error) { return res.status(500).json({ error: error.message }); }
};


export const getCode = async (req, res) => {

    try {
        const { email, code } = req.query;
        const foundUser = await User.findOne({ email: email });

        if (!foundUser) { return res.status(404).json({ error: "Usuario no encontrado" }); }

        bcrypt.compare(code, foundUser.code, async (err, result) => {
            if (result) {
                return res.status(200).json({ error: "Código Correcto" });
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
