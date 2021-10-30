module.exports = {
    paginate: (data, req) => {
        let { limit, page, q } = req.query;
        const pages = page ? parseInt(page) : 1;
        const limits = limit ? parseInt(limit) : 10;
        const start = (pages - 1) * limits + 1;
        const end = pages * limits;
        const total = data && data.length;
        let filter = req.query && req.query.filter;

        let filterData = data && data.slice(start - 1, end)

        const last_page = Math.ceil(total / limits)

        const to = (start - 1) + filterData && filterData.length

        return { pages, limits, start, to, filterData, total, last_page, q, filter }
    }
}