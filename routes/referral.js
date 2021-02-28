const router = require('express').Router();
const User = require('../models/User');
const verifyToken = require('./verifyToken');

router.post('/', verifyToken, async (req, res) => {
    const { email, referral } = req.body;
    try {
        const user = await User.findOne({ email });

        // Check referral mail in our database. send mail only if it doesn't exists
        const referralUser = await User.findOne({ email: referral });
        if (referralUser) return res.status(400).send('Email already registered');

        const { referrals = [] } = user;
        const newReferral = {
            email: referral,
            status: 'PENDING'
        };
        // Checking whether user is already referred or not
        const isAlreadyReferred = referrals.find(item => item.email === referral);
        if (isAlreadyReferred) return res.status(400).send('you already referred');

        const updatedReferrals = [ ...referrals, newReferral ];
        await User.updateOne({ email }, { referrals: updatedReferrals });
        res.send('referral mail sent');
     } catch (error) {
        res.send('internal error occured');
     }
});

module.exports = router;