import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { generateRandomNumber } from '../utils/utils.js';
import { sendGenericEmail } from '../utils/email.js';
import moment from 'moment'

export const findOrCreateGoogleUser = async (payload, res) => {
    try {
        console.log('findOrCreateGoogleUser');
        console.log('payload', payload);
        let user = await User.findOne({ email: payload.email });
        console.log('user', user);
        
        if (user && !user.google) {
            return res.status(400).json({ error: 'Ya existe un usuario con ese correo' });
        }

        if (!user) {
            user = new User({
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                google: true,
                birthDay: ''

            });
            await user.save();
        }
        
        console.log('user return', user);
        return user;
    } catch (error) { throw new Error(error); }
};

export const signup = async (req, res) => {
    try {
        let { name, email, birthDay, interests } = req.body;
        name = name.trim();
        email = email.trim();
        const existingUser = await User.findOne({ email });
        const formatedDate = moment(birthDay).format('DD-MM-YYYY');


        if (existingUser && existingUser.google) { return res.status(400).json({ error: 'Usuario ya existe con otro metodo de autenticacion', google: true }); }
        if (existingUser) { return res.status(400).json({ error: 'Usuario ya existe', google: false }); }

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

        if (emailSent) {

            return res.status(201).json({ message: 'Usuario creado con éxito y correo enviado', data: savedUser });
        }
        else {

            return res.status(200).json({ message: 'Usuario creado con éxito, pero no se pudo enviar el correo', data: savedUser });
        }

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
            Si no fuiste tú, ponte en contacto con nosotros.
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

        if (foundUser && foundUser.google) return res.status(400).json({ error: 'El usuario ya existe con otro metodo de autenticacion', google: true });

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

        return res.status(500).json({ error: error.message });
    }
}

export const updateUser = async function (req, res) {
    try {
        const updatedUser = await User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });

        if (updatedUser) { res.status(200).json({ updatedUser }); }
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


export const deleteAccount = async (req, res) => {

    try {
        const { email } = req.params;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(405).json({ message: 'No se encuentra el usuario' });
        }

        await User.findByIdAndRemove(user._id);
        res.status(204).send();

    } catch (error) {
        res.status(500).json({ message: 'Error interno' });
    }
};


