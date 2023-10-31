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
    } catch (error) {

        throw new Error(error);
    }
};

export const findOrCreateUserByEmail = async (req, res) => {
    try {
        let { name, email, password, birthDay } = req.body;
        name = name.trim();
        email = email.trim();
        password = password.trim();

        console.log(req.body)

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuario ya existe' });
        }

        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);
        const expirationCode = moment().add(24, 'hours')
        const code = generateRandomNumber();
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            birthDay,
            code,
            expirationCode,
            validateEmail: false
        });

        const savedUser = await newUser.save();


        const subject = "Verificación de tu cuenta - Expoactiva Nacional";
        const htmlContent = `
            Hola ${name}, tu código de verificación para ingresar a Expoactiva Nacional App es: 
            <a href="javascript:void(0)" onclick="navigator.clipboard.writeText('${code}')">
                <span style="color: blue;">${code}</span>
            </a>
            <br><br>
        `;
        await sendGenericEmail(email, subject, htmlContent);

        res.status(200).json({ message: 'Usuario creado con éxito', data: savedUser });

    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};


export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const foundUser = await User.findOne({ email: email });

        if (!foundUser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(foundUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const getCode = async (req, res) => {
    try {
        const { email } = req.params;
        const foundUser = await User.findOne({ email: email });

        if (!foundUser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({
            code: foundUser.code,
            expirationDate: foundUser.expirationCode
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}
export const updateUser = async function (req, res) {
    try {
        const updatedUser = await User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
