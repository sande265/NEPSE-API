const { default: jwtDecode } = require('jwt-decode');
const { localValidation } = require('../../helpers/ValidationHelper');
const { paginate } = require('../../middlewares/Paginate');
const { getConfig, getAll, update, create, deleteWatchlist, deleteAll } = require('./userWatchlistModel');

module.exports = {
    createWatchlist: (req, res) => {
        const body = req.body;
        let token = req.headers.authorization || req.headers.auth
        token = token && token.split(" ")[1]
        const decoded = jwtDecode(token)
        let validationRule = {
            name: ['required'],
            qty: ['required'],
            buy_price: ['required'],
            buy_date: ['required'],
            type: ['required'],
            action: ['required']
        }
        if (Array.isArray(body)) {
            for (var i = 0; i < body.length; i++) {
                let item = body[i];
                if (i === (body.length - 1)) {
                    create(decoded.sub, item, (err, result) => {
                        if (err) {
                            console.log("err", err);
                        }
                    })
                    res.status(200).json({
                        message: 'Stocks Added Successfully',
                    })
                }
                else create(decoded.sub, item, (err, result) => {
                    if (err) {
                        console.log("err", err);
                    }
                })
            }
        } else {
            let error = {}
            let validation = localValidation(body, validationRule, error)
            if (validation.localvalidationerror) {
                res.status(422).json({
                    message: validation.error
                })
            } else {
                create(decoded.sub, body, (err, result) => {
                    if (err) {
                        let errMsg = err.sqlMessage && err.sqlMessage.split(`'`)
                        if (err.code === 'ER_BAD_NULL_ERROR') {
                            let column = err.sqlMessage.split(`'`)[1]
                            return res.status(400).json({
                                message: `${column} field cannot be null.`
                            })
                        }
                        return res.status(400).json({
                            message: err.code,
                        })
                    }
                    return res.status(200).json({
                        message: 'User Configs Added Successfully'
                    })
                })
            }
        }
    },
    getWatchlist: (req, res) => {
        const id = req.params.id;
        getConfig(id, (err, result) => {
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
            let temp = { ...result[0] };
            temp['scrips'] = JSON.parse(temp['scrips']);
            return res.status(200).json({
                message: "Successfully Retrived User Config",
                data: temp
            })
        })
    },
    getAllWatchlists: (req, res) => {
        let token = req.headers.authorization || req.headers.auth
        token = token && token.split(" ")[1]
        const decoded = jwtDecode(token)
        getAll(decoded.sub, (err, result) => {
            let { pages, limits, start, to, filterData, total, last_page } = paginate(result, req)
            if (err) return res.status(400).json({
                message: `${err.sqlMessage ? err.sqlMessage : 'Something Went Wrong'}`
            })
            else
                return res.status(200).json({
                    message: "Successfully Retrived Configs List",
                    current_page: pages,
                    data: filterData,
                    from: start,
                    to,
                    per_page: limits,
                    total,
                    last_page,
                })
        })
    },
    updateWatchList: (req, res) => {
        const id = req.params.id;
        const body = req.body;
        update(id, body, (err, result) => {
            if (err) return res.status(400).json({
                message: `${err.sqlMessage ? err.sqlMessage : 'Something Went Wrong'}`,
            })
            if (result.affectedRows === 0) {
                return res.status(400).json({
                    message: 'No Config Found With the Given ID.'
                })
            }
            return res.status(200).json({
                message: "User Config Updated Successfully",
            })
        })
    },
    deleteWatchlist: (req, res) => {
        const id = req.params.id;
        deleteWatchlist(id, (err, result) => {
            if (err) return res.status(400).json({
                message: `${err.sqlMessage ? err.sqlMessage : 'Something Went Wrong'}`
            })
            if (result.affectedRows === 0) {
                return res.status(400).json({
                    message: 'No Config Found With Then Given ID',
                })
            }
            return res.status(200).json({
                message: "user Config Deleted Successfully",
            })
        })
    },
}