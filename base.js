/** Class for Request Validator */
class BaseValidator {

	/**
	 * Initialize the validator
	 * @param  {Object}
	 * @param  {Array} policy_conf, Policies
	 */
	constructor(opt) {
		this.conf = opt.conf
		this.policyFactory = opt.policyFactory
		this.policy_list = []
	}

	/**
	 * @attribute policy_conf
	 */
	get policy_conf() {
		throw new Error('Unimplemented')
	}

	/**
	 * @attribute policies
	 */
	get policies() {
		var policy_list = []
		this.policy_conf.forEach((policy)=>{
			policy_list.push(this.policyFactory.build(policy))
		})
		return policy_list
	}

	before() {
		this.policy_list = this.policies
		return this
	}

	after() {
		return this.done()
	}

	/**
	 * Run checks all policies
	 * @return {[type]} [description]
	 */
	run() {
		return this.next()
	}

	next() {
		return this.policy_list.length?this.policy_list.shift().approve(this):this.after()
	}

	validate(obj) {
		return new Promise((resolve, reject)=>{
			this.resolve = resolve
			this.reject = reject
			this.before().run()
		})
	}

	/**
	 * check if request needs authentication
	 * @param  {request}
	 * @return {this}
	 */
	done()	{
		throw new Error('Unimplemented')
	}

}

module.exports = BaseValidator;