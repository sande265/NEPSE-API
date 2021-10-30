const pool = require("../../database/database")
const nodemailer = require('nodemailer')

module.exports = {
    authenticate: (username, callback) => {
        pool.query(
            `SELECT * from user where username = ?`,
            [username],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result[0])
            }
        )
    },
    authenticateUsingEmail: (email, callback) => {
        pool.query(
            `SELECT * from user where email = ?`,
            [email],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result[0])
            }
        )
    },
    sendResetEmail: (email, password, name, callback) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "sandetechtips265@gmail.com",
                pass: process.env.MAIL_PASS
            }
        })
        let year = new Date().getFullYear()
        var mailOptions = {
            from: '"No-Reply" <sandetechtips265@gmail.com>',
            to: email,
            subject: 'Password Reset.',
            html: `
                <h1>Password Reset Notification</h1>
                <p>Hello ${name},<p>
                <p>We have received a request to reset your password for your account.<br />
                The password for your account is ${password},<br />
                Thank you.</p><br />
                <br />
                <p>&copy; ${year} Sandesh Singh, All Rights Reserved</p>
            `
        };
        transporter.sendMail(mailOptions, (err, result) => {
            if (err) return callback(err)
            return callback(null, result)
        })
    }
}