import userRepository from '../repositories/user.repository.js';

export const updateLastSeen = async (req, res, next) => {
    try {
        if(req.session?.user?.id){
            await userRepository.update(req.session.user.id, {lastSeen: new Date()});
        }
        next();
    } catch (error) {
        console.log(error);
        next();
    }

}
