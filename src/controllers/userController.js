import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { generateRandomNumber } from '../utils/utils.js';
import { sendGenericEmail } from '../utils/email.js';
import { saveCodeValidator } from './validatorController.js';

export const findOrCreateLocalUser = async (payload) => {
    try {
        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = new User({
                name: payload.name,
                email: payload.email,
                picture: payload.picture
            });
            console.log(user);
            await user.save();
        }
        return user;
    } catch (error) {
        console.error("Error al buscar o crear el usuario:", error.message);
        throw error;
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

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            birthDay,
        });

        const savedUser = await newUser.save();

        console.log(savedUser)

        const code = generateRandomNumber();

        const subject = "Verificación de tu cuenta - Expoactiva Nacional";
        const text = `Hola ${name}, tu código de verificación es: ${code}`;
        await sendGenericEmail(email, subject, text);

        saveCodeValidator(code, email);

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

