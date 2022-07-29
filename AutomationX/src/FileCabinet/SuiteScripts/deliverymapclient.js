function planroute()
{
  
  var destinationlocationG = nlapiGetLineItemValue('custpagesublist', 'locationadrs', 1 );
//  alert(destinationlocationG);
 nlapiCommitLineItem('custpagesublist');
    var routeXLwayPoint ='';
  var routecount=0;

  var waypointsG ='';
  var lineCount = nlapiGetLineItemCount('custpagesublist');
  for(x =1; x<=lineCount; x++)
    {
if(nlapiGetLineItemValue('custpagesublist', 'include', x ) == 'T') {waypointsG += nlapiGetLineItemValue('custpagesublist', 'waypoints', x );  routeXLwayPoint += nlapiGetLineItemValue('custpagesublist', 'routexl', x ); routecount++;} 
  
    }
  if(routecount == 0){alert('Please Select One or more addresses before planning route. '); return false;}
 
  if(1 ==2){
  var routeXlURL = 'http://www.routexl.com/?q='+destinationlocationG+  routeXLwayPoint;  
 window.open(routeXlURL , "_blank");
  }
  else
  {
    var gURL ='https://www.google.com/maps/dir/?api=1&destination='+destinationlocationG +  '&waypoints='  + waypointsG + '&travelmode=driving';    
  window.open(gURL , "_blank");
  }
}
/////////////////////////
//
//
function deliverymapclient()
{

  var destinationlocationG = nlapiGetLineItemValue('custpagesublist', 'locationadrs', 1 );
//  alert(destinationlocationG);
 nlapiCommitLineItem('custpagesublist');
    var routeXLwayPoint ='';
  var routecount=0;

  var waypointsG ='';
  var lineCount = nlapiGetLineItemCount('custpagesublist');
  for(x =1; x<=lineCount; x++)
    {
if(nlapiGetLineItemValue('custpagesublist', 'include', x ) == 'T') {waypointsG += nlapiGetLineItemValue('custpagesublist', 'waypoints', x );  routeXLwayPoint += nlapiGetLineItemValue('custpagesublist', 'routexl', x ); routecount++;} 
  
    }
  if(routecount == 0){alert('Please Select One or more addresses before planning route. '); return false;}
 
  if(routecount > 1){
  var routeXlURL = 'http://www.routexl.com/?q='+destinationlocationG+  routeXLwayPoint;  
 window.open(routeXlURL , "_blank");
  }
  else
  {
    var gURL ='https://www.google.com/maps/dir/?api=1&destination='+destinationlocationG +  '&waypoints='  + waypointsG + '&travelmode=driving';    
  window.open(gURL , "_blank");
  }

}

function fchange(type,name)
{
  if(name =='custpage_locationid' )
     {
    var url = nlapiResolveURL('SUITELET', 'customscript1491', 'customdeploy1');
    url += '&custpage_locationid=' + nlapiGetFieldValue('custpage_locationid')   ;
    window.open(url , "_self");
     }
}

////////////////////////////////////////////////////////////////
function checkall()
{
  var lineCount = nlapiGetLineItemCount('custpagesublist');
  for(x =1; x<=lineCount; x++)
    {
      nlapiSelectLineItem('custpagesublist', x)
      nlapiSetCurrentLineItemValue('custpagesublist', 'include', 'T');
      nlapiCommitLineItem('custpagesublist');
    }

}

////////////////////////////////////////////////////////
function Uncheckall()
{
  var lineCount = nlapiGetLineItemCount('custpagesublist');
  for(x =1; x<=lineCount; x++)
    {
      nlapiSelectLineItem('custpagesublist', x)
      nlapiSetCurrentLineItemValue('custpagesublist', 'include', 'F');
      nlapiCommitLineItem('custpagesublist');
    }
}
////////////////////////////////////////////////////////