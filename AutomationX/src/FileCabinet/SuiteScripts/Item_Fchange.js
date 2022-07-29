function printShelfLabel()
{
var  itemId = nlapiGetRecordId();
//var printURL = 'https://system.na3.netsuite.com/app/common/search/searchresults.csv?printType=SEARCH&l=T&e=T&id=5589&Item_INTERNALID='
//+  itemId   + '&Item_LOCATION=@ALL@&style=NORMAL&report=&grid=&searchid=5589&dle=T&sortcol=Item_NAME_raw&sortdir=ASC&pdf=&size=1000&twbx=F&csv=Export&printtemplate=137&whence='

//var printURL = 'https://system.na3.netsuite.com/app/common/custom/advancedprint/printsearchresults.nl?printType=SEARCH&l=T&e=T&id=5589&Item_INTERNALID=' +  itemId   + '&Item_LOCATION=@ALL@&style=NORMAL&report=&grid=&searchid=5589&dle=T&sortcol=Item_NAME_raw&sortdir=ASC&pdf=&size=1000&twbx=F&csv=Export&printtemplate=137&whence=';
  var printURL = 'https://422523.app.netsuite.com/app/common/custom/advancedprint/printsearchresults.nl?printType=SEARCH&l=T&e=T&id=5589&Item_INTERNALID=' +  itemId   + '&Item_LOCATION=@ALL@&style=NORMAL&report=&grid=&searchid=5589&dle=T&sortcol=Item_NAME_raw&sortdir=ASC&pdf=&size=1000&twbx=F&csv=Export&printtemplate=137&whence=';
  
 window.open(printURL,'_blank');
}

function FChanged(type,name)
{

//---------------------------start update price change date--------------
 if( name == 'purchaseprice' &&  nlapiGetCurrentLineItemValue('itemvendor','preferredvendor') == "T" )
{

 var newPP = (nlapiGetCurrentLineItemValue('itemvendor','purchaseprice') * 1.02).toFixed(2);

nlapiSetFieldValue('cost',newPP );
}

//if (name  == 'urlcomponent' )
//{

//var newurl= nlapiGetFieldValue('urlcomponent');

//nlapiSetFieldValue('custitem76',newurl);
//}


if (name  == 'price_1_' || name == 'cost')
{

var date= new Date();
var month  = (date.getMonth() + 1);
var day  = date.getDate();
var year = date.getFullYear();

var today = (month + "/" + day + "/" + year);

nlapiSetFieldValue('custitem_price_change',today);


}

//--------------------end update price change ----------------------

return(true);

}




//--------------------set stock info to blank for new temp items ----------------------
function onsave(type)
{


var id =  nlapiGetRecordId();
var temp = nlapiGetFieldValue('custitem20');

//
if( id != '' && temp == 'T')
{

nlapiSetFieldValue( 'autopreferredstocklevel', 'F'  );
return true;
}





return true;


}