const { paginate } = require('../../middlewares/Paginate');
const { getSecurity, getAll, update, create, deleteSecurity, searchScrip, deleteAllSecurity, createCompanies } = require('./securitiesModel');
const axios = require('axios')

module.exports = {
    createSecurity: async (req, res) => {
        deleteAllSecurity((err) => {
            if (err) console.log('err deleteing', err);
        });
        const body = req.body;
        if (Array.isArray(body)) {
            for (var i = 0; i < body.length; i++) {
                let item = body[i];
                if (i === (body.length - 1)) {
                    create(item, (err, result) => {
                        if (err) {
                            console.log("err", err);
                        }
                    })
                    res.status(200).json({
                        message: 'All Items Added Successfully',
                    })
                }
                else create(item, (err, result) => {
                    if (err) {
                        console.log("err", err);
                    }
                })
            }
        } else {
            res.status(422).json({
                message: 'Array Is Required, Type = Array []'
            })
        }
    },
    createCompanies: (req, res) => {
        const body = req.body;
        if (Array.isArray(body)) {
            for (var i = 0; i < body.length; i++) {
                let item = body[i]
                if (i === (body.length - 1)) {
                    res.status(200).json({
                        message: 'All Items Added Successfully',
                    })
                }
                else createCompanies(item, (err, result) => {
                    if (err) {
                        console.log("err", err);
                    }
                })
            }
        } else {
            res.status(422).json({
                message: 'Array Is Required, Type = Array []'
            })
        }
    },
    getSecurity: (req, res) => {
        const id = req.params.id;
        getSecurity(id, (err, result) => {
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
                message: "Successfully Retrived Securities List",
                data: result[0]
            })
        })
    },
    getSecurities: (req, res) => {
        getAll((err, result) => {
            let { pages, limits, start, to, filterData, total, last_page, q } = paginate(result, req)
            if (err) return res.status(400).json({
                message: `${err.sqlMessage ? err.sqlMessage : 'Something Went Wrong'}`
            })
            if (q) {
                searchScrip(q, (error, results) => {
                    const { pages, limits, start, filterData, to, total, last_page } = paginate(results, req)
                    if (error) console.log("error", error);
                    else return res.status(200).json({
                        message: "Successfully Retrived Securities List",
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
            else
                return res.status(200).json({
                    message: "Successfully Retrived Securities List",
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
    updateSecurity: (req, res) => {
        const id = req.params.id;
        const body = req.body;
        update(id, body, (err, result) => {
            if (err) return res.status(400).json({
                message: `${err.sqlMessage ? err.sqlMessage : 'Something Went Wrong'}`,
            })
            if (result.affectedRows === 0) {
                return res.status(400).json({
                    message: 'No Securities Found With the Given ID.'
                })
            }
            return res.status(200).json({
                message: "Securities Updated Successfully",
            })
        })
    },
    deleteSecurity: (req, res) => {
        const id = req.params.id;
        deleteSecurity(id, (err, result) => {
            if (err) return res.status(400).json({
                message: `${err.sqlMessage ? err.sqlMessage : 'Something Went Wrong'}`
            })
            if (result.affectedRows === 0) {
                return res.status(400).json({
                    message: 'No Securities Found With Then Given ID',
                })
            }
            return res.status(200).json({
                message: "user Securities Deleted Successfully",
            })
        })
    },
    fetchSecurities: async (req, res) => {
        var response = await axios.get('https://bishaludas.github.io/NEPSE-Api/api/todayshare.json');
        const body = response.data;
        deleteAllSecurity((err) => {
            if (err) console.log('err deleteing', err);
        });
        if (Array.isArray(body)) {
            for (var i = 0; i < body.length; i++) {
                let item = body[i]
                if (i === (body.length - 1)) {
                    res.status(200).json({
                        message: 'Fetched Data Successfully'
                    })
                }
                else create(item, (err, result) => {
                    if (err) {
                        console.log("err", err);
                    }
                })
            }
        } else {
            res.status(500).json({
                message: 'Fetching Data Failed in a Generic way.'
            })
        }
    }
}