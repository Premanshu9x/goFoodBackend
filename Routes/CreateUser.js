const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const jwtSecret = "Thisisasecretkey"

router.post('/createuser',
    body('email').isEmail(),
    body('password', "Not a secure password!").isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt);

        try {
            await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPassword,
                location: req.body.location
            })

            res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    })


router.post('/loginuser',
    body('email').isEmail(),
    async (req, res) => {
        const email = req.body.email;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const userData =  await User.findOne({ email });
            if(!userData) {
                return res.status(400).json({errors: "Try Logging in with correct credentials!"})
            }

            let passcode = await bcrypt.compare(req.body.password, userData.password);

            if(!passcode) {
                return res.status(400).json({errors: "Try Logging in with correct credentials!"})
            }

            const data = {
                user: {
                    id: userData.id
                }
            }

            const authToken = jwt.sign(data, jwtSecret)

            res.json({ success: true, authToken: authToken });
        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    })

module.exports = router;