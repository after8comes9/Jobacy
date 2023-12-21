const jwt = require('jsonwebtoken');
const User = require ('../models/User')
const Job = require ('../models/Job')
const jwtSecret = process.env.JWT_SECRET;

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, jwtSecret, (err) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                next();
            }
        });
    } else {
        res.redirect('/');
    }
};

const isAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        res.redirect('dashboard');
        next()
    } else {
        next()
    }
};



const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, jwtSecret, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                res.locals.user = await User.findById(decodedToken.id);
                next();
            }
        });
    }
    else {
        res.locals.user = null;
        next();
    }
}

const checkJob = async (req, res, next) => {
    const jobId = req.params.id;

    if (jobId) {
        res.locals.job = await Job.findById(jobId);
        next();
    } else {
        console.log('no job')
        next();
    }
}

module.exports = { requireAuth, isAuth, checkUser, checkJob };