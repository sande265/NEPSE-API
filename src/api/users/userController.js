const { genSaltSync, hashSync } = require('bcryptjs');
const { create, getUserById, getUsers, updateUser, deleteUser, searchUser } = require('./userModel')
const jwt = require('jwt-decode');
const { paginate } = require('../../middlewares/Paginate');

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
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
                    // error: err,
                    // message: `${err.sqlMessage ? err.sqlMessage : 'Database Connection Error.'}`,
                    message: `${errMsg[3]} ${errMsg[1]} already Exists.`
                })
            }
            return res.status(200).json({
                // data: result,
                message: 'User Created Successfully'
            })
        })
    },
    getUserById: (req, res) => {
        const id = req.params.id;
        getUserById(id, (err, result) => {
            if (err) {
                return res.status(400).json({
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
                    if (err) return res.status(400).json({
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
            if (err) return res.status(400).json({
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
            if (err) return res.status(400).json({
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
    }
}