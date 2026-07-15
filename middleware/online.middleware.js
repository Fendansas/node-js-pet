import User from '../models/User.js';

export const updateLastSeen = async (req, res, next) => {
    try {
        if(req.session?.user?.id){
            await User.findByIdAndUpdate(
                req.session.user.id,
                {lastSeen: new Date()}
            );
        }
        next();
    } catch (error) {
        console.log(error);
        next();
    }

}
