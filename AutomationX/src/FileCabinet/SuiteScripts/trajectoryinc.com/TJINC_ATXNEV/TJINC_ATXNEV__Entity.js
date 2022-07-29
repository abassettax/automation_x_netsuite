/**
* Copyright (c) 2014 Trajectory Inc. 
* 2 Berkeley Street, Unit 205, Toronto, ON, Canada, M5A 4J5 
* www.trajectoryinc.com 
* All Rights Reserved. 
*/

/**
* @System:  Automation X
* @Company: Trajectory Inc. / Kuspide Canada Inc.
* @CreationDate: 20140425
* @DocumentationUrl: [check]
* @ModuleDocumentationUrl: [check]
* @NamingStandard: TJINC_NSJ-1-3-2
*/

var b_ATXNEV_log = true;
var s__ATXNEV_agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:28.0) Gecko/20100101 Firefox/28.0';

function TJINC_ATXNEV_AfterSubmit_Entity(pID , Ctype, s_type, type) {
     var subCount =0;
     var pID = nlapiGetRecordId(); //nlapiGetFieldValue('parent');
     var PP = nlapiGetFieldValue('parent');
     var Ctype= nlapiGetRecordType();
  
  var customerSearch = nlapiSearchRecord("customer",null,
[
   ["parent","anyof","@NONE@"], 
   "AND", 
   ["internalidnumber","equalto",pID], 
   "AND", 
   ["count(subcustomer.internalid)","greaterthan","0"]
], 
[
   new nlobjSearchColumn("entityid",null,"GROUP").setSort(false), 
   new nlobjSearchColumn("internalid","subCustomer","COUNT")
]
);
  
  if(customerSearch) {subCount = customerSearch.length;}
  
  //nlapiLogExecution('DEBUG', 'parent',"p:"+subCount + " " + "i"+PP + " " + pID + " " + type );  
  if(nlapiGetFieldValue('custentity333') == "T" && nlapiGetFieldText('parent') == '' &&  subCount>0)
    {
     //  nlapiLogExecution('DEBUG', 'parent', pID + " " + Ctype +" "  );
var parms = {};
      parms.custscript5 = pID;
      parms.custscript6 = Ctype;
  
     
        nlapiScheduleScript('customscript894', null, parms);

    }}

/*
    if (!b_ATXNEV_log){ b_ADHNEV_log = (navigator.userAgent == s__ADHNEV_agent); }
    if (b_ATXNEV_log){ nlapiLogExecution('DEBUG', 'TJINC_ATXNEV_AfterSubmit_Entity In'); }
   
    TJINC_ATXNED_UpdateSubCustomers(s_type);
        
    if (b_ATXNEV_log){ nlapiLogExecution('DEBUG', 'TJINC_ATXNEV_AfterSubmit_Entity Out'); }
    }
} */ 