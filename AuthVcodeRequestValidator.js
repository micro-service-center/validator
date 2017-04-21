const RequestValidator = require('./RequestValidator')

class AuthVcodeRequestValidator extends RequestValidator {
    constructor(opt) {
        super(opt)
    }
}


module.exports = AuthVcodeRequestValidator