const RequestValidator = require('./RequestValidator')
const RateLimiter = require('./RateLimiter')

class RobustRequestValidator extends RequestValidator {

	constructor(opt){
		super(opt)
		this.rateLimiter = new RateLimiter({
			interval: opt.conf.RATE_LIMIT_INTERVAL
		})
	}

	enforceRateLimit(args) {
		args.limits.forEach((constrain)=>{
			this.rateLimiter.enforce(
				this.buildLimitKey(constrain.key), 
				{ limit: constrain.limit }
			)
			console.log(constrain)
		})
		// this.rateLimiter.enforce(key, options, cb)
	}

	get ip(){
		return RobustRequestValidator.getIP(this.request)
	}

	static getIP(req) {
		return req.headers['x-forwarded-for'] || 
			req.connection.remoteAddress || 
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress;	
	}

	buildLimitKey(key) {
		return `${key}-${this[key]}`
	}

}

module.exports = RobustRequestValidator