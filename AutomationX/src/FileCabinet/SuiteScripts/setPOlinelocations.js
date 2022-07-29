function beforesubmitmh()
{
/*  var recid= nlapiGetRecordId();
  if(recid)
  {
    var columnsD = new Array();
       columnsD[0] =  new nlobjSearchColumn("tranid","CUSTRECORD_PO_SO_LINKAGE_SO","GROUP").setSort(false);
        var purchaseorderSearch = nlapiSearchRecord("customrecord_dh_po_so_linkage",null,
         [["custrecord_po_so_linkage_po.internalidnumber","equalto",recid ]], 
         columnsD
         );

var linkedSO = "";
      for(b =0; b < purchaseorderSearch.length && purchaseorderSearch; b++)  
	     {   
      var SOnum = purchaseorderSearch[b].getValue(columnsD[0]);
         if((b+1)%4==0 ) { linkedSO += SOnum + ' \n';  } else { linkedSO += SOnum + ', '; }
          }

    
     nlapiSetFieldValue('custbody184', linkedSO); 
    
    
     var loc = nlapiGetFieldValue('location');
    var lineCount = nlapiGetLineItemCount('item');
          for(i =1; i <= lineCount; i++)  
	     {  
     nlapiSelectLineItem('item',i);
     nlapiSetCurrentLineItemValue('item','location',loc ,true  ); 
     nlapiCommitLineItem('item');      
         } 
  }
///////////////////////////////////////////////////// 
  */
}



function setlinelocations(type)
{
  if(nlapiGetRecordId() && type != 'delete')
    {
var rec = nlapiLoadRecord('purchaseorder',nlapiGetRecordId());
var loc = rec.getFieldValue('location');

/////set list of SOs in linked transactions
  var recid= nlapiGetRecordId();
  if(recid)
  {
    var columnsD = new Array();
       columnsD[0] =  new nlobjSearchColumn("tranid","CUSTRECORD_PO_SO_LINKAGE_SO","GROUP").setSort(false);

        var purchaseorderSearch = nlapiSearchRecord("customrecord_dh_po_so_linkage",null,
         [["custrecord_po_so_linkage_po.internalidnumber","equalto",recid ]], 
         columnsD
         );
if(purchaseorderSearch)
   {
var linkedSO = "";
      for(b =0; b < purchaseorderSearch.length && purchaseorderSearch; b++)  
	{   
      var SOnum = purchaseorderSearch[b].getValue(columnsD[0]);
         if((b+1)%4==0 ) { linkedSO += SOnum + ' \n';  } else { linkedSO += SOnum + ', '; }
     }
  nlapiLogExecution('debug','purchaseorderSearch.length', purchaseorderSearch.length);
     rec.setFieldValue('custbody184', linkedSO); 
  }
//end


var lineCount = rec.getLineItemCount('item');
         for(i =1; i <= lineCount; i++)  
	     { 
   rec.selectLineItem('item',i);
    rec.setCurrentLineItemValue('item','location',loc ,true  ); 
           rec.commitLineItem('item');      
         }
nlapiSubmitRecord(rec,true);

//window.location.reload(true);
}  }
}

function getaddress()
{
var soid =nlapiGetFieldValue('custbody184');
  if(soid == ""){alert("Please add a value to Linked SO under the related records tab."); return false;}
var newadd = nlapiLookupField('salesorder' , soid, 'shipaddress');
 nlapiSetFieldValue('shipaddress', newadd); 
}



