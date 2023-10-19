const roundRobinLoadBalancer = require('./round-robin-load-balancer')

module.exports = function (api_key, payload, debug) {
    if (payload) {
        roundRobinLoadBalancer(api_key, payload, debug)
    }
}
