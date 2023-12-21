const User = require("../models/User");
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }

    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: maxAge
    });
};

module.exports.signup_get = (req, res) => {
    const locals = {
        title: "Jobacy - Signup",
        description: "Keep track of your job applications",
    }
    res.render('signup', locals);
}

module.exports.login_get = (req, res) => {
    const locals = {
        title: "Jobacy - Login",
        description: "Keep track of your job applications",
    }
    res.render('login', locals);
}

module.exports.signup_post = async (req, res) => {
    const { firstName, lastName, email, gitHub, password } = req.body;

    try {
        const user = await User.create({ firstName, lastName, email, gitHub, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}