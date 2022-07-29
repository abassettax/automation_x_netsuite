/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/error', 'N/search', 'N/runtime', 'N/log', 'N/file'],

function (error, search, runtime, log, file) {

    function doGet(args) {
        var fileObj = file.load({
            id: args.fileId //'22338251'
        });
        return fileObj;
    }

    return {
        'get': doGet
    };

});
