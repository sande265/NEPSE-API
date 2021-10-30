// Object.keys(req.query).map(key => {
    //     pool.query(
    //         `SELECT * FROM products WHERE ${key} LIKE (?)`,
    //         [`%${req.query[key]}%`],
    //         (err, result) => {
    //             if (err) {
    //                 res.status(400).json({
    //                     err
    //                 })
    //             } else {
    //                 res.status(200).json({
    //                     result
    //                 })
    //             }
    //         }
    //     )
    // })