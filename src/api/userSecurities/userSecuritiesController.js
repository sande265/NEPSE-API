const { default: axios } = require("axios");
const pool = require("../../database/database");
const { getConfig } = require("../userWatchlist/userWatchlistModel");
const { getSecurities } = require("./userSecurityModel");

module.exports = {
    getUserSecurities: (req, res) => {
        let id = req.params.id;
        let items = [];
        // getConfig(id, (err, result) => {
        //     if (err) res.status(400).json({
        //         err,
        //         message: 'No Watchlist Binded to Provided User id'
        //     })
        //     else {

        //             )
        //     }
        // })
        // pool.query(
        //     `INSERT into user_securities (name, user_id) values('Machhapuchhre Bank Limited', '1')`,
        //     [],
        //     (error, result) => {
        //         if (error) console.log("error");
        //         else console.log("res", result);
        //     }
        // )
        getSecurities(id, (err, result) => {
            if (err) console.log("err", err);
            else res.json(
                result
            )
        })
        // pool.query(
        //     `SELECT * FROM user_securities WHERE user_id = 1`,
        //     [],
        //     (error, result) => {
        //         if (error) console.log("error");
        //         else res.json(
        //             result
        //         )
        //     }
        // )
    }
}

const getData = (data, items, callback) => {
    var items = [];
    for (var i = 0; i < scrips.length; i++) {

    }
    if (items.length > 0)
        callback(items)
}