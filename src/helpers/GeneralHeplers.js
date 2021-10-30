
module.exports = {
    ucFirst: (string) => {
        if (string && string.length > 0)
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },

    capitalString: (string) => {
        let array = string && typeof string === 'string' ? string.split("_") : []
        if (typeof string === 'object')
            Object.keys(string).map(key => {
                array.push(Array.isArray(string[key]) ? string[key].join('. ') : string[key])
            })
        array = array.map(item => {
            return ucFirst(item)
        })
        return array.join(" ")
    }
}
