/**
*@NApiVersion 2.x
*@NScriptType RESTlet
*@NModuleScope SameAccount
*/
define(['N/search', 'N/record', 'N/error', 'N/log', 'N/file', 'N/task', 'N/config', './SiqUtilities.js'],
    function (search, record, error, log, file, task, config, siqUtils) {

        function doGet(args) {
            var folderId = args.folderId;
            var filename = args.filename;
            var searchId = args.searchId;
            var fileId = siqUtils.primeFile(file, folderId, filename);
          /////////////mh added
          log.debug({
    title: 'Saved Search ID', 
    details:  searchId
    });
      ///////////////////end mh added
      //
            var searchTaskId = siqUtils.executeSearchTask(task, searchId, fileId);
            return { SearchTaskId: searchTaskId };
        }

        return {
            get: doGet,
            delete: null,
            post: null,
            put: null
        };

            log.debug({
    title: 'Saved Search ID', 
    details:  searchId + 'done'
    });
    });

//Example args
//{
//    folderId: 4333035,
//    filename: "Site.csv",
//    searchId: "customsearchsiq_site"
//}