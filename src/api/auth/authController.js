const { compareSync, hashSync } = require("bcryptjs");
const { authenticate, sendResetEmail, authenticateUsingEmail } = require("./authModel");
const jwt = require('jsonwebtoken');
const { updateUser } = require("../users/userModel");
const { localValidation } = require("../../helpers/ValidationHelper");

module.exports = {
    login: (req, res) => {
        const body = req.body;
        let validationRule = {
            username: ['required'],
            password: ['required']
        }
        let validation = localValidation(body, validationRule, error = {})
        if (validation.localvalidationerror) {
            res.status(422).json({
                message: validation.error
            })
        } else {
            authenticate(body.username, (err, result) => {
                if (err) return res.status(500).json({
                    message: err
                })
                if (!result) return res.status(400).json({
                    message: 'No user found with the given username.'
                })
                const results = compareSync(body.password, result.password)
                if (result) {
                    if (results === false) {
                        return res.status(400).json({
                            message: 'Invalid Username Or Password.'
                        })
                    } else if (result.status === 0) {
                        return res.status(401).json({
                            message: `User is Inactive, Unauthorized`
                        })
                    } else {
                        result.password = undefined;
                        let sign = {
                            iss: 'sandetechtips',
                            sub: result.id,
                            name: result.name,
                            email: result.email,
                        }
                        const token = jwt.sign(sign, process.env.JWT_SECRET, { expiresIn: '1y' },)
                        return res.status(200).json({
                            message: 'Logged In Successfully',
                            token: token,
                            token_type: 'Bearer',
                            first_login: result.first_login
                        })
                    }
                }
            })
        }
    },
    changePassword: (req, res) => {
        const { username, password } = req.body;
        let error = {}
        let validationRule = {
            username: ['required'],
            password: ['required']
        }
        let validation = localValidation(req.body, validationRule, error, false)
        if (validation.localvalidationerror) {
            res.status(422).json({
                message: error
            })
        } else {
            authenticate(username, (err, result) => {
                if (err) return res.status(500).json({
                    message: err
                })
                if (!result) return res.status(400).json({
                    message: "Invalid Username"
                })
                else {
                    result.password = undefined;
                    let data = { ...result }
                    data['password'] = hashSync(password, 10)
                    data['first_login'] = '0';
                    delete data['id']
                    updateUser(result.id, data, (err, result) => {
                        if (err) return res.status(400).json({ message: err })
                        return res.status(200).json({ message: "Password Changed Successfully" })
                    })
                }
            })
        }
    },
    resetPassword: (req, res) => {
        const { username } = req.body;
        if (!username) return res.status(422).json({
            username: ['Username Field is Required.']
        })
        authenticate(username, (err, result) => {
            if (err) return res.status(500).json({
                message: err
            })
            if (!result) return res.status(400).json({
                message: 'No User associated With The Given Username.'
            })
            if (result) {
                function randomString(length, chars) {
                    var mask = '';
                    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
                    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    if (chars.indexOf('#') > -1) mask += '0123456789';
                    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
                    var result = '';
                    for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
                    return result;
                }
                let temp = randomString(12, 'a#A');
                result.password = null;
                let data = { ...result };
                data['password'] = hashSync(temp.toString(), 10);
                data['first_login'] = 1;
                delete data['id'];
                updateUser(result.id, data, (err, result) => {
                    if (err) return res.status(400).json({ message: err })
                    // return res.status(200).json({ message: "Password Reset Successfully, Please Check Your Mail." })
                })
                sendResetEmail(data.email, temp, result.name, (err, result) => {
                    if (err) return res.status(500).json({ message: err })
                    return res.status(200).json({ message: "If there is an user associated with this username, reset link will be sent." })
                })
            }
        })
    }
}