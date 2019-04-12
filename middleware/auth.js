const hbs = require("hbs");

hbs.registerHelper('if_eq', function (a, b, opts) {
    if (a == b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

hbs.registerHelper('if_not', function (a, b, opts) {
    if (a !== b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

function cookiesCleaner(req, res, next) {
    console.log('middleware func');
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
}


const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        next();
    } else {
        res.redirect('/users/login');
    }
};

module.exports = {
    sessionChecker,
    cookiesCleaner
}