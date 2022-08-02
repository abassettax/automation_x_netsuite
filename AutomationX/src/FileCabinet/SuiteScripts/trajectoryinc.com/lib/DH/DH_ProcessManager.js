/**
 * @NApiVersion 2.x
 */
 define(["require", "exports", "N/cache"], function (require, exports, cache) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var PROCESSING_CACHE = 'DH_PROCESSING_CACHE';
    var PROCESSING_KEY = 'DH_ISPROCESSING';
    exports.processingStart = function () {
        var isProcessingCache = cache.getCache({ name: PROCESSING_CACHE, scope: cache.Scope.PUBLIC });
        isProcessingCache.put({ key: PROCESSING_KEY, value: 'true' });
    };
    exports.processingComplete = function () {
        var isProcessingCache = cache.getCache({ name: PROCESSING_CACHE, scope: cache.Scope.PUBLIC });
        isProcessingCache.remove({ key: PROCESSING_KEY });
    };
    exports.isProcessing = function () {
        var isProcessingCache = cache.getCache({ name: PROCESSING_CACHE, scope: cache.Scope.PUBLIC });
        return isProcessingCache.get({
            key: PROCESSING_KEY,
            loader: function () {
                return 'false';
            }
        }) === 'true';
    };
});
