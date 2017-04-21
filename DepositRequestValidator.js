/**
 * Created by jamie on 06/12/2016.
 */
const RequestValidator = require('./RequestValidator')
const conf = require('../conf/fund/config')

class DepositRequestValidator extends RequestValidator {

  constructor(opt) {
    super(opt)
    this.validCurrency = conf.validDepositCurrency
  }

  validate(request) {
    this.request = request
    this.currentCurrency = this.request.params.currency
    return super.validate(request)
  }
}

module.exports = DepositRequestValidator
