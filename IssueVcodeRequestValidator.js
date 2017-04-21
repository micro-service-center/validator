const RequestAttributeValidator = require('./RequestAttributeValidator')

class IssueVcodeRequestValidator extends RequestAttributeValidator {
    constructor(opt) {
        super(opt)
    }
}


module.exports = IssueVcodeRequestValidator