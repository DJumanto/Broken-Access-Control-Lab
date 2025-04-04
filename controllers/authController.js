import crypto from 'crypto';


const signIn = async (req, res) => {
    const { email, password } = req.body;
}

const signUp = async (req, res) => {
    const { email, password, name, role = user } = req.body;
    const photoProfile = req.file ? req.file.path : null;
    const salt = crypto.randomBytes(16).toString('hex');
}

module.exports = {
    signIn,
    signUp,
};