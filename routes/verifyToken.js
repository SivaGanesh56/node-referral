const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}

/**
 * 1. send email with referral id (www.domain.com/?xyz123) referallId
 * 2. In register page, if link has referralId then register the user and update the referral rewards
 *          + change status(sent/registered)
 * 3. Dashboard Page after login 
 *      1. show user referral link (www.domain.com/?xyz123)
 *      2. show table and get all referrals by userId
 *      3. share with platforms like google, fb, twitter, github ......
 * 4. login with platforms like google, fb, twitter, github ......
 * 5. forgot password ==> send email with reset link
 */