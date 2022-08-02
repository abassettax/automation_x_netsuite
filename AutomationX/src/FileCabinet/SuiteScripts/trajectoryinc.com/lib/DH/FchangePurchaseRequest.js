/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/error', 'N/search'],
  function (error, search) {

    function fieldChanged(context) {
      var currentRecord = context.currentRecord;
      //////
      // var sublistName = context.sublistId;
      var FieldName = context.fieldId;
      // var line = context.line;

      if (FieldName === 'custpage_filterlocationid' || FieldName === 'custpage_nonstockonly') {
        var location = currentRecord.getValue('custpage_filterlocationid');
        var stocked = currentRecord.getValue('custpage_nonstockonly');
        var url = document.URL;
        //alert("fieldChanged Triggered! " +location);	
        window.open(url + "&locationFilter=" + location + "&normallystocked=" + stocked, '_self');
        return true;
      }



    }
    return {
      fieldChanged: fieldChanged,
    };
  });