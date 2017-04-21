const debug = require('debug')('phoenix:policy:rate-limiting')
const limiter = require('limiter')

/** Limites Access Rate */
class RateLimiter {
  constructor(options) {
    options = options || {};
    this.limit = options.limit || 1000;
    this.interval = options.interval || 60000; // 1 minute
    this.limiters = {};
    this.options = options;
  }

  /**
   * Get Limiter for different Keys
   * @param  {[type]} key   [description]
   * @param  {[type]} limit [description]
   * @return {[type]}       [description]
   */
  get_limiter(key, limit) {
    var inst;
    debug('Key: %s', key) 
    if (key) {
      inst = this.limiters[key]
      if (!inst) {
        debug('Creating rate limiter: %d %d', limit, this.interval);
        inst = new limiter.RateLimiter(limit, this.interval);
        this.limiters[key] = inst;
      }
    }
    return inst
  }

  /**
   * Enforce the Limit
   * @param  {[type]}   key     [description]
   * @param  {[type]}   options [description]
   * @param  {Function} cb      [description]
   * @return {[type]}           [description]
   */
  enforce(key, options, cb) {
    if (cb === undefined && typeof options === 'function') {
      cb = options
      options = {}
    }
    options = options || {}
    let weight = options.weight || 1
    let limit = options.limit || this.limit
    let inst = this.get_limiter(key, limit)

    if (inst) {
      let ok = inst.tryRemoveTokens(weight)
      debug('Bucket: ', inst.tokenBucket);
      var remaining = Math.floor(inst.getTokensRemaining());
      var reset =
        Math.max(this.interval - (Date.now() - inst.curIntervalStart), 0);

      debug('Limit: %d Remaining: %d Reset: %d', limit, remaining, reset);

      var result = {
        limit: limit,
        remaining: remaining,
        reset: reset,
        isAllowed: ok
      }

      process.nextTick(() => {
        if (cb) {
          cb(null, result);
        }
      })

    }
  }

}

module.exports = RateLimiter