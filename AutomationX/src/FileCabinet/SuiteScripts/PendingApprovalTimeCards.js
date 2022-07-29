function pendingapprovalTimeCards(recordType, recordID)
{
  nlapiSubmitField(recordType, recordID, 'approvalstatus', 2 );
//nlapiSetFieldValue('approvalstatus', 2);

}