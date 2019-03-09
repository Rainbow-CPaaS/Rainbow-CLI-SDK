const Bottleneck = require("bottleneck");

const limiter = new Bottleneck({
    maxConcurrent: 8,
    minTime: 50
});

const limiter1param = (fct, token, param, callback) => {
    limiter.schedule(fct, token, param).then(json => {
        callback(json);
    });
};

const stop = () => {
    return limiter.stop({ dropWaitingJobs: false });
};

const count = () => {
    return limiter.counts();
};

module.exports = {
    limiter1param,
    stop,
    count
};
