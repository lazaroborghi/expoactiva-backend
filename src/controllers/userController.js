import User from '../models/User.js';

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
