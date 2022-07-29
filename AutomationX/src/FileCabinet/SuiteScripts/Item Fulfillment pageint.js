function FFpageint()
{

 /*var userAgent = navigator.userAgent.toLowerCase(); 
var Android = userAgent.indexOf("android") > -1; 
              
            if(Android && nlapiGetFieldValue('customform') != 350) { 
             //   alert( "Device is Android"; );
             nlapiSetFieldValue('customform', 350); 
            } 
*/
if( nlapiGetFieldValue('custbody151') == "T")
{

var rec = nlapiLoadRecord('itemfulfillment',nlapiGetRecordId());
var upspackagessaved = rec.getLineItemValue('packageups','packageweightups',1);
var fedexpackagessaved = rec.getLineItemValue('packagefedex', 'packageweightfedex', 1);
var defaultcarrier = nlapiGetFieldValue('shipcarrier');


var lineCount = rec.getLineItemCount('packagefedex');


if(rec.getLineItemCount('packageups')> 0)
{
lineCount = rec.getLineItemCount('packageups');
}

//for (var i =lineCount;  i >= 1; i--) 
for(i =1; i<=lineCount; i++)
	{


if(upspackagessaved > 0)
{
                var weight = rec.getLineItemValue('packageups','packageweightups',i);
                var additionalhandling =rec.getLineItemValue('packageups','additionalhandlingups', i);
                var deliveryconf  = rec.getLineItemValue('packageups','deliveryconfups', i);
                var largpack  = rec.getLineItemValue('packageups','largepackageindicatorups',  i);    
                var packaging  = rec.getLineItemValue('packageups','packagingups', i);
                var ref1  = rec.getLineItemValue('packageups','reference1ups', i);
                var usecode  = rec.getLineItemValue('packageups','usecodups', i);
                var insurance  = rec.getLineItemValue('packageups','useinsuredvalueups', i);

}

if(fedexpackagessaved >0)
{
             var weight = rec.getLineItemValue('packagefedex', 'packageweightfedex', i);
             var deliveryconf  =  rec.getLineItemValue('packagefedex', 'deliveryconffedex', i);
             var packaging  = rec.getLineItemValue('packagefedex', 'packagingfedex', i);
             var ref1  =rec.getLineItemValue('packagefedex', 'reference1fedex', i);
             var usecode  =  rec.getLineItemValue('packagefedex', 'usecodfedex', i);
             var insurance  = rec.getLineItemValue('packagefedex', 'useinsuredvaluefedex', i);


}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              		
if(defaultcarrier =="ups")
{ 
                nlapiRemoveLineItem('packageups',i);
               nlapiInsertLineItem('packageups', i);
               nlapiSetCurrentLineItemValue('packageups','packageweightups', weight , true);
         //alert("ups " + weight );
}
  else
{       
       nlapiRemoveLineItem('packagefedex',i);
      nlapiInsertLineItem('packagefedex', i);
      nlapiSetCurrentLineItemValue('packagefedex', 'packageweightfedex', weight , true);
      //alert("fedex" + weight );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if(defaultcarrier =="ups")
{
nlapiSetCurrentLineItemValue('packageups', 'additionalhandlingups' ,"F", true);// = F for ups only
}              
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if(defaultcarrier =="ups")
{ 
      nlapiSetCurrentLineItemValue('packageups', 'deliveryconfups',2 , true);                      
}
  else
{  
      nlapiSetCurrentLineItemValue('packagefedex', 'deliveryconffedex', 2, true);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(defaultcarrier =="ups")
{ 
   nlapiSetCurrentLineItemValue('packageups', 'largepackageindicatorups' , "F" , true);                        
}
                          
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(defaultcarrier =="ups")
{ 
     nlapiSetCurrentLineItemValue('packageups', 'packagingups' ,2, true);                      
}
  else
{  
     nlapiSetCurrentLineItemValue('packagefedex', 'packagingfedex', 10, true);
}
               
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if(defaultcarrier =="ups")
{ 
nlapiSetCurrentLineItemValue('packageups', 'reference1ups',ref1   , true);                   
}
  else
{  
 nlapiSetCurrentLineItemValue('packagefedex', 'reference1fedex', ref1  , true);       
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if(defaultcarrier =="ups")
{ 
 nlapiSetCurrentLineItemValue('packageups', 'usecodups',"F", true);         
}
  else
{  
nlapiSetCurrentLineItemValue('packagefedex', 'usecodfedex', "F", true);  
}

               
                
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(defaultcarrier =="ups")
{ 
  nlapiSetCurrentLineItemValue('packageups', 'useinsuredvalueups' ,  "F", true);  

 nlapiCommitLineItem('packageups');       
}
  else
{  
  nlapiSetCurrentLineItemValue('packagefedex', 'useinsuredvaluefedex', "F", true);
 
  nlapiCommitLineItem('packagefedex');
}
               
                

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}




Shipping.calculateRates();
nlapiSetFieldValue('custbody151', "F");
}

    if( nlapiGetFieldValue('customform') == 350) { setTimeout(function() { document.getElementById("custbody169").focus(); }, 100);  }

}