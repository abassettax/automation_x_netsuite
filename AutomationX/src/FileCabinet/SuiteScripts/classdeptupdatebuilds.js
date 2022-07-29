function buildclassdept(recordType, recordID)

{

var build_class ="63";

var build_dept = "6";


//nlapiSubmitField(recordType, recordID, 'class', cust_class );



var recOpportunity = nlapiLoadRecord(recordType, recordID);

var iscable =recOpportunity.getFieldValue('custbody152');
if( iscable == "T")
{
build_dept ="21";
}

recOpportunity.setFieldValue('class', build_class );
recOpportunity.setFieldValue('department', build_dept );
nlapiSubmitRecord(recOpportunity); 
  
}

/*
 ///////////////////////end IR Landed Cost update
{ 
 var rec = nlapiLoadRecord(recordType, recordID);
  
   var landedCostPercent = .015;
  
  ////////////////////////////////////////////////
 var cf =  rec.getFieldText('createdfrom');
  nlapiLogExecution('DEBUG', 'cf', cf); 
  
  if(cf.indexOf("Purchase") > -1 && rec.getFieldValue('landedcostmethod') == 'VALUE' )
    {
    var amountlandedcost = 0; 
    var amountoldlandedcost = 0;
var lineCount = parseInt(rec.getLineItemCount('item'));
	for(x =1; x<=lineCount; x++)
      {
var qty =rec.getLineItemValue('item', 'quantity', x);
        if(qty){
var itemrate = rec.getLineItemValue('item', 'rate', x);
var itemtypes = rec.getLineItemValue('item', 'itemtype', x);
var currentlandedamount = rec.getFieldValue('landedcostamount1'); 
 nlapiLogExecution('DEBUG', '1', 1); 
         nlapiLogExecution('DEBUG', 'itemtypes', itemtypes); 
if(itemrate>0 && itemtypes == 'InvtPart'){ amountlandedcost =parseInt(amountlandedcost) + ((  itemrate * parseInt(qty)) *  landedCostPercent );   amountoldlandedcost  =parseInt(amountlandedcost) + ((  itemrate * parseInt(qty)) *  .02 ); }
        }
       }
       nlapiLogExecution('DEBUG', 'amountlandedcost', amountlandedcost); 
  if( rec.getFieldValue('landedcostsourcetran1') == null)
     {
  rec.setFieldValue('custbody187', landedCostPercent *100);
  rec.setFieldValue('landedcostmethod','VALUE' );  
  rec.setFieldValue('landedcostamount1',amountlandedcost); 
     }
      nlapiSubmitRecord(rec); 
       nlapiLogExecution('DEBUG', 'done', 2); 
       }
 
}
/*
//update class on assemblies
 {



var build_class = "72";

//var build_dept = "6";
var recOpportunity = nlapiLoadRecord(recordType, recordID);
  nlapiLogExecution('DEBUG','itemtype',   recordID);
//nlapiSubmitField(recordType, recordID, 'class', cust_class );
  	var lineCount = recOpportunity.getLineItemCount('item');
	for(x =1; x<=lineCount; x++)
      {
        recOpportunity.selectLineItem('item', x);
        nlapiLogExecution('DEBUG','itemtype',   lineCount);
        if( recOpportunity.getCurrentLineItemValue('item' ,'itemtype') != 'EndGroup' &&  recOpportunity.getCurrentLineItemValue('item' ,'itemtype') != 'Group'){
        recOpportunity.setCurrentLineItemValue('item' ,'class' , 72);
             }
        recOpportunity.commitLineItem('item');
     
      }





recOpportunity.setFieldValue('class', 72);
//recOpportunity.setFieldValue('department', build_dept );
nlapiSubmitRecord(recOpportunity); 
} */
