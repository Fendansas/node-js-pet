import user from "../models/user.js";

export const updateLastSeen = async (req, res, next) => {
    try {
        if(req.session?.user?.id){
            await user.findByIdAndUpdate(
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