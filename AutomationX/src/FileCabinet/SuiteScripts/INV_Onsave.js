function invbeforeload(type)
{

 if (type == 'create')
       {
  
if( nlapiGetFieldValue('custbody38') == 'Required'){ nlapiSetFieldValue( 'custbody38', '');  }
if( nlapiGetFieldValue('custbody8') == 'Required'){ nlapiSetFieldValue( 'custbody8', '');  }
if( nlapiGetFieldValue('custbody9') == 'Required'){ nlapiSetFieldValue( 'custbody9', '');  }
if( nlapiGetFieldValue('custbody10') == 'Required'){ nlapiSetFieldValue( 'custbody10', '');  }
if( nlapiGetFieldValue('custbody69') == 'Required'){ nlapiSetFieldValue( 'custbody69', '');  }
if( nlapiGetFieldValue('custbody11') == 'Required'){ nlapiSetFieldValue( 'custbody11', '');  }
if( nlapiGetFieldValue('custbody67') == 'Required'){ nlapiSetFieldValue( 'custbody67', '');  }
if( nlapiGetFieldValue('custbody74') == 'Required'){ nlapiSetFieldValue( 'custbody74', '');  }
if( nlapiGetFieldValue('custbody87') == 'Required'){ nlapiSetFieldValue( 'custbody87', '');  }
if( nlapiGetFieldValue('custbody73') == 'Required'){ nlapiSetFieldValue( 'custbody73', '');  }  //
if( nlapiGetFieldValue('otherrefnum') == 'Required'){ nlapiSetFieldValue( 'otherrefnum', '');  } 
       }
}

function INVafterSubmit(type)
{
 if (type == 'create') 
 {
   if(nlapiGetFieldValue('createdfrom') ){var POnum = nlapiLookupField('salesorder', nlapiGetFieldValue('createdfrom') , 'otherrefnum');  if(POnum != 'Required'){nlapiSubmitField('invoice', nlapiGetRecordId() , 'otherrefnum', POnum);} }
 }
}

function INVonSave()
{

 if( nlapiGetFieldValue('otherrefnum') == 'Required'){ nlapiSetFieldValue( 'otherrefnum', '');  } 
     if (type == 'create ' || type =='edit')
   {
nlapiSetFieldValue( 'custbody208', nlapiGetFieldValue('otherrefnum') );
   }
     if(nlapiGetFieldValue('tranid'))
       {
       var custn = nlapiGetFieldValue('entity');
  var custnn = custn
  var ischild =  nlapiLookupField('customer', custn , 'parent');

  //check to see if there is a parent customer if so use that customer
  if(ischild)
    {
   custn = ischild;  
    }

	var lineCount = parseInt( nlapiGetLineItemCount('item'));
	for(x =1; x<=lineCount; x++)
	{
 var uid = nlapiGetLineItemValue('item', 'item', x);
  //////////////////////////
 var partnumbersSearchcolumns = new Array();
  partnumbersSearchcolumns[0] = new nlobjSearchColumn("formulatext",null,null).setFormula("'Customer Part #:' ||  {custrecord161} ||case when {custrecord162} IS NOT NULL THEN ' \n  Contract Line#:' || {custrecord162}else NULL END");
  partnumbersSearchcolumns[1] = new nlobjSearchColumn("custrecord171",null,null);
  partnumbersSearchcolumns[2] = new nlobjSearchColumn("custrecord162",null,null); //line
  partnumbersSearchcolumns[3] = new nlobjSearchColumn("custrecord161",null,null); // custpartnum
      
 var partnumbersSearch= nlapiSearchRecord("customrecord455",null,
[
   ["custrecord159","anyof",uid], 
   "AND", 
   ["custrecord160","anyof", custn]
], 
partnumbersSearchcolumns
);
 //////////////////////

 if(partnumbersSearch)
    {
         //var itemdescold = nlapiGetCurrentLineItemValue('item', 'description');
      var contractline = partnumbersSearch[0].getValue(partnumbersSearchcolumns[2]); //custrecord162
     
      var custpartnum =partnumbersSearch[0].getValue(partnumbersSearchcolumns[3]); //custrecord161
     
           var contractprice = partnumbersSearch[0].getValue(partnumbersSearchcolumns[1]);
         var new5codewithcustpartnumbers = partnumbersSearch[0].getValue(partnumbersSearchcolumns[0]) ;
        nlapiLogExecution('debug','custpartnum', custpartnum);
      
      // var newitemdesc = itemdescold + '\n\n' + new5codewithcustpartnumbers
      nlapiSelectLineItem('item', x);
      
      if(custpartnum){ nlapiSetCurrentLineItemValue('item', 'custcol94',  custpartnum );}

var unitprice =   nlapiGetCurrentLineItemValue('item', 'rate',  new5codewithcustpartnumbers );
      if(contractprice){
var pricevariance = unitprice - contractprice;
 var  pricevarianceFormated = '$' + parseFloat(pricevariance).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); 
      
var contractinfo = new5codewithcustpartnumbers + '\n Price Variance: ' + pricevarianceFormated;
         nlapiSetCurrentLineItemValue('item', 'custcol85',  pricevariance );
         nlapiSetCurrentLineItemValue('item', 'custcol84',  contractinfo );
        nlapiSetCurrentLineItemValue('item', 'custcol94',  custpartnum );
          nlapiSetCurrentLineItemValue('item', 'custcol95',  contractline );
        
      }
      nlapiCommitLineItem('item'); 
    }
}
/////end set cust part numbers
       }
}