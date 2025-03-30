const jwt = require("jsonwebtoken")
const secret = "Harshit$123@$";

function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
    }, secret);
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    }
    catch {
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
};  