import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';
import { generateRandomNumber } from '../utils/utils.js';
import { getSecret } from '../utils/secretManager.js';

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

        console.log('explote aca?')
        const savedUser = await newUser.save();

        console.log(savedUser)

        const verifyMail = await getSecret('VERIFYMAIL');
        const code = generateRandomNumber();

        const resend = new Resend(verifyMail);

        try {
            const data = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Verificar email - Expoactiva Nacional',
                html: `<p>Ingresa este código en la aplicación para validar tu email <strong>${code}</strong></p>`
            });
            console.log(data)
        } catch (error) {
            console.error(error);
        }


        res.status(200).json({ message: 'Usuario creado con éxito', data: savedUser });
        console.log('Usuario creado con éxito', JSON.stringify(savedUser));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const foundUser = await User.findOne({ email: email });
        if (!foundUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(foundUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

