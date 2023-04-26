const winston = require('winston')


module.exports = (err, res, req, next) => {
    winston.error(err.message, err);
    console.log(err.message, err)
    res.status(500).send('something went wrong')

}