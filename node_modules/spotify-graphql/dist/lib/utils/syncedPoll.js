"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var poll = require('when/poll');
var pollsMap = {};
var Poll = (function () {
    function Poll(name, delay, debug) {
        if (delay === void 0) { delay = 200; }
        if (debug === void 0) { debug = false; }
        this.name = name;
        this.delay = delay;
        this.debug = debug;
        this.queue = [];
        this.poll = null;
    }
    Poll.prototype.run = function () {
        var _this = this;
        this.log('add item to queue', this.queue.length);
        if (!this.isRunning() && !this.isEmpty()) {
            this.poll = poll(function () {
                _this.log('consume from queue', _this.queue.length);
                var taskWrapper = _this.queue.pop();
                return taskWrapper.task.call(taskWrapper).then(taskWrapper.resolver, taskWrapper.rejecter);
            }, this.delay, function () { return _this.isEmpty(); }).then(function () { return _this.poll = null; });
        }
    };
    Poll.prototype.addToQueue = function (task) {
        var taskWrapper = {
            task: task,
            resolver: null,
            rejecter: null
        };
        this.queue.push(taskWrapper);
        var promiseSync = new Promise(function (resolve, reject) {
            taskWrapper.resolver = resolve;
            taskWrapper.rejecter = reject;
        });
        this.run();
        return promiseSync;
    };
    Poll.prototype.isRunning = function () {
        return this.poll !== null;
    };
    Poll.prototype.isEmpty = function () {
        return this.queue.length === 0;
    };
    Poll.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.debug) {
            console.log.apply(console.log, ['Poll >'].concat(args));
        }
    };
    return Poll;
}());
exports.Poll = Poll;
function syncedPoll(namespace, task, delay) {
    if (delay === void 0) { delay = 200; }
    if (lodash_1.isUndefined(pollsMap[namespace])) {
        pollsMap[namespace] = new Poll(namespace, delay);
    }
    return pollsMap[namespace].addToQueue(task);
}
exports.syncedPoll = syncedPoll;
