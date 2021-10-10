"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var when = require('when');
var lodash_1 = require("lodash");
function iteratorToQueryString(iterator) {
    switch (iterator._type) {
        case 'cursor':
            return iterator.after ? { after: iterator.after } : {};
        case 'offset':
            return { limit: iterator.limit, offset: iterator.offset };
        default:
            break;
    }
}
function updateIterator(iterator, update) {
    switch (iterator._type) {
        case 'cursor':
            var ressourceKeys = Object.keys(update);
            for (var _i = 0, ressourceKeys_1 = ressourceKeys; _i < ressourceKeys_1.length; _i++) {
                var key = ressourceKeys_1[_i];
                if (update[key].cursors) {
                    iterator.after = update[key].cursors.after;
                    iterator.total = update[key].total;
                }
            }
            break;
        case 'offset':
            if (update) {
                iterator.offset = update.offset + iterator.limit;
                iterator.total = update.total;
            }
            else {
                iterator.offset = iterator.offset + iterator.limit;
            }
            break;
        default:
            break;
    }
    return iterator;
}
function shouldStopIterate(iterator, maxResults) {
    switch (iterator._type) {
        case 'cursor':
            if (!!iterator.total) {
                return iterator.results.length >= maxResults ||
                    iterator.results.length >= iterator.total || !iterator.after;
            }
            else {
                return false;
            }
        case 'offset':
            if (!!iterator.total) {
                if (iterator.offset >= iterator.total) {
                    return true;
                }
                else {
                    return iterator.results.length >= maxResults;
                }
            }
            else {
                return false;
            }
        default:
            break;
    }
}
function createIterator(strategy, maxResults) {
    switch (strategy) {
        case 'OffsetPaging':
            return {
                _type: 'offset',
                results: [],
                total: null,
                offset: 0,
                limit: isFinite(maxResults) ? maxResults : 50,
            };
        case 'CursorPaging':
            return {
                _type: 'cursor',
                results: [],
                total: null,
                after: '',
                limit: isFinite(maxResults) ? maxResults : 50,
            };
        default:
            break;
    }
}
function paginatorFactory(strategy, _a) {
    var _b = _a.throttleDelay, throttleDelay = _b === void 0 ? 0 : _b, _c = _a.continueOnError, continueOnError = _c === void 0 ? false : _c, _d = _a.limit, limit = _d === void 0 ? 50 : _d;
    var maxResults = limit <= 0 ? Infinity : limit;
    var newIterator = createIterator(strategy, maxResults);
    return function paginator(client, method, formatter) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        var argsArray = Array.from(args);
        if (argsArray.length > 1 && lodash_1.isObject(argsArray[argsArray.length - 1])) {
            var queryStrings = argsArray[argsArray.length - 1];
            lodash_1.merge(queryStrings, iteratorToQueryString(createIterator(strategy, maxResults)));
        }
        else {
            argsArray.push(iteratorToQueryString(createIterator(strategy, maxResults)));
        }
        return new Promise(function (mainResolve, mainReject) {
            when.iterate(function (iterator) {
                return new Promise(function (resolve, reject) {
                    var newArgs = Array.from(argsArray);
                    var queryStrings = newArgs[newArgs.length - 1];
                    lodash_1.merge(queryStrings, iteratorToQueryString(iterator));
                    client[method].apply(client, newArgs).then(function (response) {
                        iterator.results = iterator.results.concat(formatter(response));
                        iterator = updateIterator(iterator, response.body);
                        resolve(iterator);
                    }).catch(function (error) {
                        if (continueOnError) {
                            iterator = updateIterator(iterator, null);
                            resolve(iterator);
                        }
                        else {
                            reject(error);
                        }
                    });
                });
            }, function (iterator) {
                return shouldStopIterate(iterator, maxResults);
            }, function (iterator) {
                return new Promise(function (resolve, reject) {
                    setTimeout(resolve, throttleDelay);
                });
            }, newIterator).then(function (result) { return mainResolve(result.results); }).catch(mainReject);
        });
    };
}
exports.paginatorFactory = paginatorFactory;
function paginatorFromVariables(strategy, variables) {
    return paginatorFactory(strategy, {
        throttleDelay: !!variables.throttle ? variables.throttle : 0,
        continueOnError: variables.continueOnError === 1,
        limit: variables.limit,
    });
}
exports.paginatorFromVariables = paginatorFromVariables;
