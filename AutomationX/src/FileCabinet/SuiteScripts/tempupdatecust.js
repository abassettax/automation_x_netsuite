function SetHoldOff(rec_type, rec_id)  
{
//var cust = nlapiLoadRecord(rec_type, rec_id);
  
nlapiSubmitField('customer', rec_id , 'creditholdoverride', "OFF", false, true);
 
}

