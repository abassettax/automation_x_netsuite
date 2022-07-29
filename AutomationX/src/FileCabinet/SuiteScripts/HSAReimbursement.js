function HSAReimbursmentForm()
{
 var user = nlapiGetFieldValue('custrecord176');// nlapiGetUser(); //custrecord176
  if(!nlapiGetFieldValue('recordid')){user = nlapiGetFieldValue('custrecord176'); }
 var amountpaid = '0.00';
 var	 pendingamount =0;
  
var customrecord462Search = nlapiSearchRecord("customrecord462",null,
[
   ["custrecord178","within","thisyear"], 
   "AND", 
   ["custrecord176","anyof", user]
], 
[
   new nlobjSearchColumn("custrecord180",null,"SUM")
]
);
  ///////////////////eligible amount////////////////////////////////////////////////////////////////////
   var empcolumns = new Array();
   empcolumns[0] = new nlobjSearchColumn("formulacurrency",null,"AVG").setFormula("((TO_CHAR({today}, 'YYYY') - TO_CHAR({hiredate}, 'YYYY'))*50)+1000").setSort(false);
  var employeeSearch = nlapiSearchRecord("employee",null,
[
   ["internalidnumber","equalto",user]
], 
empcolumns
);
  //////////pending amount////////////////////////////////////////////////////////////////
var customrecord462SearchPending = nlapiSearchRecord("customrecord462",null,
[
   ["created","within","thisyear"], 
   "AND", 
   ["custrecord180","notgreaterthan","0.00"], 
   "AND", 
   ["custrecord176","anyof", user]
], 
[
   new nlobjSearchColumn("custrecord177",null,"SUM")
]
);
  
  ////////////approved amount/////////////////////////////////////////////////////////////
var ElAmount = employeeSearch[0].getValue(empcolumns[0]);

  if (customrecord462Search )
 		{
var	 amountpaid = customrecord462Search[0].getValue("custrecord180",null,"SUM");
        }
  
    if (customrecord462SearchPending )
 		{
var	 pendingamount = customrecord462SearchPending[0].getValue("custrecord177",null,"SUM");
        }
  
  ///////////////////////////////////////////////////////////////////////////////////
  var amountremaning = (ElAmount  - amountpaid -pendingamount).toFixed(2);
  /////////////////////////////////////////////////////////////////////////////////////////
nlapiSetFieldValue('custrecord182', amountpaid); 
nlapiSetFieldValue('custrecord183', ElAmount); 
nlapiSetFieldValue('custrecord184', amountremaning); 
nlapiSetFieldValue('custrecord185', pendingamount); 
}







function fchangehsa(type, name)
{
   if( name == "custrecord176") //change amounts when employee changes
     {
      var user = nlapiGetFieldValue('custrecord176');// nlapiGetUser(); //custrecord176
  if(!nlapiGetFieldValue('recordid')){user = nlapiGetFieldValue('custrecord176'); }
 var amountpaid = '0.00';
 var	 pendingamount =0;
  
var customrecord462Search = nlapiSearchRecord("customrecord462",null,
[
   ["custrecord178","within","thisyear"], 
   "AND", 
   ["custrecord176","anyof", user]
], 
[
   new nlobjSearchColumn("custrecord180",null,"SUM")
]
);
  ///////////////////eligible amount////////////////////////////////////////////////////////////////////
   var empcolumns = new Array();
   empcolumns[0] = new nlobjSearchColumn("formulacurrency",null,"AVG").setFormula("((TO_CHAR({today}, 'YYYY') - TO_CHAR({hiredate}, 'YYYY'))*50)+1000").setSort(false);
  var employeeSearch = nlapiSearchRecord("employee",null,
[
   ["internalidnumber","equalto",user]
], 
empcolumns
);
  //////////pending amount////////////////////////////////////////////////////////////////
var customrecord462SearchPending = nlapiSearchRecord("customrecord462",null,
[
   ["created","within","thisyear"], 
   "AND", 
   ["custrecord180","notgreaterthan","0.00"], 
   "AND", 
   ["custrecord176","anyof", user]
], 
[
   new nlobjSearchColumn("custrecord177",null,"SUM")
]
);
  
  ////////////approved amount/////////////////////////////////////////////////////////////
var ElAmount = employeeSearch[0].getValue(empcolumns[0]);

  if (customrecord462Search )
 		{
var	 amountpaid = customrecord462Search[0].getValue("custrecord180",null,"SUM");
        }
  
    if (customrecord462SearchPending )
 		{
var	 pendingamount = customrecord462SearchPending[0].getValue("custrecord177",null,"SUM");
        }
  
  ///////////////////////////////////////////////////////////////////////////////////
  var amountremaning = (ElAmount  - amountpaid -pendingamount).toFixed(2);
  /////////////////////////////////////////////////////////////////////////////////////////
nlapiSetFieldValue('custrecord182', amountpaid); 
nlapiSetFieldValue('custrecord183', ElAmount); 
nlapiSetFieldValue('custrecord184', amountremaning); 
nlapiSetFieldValue('custrecord185', pendingamount);   
     }

  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////make files private 
  if(name=='custrecord186')
     {
       var fileid = nlapiGetFieldValue('custrecord186');
       nlapiRequestURL(nlapiResolveURL('SUITELET','customscript893','customdeploy1') + '&id=' + fileid);
       alert('done');
     }
 var newamount =0;
  var eligibleAmount =0;
  var YTDamount =0;
  var pendingamount =0;
  if(name == 'custrecord177' && nlapiGetFieldValue('custrecord184') )
    {
if( nlapiGetFieldValue('custrecord177') ){  newamount = nlapiGetFieldValue('custrecord177') ;    }
      if( nlapiGetFieldValue('custrecord183')){eligibleAmount = nlapiGetFieldValue('custrecord183') ; }
           if(nlapiGetFieldValue('custrecord182')){YTDamount = nlapiGetFieldValue('custrecord182');}
                if(nlapiGetFieldValue('custrecord185')){pendingamount = nlapiGetFieldValue('custrecord185') ;}
eligibleAmount = parseInt(eligibleAmount).toFixed(2);
YTDamount = parseInt(YTDamount).toFixed(2); 
pendingamount = parseInt(pendingamount).toFixed(2); 
newamount = parseInt(newamount).toFixed(2); 
     // alert(eligibleAmount  );  alert( YTDamount );  alert( pendingamount );  alert( newamount );
      
   var newremaining = parseInt(eligibleAmount) -( parseInt(YTDamount) +  parseInt(pendingamount) + parseInt(newamount));
      //alert(( YTDamount +  pendingamount + newamount));
  nlapiSetFieldValue('custrecord184', newremaining); 
    }
}