function mobiledevice( type) {
    var write = '';
    var headers = request.getAllHeaders();
    var userAgent = headers['User-Agent'];
    
      if (userAgent) {
        if (userAgent.indexOf('Android') >= 0  &&  nlapiGetFieldValue("customform") != 350 )// && contexts.getExecutionContext()  == 'userinterface'
        {  
    nlapiLogExecution('debug','is android',userAgent );
           
          nlapiSetRedirectURL('RECORD', nlapiGetRecordType(), nlapiGetRecordId(), true, {"cf":350});

        }
  }




}