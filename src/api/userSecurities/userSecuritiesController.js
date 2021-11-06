const { default: jwtDecode } = require("jwt-decode");
const { paginate } = require("../../middlewares/Paginate");
const { getSecurities, searchScrip } = require("./userSecurityModel");

module.exports = {
    getUserSecurities: (req, res) => {
        let token = req.headers.authorization || req.headers.auth
        token = token && token.split(" ")[1]
        const decoded = jwtDecode(token)
        getSecurities(decoded.sub, (err, result) => {
            let { pages, limits, start, to, filterData, total, last_page, q } = paginate(result, req)
            if (err) return res.status(500).json({
                message: `${err.sqlMessage ? err.sqlMessage : 'Something Went Wrong'}`
            })
            if (q) {
                searchScrip(q, (error, results) => {
                    const { pages, limits, start, filterData, to, total, last_page } = paginate(results, req)
                    if (error) res.status(400).json(error)
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
    getTodaysValue: (req, res) => {
        let token = req.headers.authorization || req.headers.auth
        token = token && token.split(" ")[1]
        const decoded = jwtDecode(token)
        getSecurities(decoded.sub, (err, result) => {
            if (err) return res.status(500).json({
                message: `${err.sqlMessage ? err.sqlMessage : 'Something Went Wrong'}`
            })
            else {
                let total = 0;
                let unrealised_profit = 0;
                let investment = 0;
                let daily_profit = 0;
                let total_scrips = 0;
                let total_profit = 0;
                for (var i = 0; i < result.length; i++) {
                    let item = result[i];
                    total += item.closing_price * item.qty
                    investment += item.buy_price * item.qty
                    daily_profit += item.closing_price - item.prev_closing
                }
                unrealised_profit = total - investment
                daily_profit = Math.round((daily_profit + Number.EPSILON) * 100) / 100
                total_scrips = result.length
                res.status(200).json({ total, unrealised_profit, investment, daily_profit, total_scrips, total_profit })
            }
        })
    }
}