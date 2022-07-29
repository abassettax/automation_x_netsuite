function savrecSig(type, name) {

 if (type != 'delete')
  {
//  alert(1);
var piccode=sessionStorage.sigpic;
if (piccode!="")
{
//document.getElementsByName("custbody140")[0].value=piccode;
  nlapiSetFieldValue('custbody140', piccode); 
sessionStorage.sigpic="";
return true;
}

//end signature
sessionStorage.sigpic="";
  }
return true;
    
}
