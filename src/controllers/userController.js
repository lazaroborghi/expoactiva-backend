import User from '../models/User.js';

export const findOrCreateLocalUser = async (profile) => {
    try {
        let user = await User.findOne({ email: profile.email });
        
        if (!user) {
            user = new User({
                id: profile.id,
                fullname: profile.displayName,
                email: profile.emails[0].value,
                picture: profile.photos[0].value
            });

            await user.save();
        }

        return user;
    } catch (error) {
        console.error("Error al buscar o crear el usuario:", error.message);
        throw error;
    }
}
