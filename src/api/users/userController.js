const { genSaltSync, hashSync } = require('bcryptjs');
const { create, getUserById, getUsers, updateUser, deleteUser, searchUser, sendCreateEmail, updateStatus, sendVerifiedEmail } = require('./userModel')
const jwt = require('jsonwebtoken');
const { paginate } = require('../../middlewares/Paginate');
const { localValidation } = require('../../helpers/ValidationHelper');
const { checkTokenExpiry } = require('../../helpers/GeneralHeplers');
const { default: jwtDecode } = require('jwt-decode');

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        let validationRule = {
            username: ['required'],
            email: ['required'],
            password: ['required'],
            name: ['required']
        }
        let validation = localValidation(body, validationRule, error = {})
        if (validation.localvalidationerror) {
            res.status(422).json({
                message: validation.error
            })
        } else {
            body['role'] = 'user'
            body['image'] = ''
            body['contact'] = ''
            const salt = genSaltSync(10);
            body.password = hashSync(body.password, salt)
            create(body, (err, result) => {
                if (err) {
                    let errMsg = err.sqlMessage && err.sqlMessage.split(`'`)
                    if (err.code === 'ER_BAD_NULL_ERROR') {
                        let column = err.sqlMessage.split(`'`)[1]
                        return res.status(400).json({
                            message: `${column} field cannot be null.`
                        })
                    }
                    return res.status(400).json({
                        message: `${errMsg[3]} ${errMsg[1]} already Exists.`
                    })
                }
                else {
                    sendCreateEmail(body.email, body.name, body.username, (error, results) => {
                        if (error) res.status(500).json({ error })
                        else {
                            return res.status(200).json({
                                message: 'Registered Succesfully, please verify mail for access.'
                            })
                        }
                    })
                }
            })
        }
    },
    getUserById: (req, res) => {
        const id = req.params.id;
        getUserById(id, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: err,
                    message: `${err.sqlMessage ? err.sqlMessage : 'Result Not Found.'}`
                })
            }
            if (result && result.length <= 0) {
                return res.status(400).json({
                    message: 'No Records Found'
                })
            }
            return res.status(200).json({
                message: "Successfully Retrived",
                data: result[0]
            })
        })
    },
    getLoggedUser: (req, res) => {
        let token = req.headers.authorization || req.headers.auth
        token = token && token.split(" ")[1]
        const decoded = jwt(token)
        getUserById(decoded.sub, (err, result) => {
            if (err) res.status(204)
            if (result) res.status(200).json({
                logged: result[0],
            })
        })
    },
    getUsers: (req, res) => {
        let token = req.headers.authorization || req.headers.auth
        token = token && token.split(" ")[1]
        const decoded = jwt(token)
        getUserById(decoded.sub, (err, result) => {
            let user = result[0]
            if (user.role === 'admin') {
                getUsers((err, result) => {
                    const { pages, limits, start, to, filterData, total, last_page, q } = paginate(result, req)
                    if (err) return res.status(500).json({
                        message: `${err.sqlMessage ? err.sqlMessage : 'Something Went Wrong'}`
                    })
                    if (q) {
                        searchUser(q, (error, results) => {
                            const { pages, limits, start, filterData, to, total, last_page } = paginate(results, req)
                            if (error) console.log("error", error);
                            else return res.status(200).json({
                                message: "Successfully Retrived Users List",
                                current_page: pages,
                                data: filterData,
                                from: start,
                                to,
                                per_page: limits,
                                total,
                                last_page,
                            })
                        })
                    }
                    else return res.status(200).json({
                        message: "Successfully Retrived Users List",
                        current_page: pages,
                        data: filterData,
                        from: start,
                        to,
                        per_page: limits,
                        total,
                        last_page,
                    })
                })
            } else res.status(401).json({ message: 'Unauthorized', user: `User is Inactive, ${user.status}` })
        })
    },
    updateUser: (req, res) => {
        const id = req.params.id;
        const body = req.body;
        updateUser(id, body, (err, result) => {
            if (err) return res.status(500).json({
                message: `${err.sqlMessage ? err.sqlMessage : 'Something Went Wrong'}`,
            })
            if (result.affectedRows === 0) {
                return res.status(400).json({
                    message: 'No User Found With the Given ID.'
                })
            }
            return res.status(200).json({
                message: "Successfully Updated User.",
                // data: result
            })
        })
    },
    deleteUser: (req, res) => {
        const id = req.params.id;
        deleteUser(id, (err, result) => {
            if (err) return res.status(500).json({
                message: `${err.sqlMessage ? err.sqlMessage : 'Something Went Wrong'}`
            })
            if (result.affectedRows === 0) {
                return res.status(400).json({
                    message: 'No User Found With Then Given ID',
                })
            }
            return res.status(200).json({
                message: "User Deleted Successfully",
                // data: result
            })
        })
    },
    verifyUser: (req, res) => {
        let token = req.query.token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) res.status(400).json({ message: `Invalid Token, ${err.message}` })
            else {
                if (checkTokenExpiry(decoded)) {
                    updateStatus(decoded.sub, (error, result) => {
                        if (error) console.log("error", error);
                    })
                    sendVerifiedEmail(decoded.email, (error, result) => {
                        if (error) console.log("error @ verify mail", error);
                    })
                    res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" 
                        crossorigin="anonymous">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body>
                        <div class="d-flex justify-content-center align-items-center">
                            <div class="card mt-5">
                                <div class="card-body">
                                    <p>User Verification Successful, Please Close the window.</p>
                                    <a href="http://localhost:3000/login/" class="float-right">Proceed To Login</a>
                                </div>
                            </div>
                        </div>            
                    </body>
                    </html>
                    `)
                } else {
                    res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" 
                        crossorigin="anonymous">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body>
                        <div class="d-flex justify-content-center align-items-center">
                            <div class="card mt-5">
                                <div class="card-body">
                                    <p>Invalid Token or something went wrong, please try again.</p>
                                </div>
                            </div>
                        </div>            
                    </body>
                    </html>
                    `)
                }
            }
        })
    },
    resendVerification: (req, res) => {
        let token = req.query.token;
        let { name, email, username } = jwtDecode(token)
        sendCreateEmail(email, name, username, (error, results) => {
            if (error) res.status(500).json({ error })
            else {
                res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" 
                        crossorigin="anonymous">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body>
                        <div class="d-flex justify-content-center align-items-center">
                            <div class="card mt-5">
                                <div class="card-body">
                                    <p>New Link Create Successfully, Please check your mail</p>
                                </div>
                            </div>
                        </div>            
                    </body>
                    </html>
                    `)
            }
        })
    }
}