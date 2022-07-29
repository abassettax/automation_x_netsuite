/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 */
define(['N/file'],
    function (file) {
        function doGet(args) {
            if (args) {
                var recFile = file.load({
                    id: args.fileId
                });

                if (recFile.size < 10485760) {
                    return recFile.getContents();
                    //return {
                    //    Success: 1,
                    //    Data: recFile.getContents(),
                    //    Message: null
                    //};
                } else {
                    return 'ERROR: File more than 10MB';
                    //return {
                    //    Success: 0,
                    //    Data: null,
                    //    Message: 'File more than 10MB'
                    //};
                }
            }
        }

        return {
            get: doGet
        };
    });

//Example args
//{
//    fileId: 4333035
//}