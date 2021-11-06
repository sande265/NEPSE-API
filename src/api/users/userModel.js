const pool = require("../../database/database")
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')

module.exports = {
    create: (data, callback) => {
        pool.query(
            `INSERT into user (name, username, password, email, role, image, status, contact)
                    values(?,?,?,?,?,?,?,?)`,
            [
                data.name,
                data.username,
                data.password,
                data.email,
                data.role ? data.role : 'user',
                data.image,
                0,
                data.contact,
            ], (error, result) => {
                if (error) return callback(error)
                return (callback(null, result))
            }
        )
    },
    getUsers: callback => {
        pool.query(
            `SELECT id, name, username, email, role, image, first_login, contact, created_at, updated_at, status from user`,
            [],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    getUserById: (id, callback) => {
        pool.query(
            `SELECT * from user where id = ? || username = ?`,
            [id, id],
            (error, result) => {
                delete result[0].password
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    updateUser: (id, data, callback) => {
        const updated_at = new Date()
        updated_at.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
        pool.query(
            `UPDATE user set name=?, username=?, email=?, role=?, image=?, updated_at = ?, status=?, contact=?, first_login=? where id = ?`,
            [
                data.name,
                data.username,
                data.email,
                data.role,
                data.image,
                updated_at,
                parseInt(data.status) === 1 || data.status == true ? 1 : 0,
                data.contact,
                data.first_login ? data.first_login : '',
                id
            ],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    updateStatus: (username, callback) => {
        pool.query(
            `UPDATE user SET status=? WHERE username = ?`,
            [
                1,
                username
            ],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    changePassword: (id, data, callback) => {
        pool.query(
            `UPDATE user set password=? where id = ?`,
            [
                data.password,
                id
            ],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    deleteUser: (id, callback) => {
        pool.query(
            `DELETE from user where id = ?`,
            [id],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    searchUser: (query, callback) => {
        pool.query(
            `SELECT id, name, username, email, role, image, contact, created_at, updated_at, status FROM user WHERE CONCAT(name, username) LIKE (?)`,
            [`%${query}%`],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    sendCreateEmail: (email, name, username, callback) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "sandetechtips265@gmail.com",
                pass: process.env.MAIL_PASS
            }
        })
        let year = new Date().getFullYear()
        let token = generateToken(username, email, name)
        let base_url = process.env.BASE_URL
        let url = `${base_url}/api/verify?token=${token}`
        var mailOptions = {
            from: '"No-Reply" <sandetechtips265@gmail.com>',
            to: email,
            subject: 'New Account.',
            html: `
                <h3>Registration Successfull</h3>
                <p>Hello ${name},<p>
                <p>Your account has been created successfully.<br />
                <a href=${url} rel="noreferrer target="_blank">Click Here</a> to verify you account, Please verify your account within 1 Hour,<br />
                Thank you.</p><br />
                <br />
                <a href="${base_url}/api/new-request?token=${token}" rel="noreferrer" target="_blank">Request New Link.</a>
                <p>&copy; ${year} Mero Portfolio, All Rights Reserved</p>
            `
        };
        transporter.sendMail(mailOptions, (err, result) => {
            if (err) return callback(err)
            return callback(null, result)
        })
    },
    sendVerifiedEmail: (email, callback) => {
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
            subject: 'Account Verification Successful.',
            html: `
                <h3>Verification Successfull</h3>
                <span>Your account has been successfully verified, now you can access all services without restriction.
                Thank you.</p><br />
                <br />
                <a href="https://mero-portfolio.dev.sandeshsingh.com.np/login" rel="noreferrer" target="_blank">Login to your account</a>
                <p>&copy; ${year} Mero Portfolio, All Rights Reserved</p>
            `
        };
        transporter.sendMail(mailOptions, (err, result) => {
            if (err) return callback(err)
            return callback(null, result)
        })
    },
}


const generateToken = (username, email, name) => {
    let token = jwt.sign({ sub: username, email: email, name: name }, process.env.JWT_SECRET, { expiresIn: '1h' })
    return token
}
