const RequestValidator = require('./RequestValidator')

class APIKeyRequestValidator extends RequestValidator {
    constructor(opt) {
        super(opt)
        this.status = true
    }
}


module.exports = APIKeyRequestValidator
