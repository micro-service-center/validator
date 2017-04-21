const RequestAttributeValidator = require('./RequestAttributeValidator')

class VerifyVcodeRequestValidator extends RequestAttributeValidator {
    constructor(opt) {
        super(opt)
    }
}


module.exports = VerifyVcodeRequestValidator