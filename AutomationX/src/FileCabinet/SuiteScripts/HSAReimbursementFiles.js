function HSAFiles(request, response)

{

   var fileid = request.getParameter('id');
  
     var files = nlapiLoadFile(fileid);
       files.setFolder(4232290);
       nlapiSubmitFile(files);
}