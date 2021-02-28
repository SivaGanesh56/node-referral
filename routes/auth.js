const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation');


router.post('/register', async (req, res) => {
    // validation
    const { error } = registerValidation(req.body);
    if (error) res.status(400).send(error.details[0].message);

    const { name, email, password } = req.body;

    // Checking user exists in database
    const emailExist = await User.findOne({ email });
    if (emailExist) return res.status(400).send('Email already exists');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    

    const user = new User({
        name,
        email,
        password: hashedPassword,
    });
    try{
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch(err) {
        res.status(400).send(err);
    }
});


//LOGIN
router.post('/login', async (req, res) => {
    // validation
    const { error } = loginValidation(req.body);
    if (error) res.status(400).send(error.details[0].message);

    const { email, password } = req.body;

    // Checking if the email exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Email or password is wrong');

    // Check password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) return res.status(400).send('Invalid Password');

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
});


module.exports = router;