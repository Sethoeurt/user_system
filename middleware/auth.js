const isLogin = async (req, res, next) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/'); // Exit after redirect
        }
        next(); // Proceed to the next middleware/route
    } catch (error) {
        console.log(error.message);
        res.status(500).send("An error occurred while checking login status.");
    }
};

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            return res.redirect('/home'); // Exit after redirect
        }
        next(); // Proceed to the next middleware/route
    } catch (error) {
        console.log(error.message);
        res.status(500).send("An error occurred while checking logout status.");
    }
};

module.exports = {
    isLogin,
    isLogout,
};
