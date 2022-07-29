/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/file', './SiqUtilities.js'],
function (file, siqUtils) {

    function doGet(args) {
        var linesPerFile = 50000;
        var numberOfLines = 0;
        var numberOfFiles = 0;
        var numberedFiles = [];

        var fileToSplit = file.load({
            id: args.fileId
        });
        var baseFilename = fileToSplit.name.replace(".csv", "");
        var iterator = fileToSplit.lines.iterator();
        var numberedFileId;
        var numberedFile;

        iterator.each(function (line) {  
            if (numberOfLines == 0) {
                numberOfFiles++;
                var numberedFilename = buildNumberedFilename(baseFilename, numberOfFiles);
                numberedFile = createFile(file, numberedFilename, args.folderId);
            }

            numberedFile.appendLine({ value: line.value });
            numberOfLines++;

            //if we hit the limit, let's write the file and reset for the next file
            if (numberOfLines == linesPerFile) {
                numberedFileId = numberedFile.save();
                numberedFiles.push({
                    Id: numberedFileId,
                    Name: numberedFile.name
                });

                numberedFile = null;
                numberedFileId = null;
                numberOfLines = 0;
            }
            return true;
        });
        //we have some leftover lines, let's write'em
        if (numberedFile != null) {
            numberedFileId = numberedFile.save();
            numberedFiles.push({
                Id: numberedFileId,
                Name: numberedFile.name
            });
        }
        return numberedFiles;
    }

    function createFile(file, fileName, folderId) {
        var fileObj = file.create({
            name: fileName,
            fileType: file.Type.CSV,
            folder: folderId,
            contents: ' '
        });

        //fileObj.folder = folderId;
        //fileObj.save();
        return fileObj;
    }

    function padLeft(num) {
        var s = "000" + num;
        return s.substr(s.length - 3);
    }

    function buildNumberedFilename(baseFilename, fileNumber) {
        var fileNumber = padLeft(fileNumber);
        return baseFilename + fileNumber + ".csv";
    }

    return {
        get: doGet
    };

});


//Example args
//{
//    fileId: 4333035,
//    folderId: 1243235
//}