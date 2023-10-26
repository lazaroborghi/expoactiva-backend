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
                sub: payload.sub,
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
    let { name, email, password, birthDay } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    User.find({ email }).then(result => {

        if (result.length) {
            res.json({
                status: "FAILED",
                message: "Este email tiene una cuenta asociada"
            });
        } else {
            const saltRound = 10;
            bcrypt.hash(password, saltRound).then(hashedPassword => {
                const newUser = new User({
                    name,
                    email,
                    password: hashedPassword,
                    birthDay
                });

                newUser.save().then(result => {
                    res.json({
                        status: "SUCCESS",
                        message: 'Singup successful',
                        data: result
                    });
                }).catch(err => {
                    console.log(err);
                    res.json({
                        status: "FAILED",
                        message: "Singup failed"
                    });
                });
            });
        }
    }).catch(err => {
        console.log(err);
        res.json({
            status: "FAILED",
            message: "Error al buscar el usuario"
        });
    });
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


export const verifyEmail = async (req, res) => {

    const verifyMail = await getSecret('VERIFYMAIL');
    const code = generateRandomNumber();
    console.log(code);
    try {
        const { email } = req.body;
        const resend = new Resend(verifyMail);
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verificar email - Expoactiva Nacional',
            html: `<p>Ingresa este código en la aplicación para validar tu email <strong>${code}</strong></p>`
        });
        res.status(200).json({ code });

    } catch (error) {
        res.status(500).json({ error: error.message });

    }
};

