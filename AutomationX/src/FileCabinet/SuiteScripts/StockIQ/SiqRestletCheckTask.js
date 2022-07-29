/**
*@NApiVersion 2.x
*@NScriptType RESTlet
*@NModuleScope SameAccount
*/
define(['N/search', 'N/record', 'N/error', 'N/log', 'N/file', 'N/task', 'N/config', './SiqUtilities.js'],
    function (search, record, error, log, file, task, config, siqUtils) {

        function doGet(args) {
            var taskStatus = task.checkStatus({
                taskId: args.taskId
            });
            return {
                TaskId: taskStatus.taskId,
                Status: taskStatus.status,
                FileId: taskStatus.fileId
            };
        }


        return {
            get: doGet,
            delete: null,
            post: null,
            put: null
        };

    });