const { paginate } = require('../../middlewares/Paginate');
const { getConfig, getAll, update, create, deleteWatchlist } = require('./userWatchlistModel');

module.exports = {
    createWatchlist: (req, res) => {
        const body = req.body;
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
            return res.status(200).json({
                message: 'User Configs Added Successfully'
            })
        })
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
        getAll((err, result) => {

            let { pages, limits, start, to, filterData, total, last_page } = paginate(result, req)
            filterData = filterData.map(x => {
                let { id, user_id, scrips } = x;
                var json = JSON.parse(scrips);
                return {
                    'id': id,
                    'user_id': user_id,
                    'scrips': json
                }
            });
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
    }
}