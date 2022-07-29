/**
 * @NApiVersion 2.0
 */
 define(['N/currentRecord', 'N/email', 'N/record', 'N/url'], function (currentRecord, email, record, url) {
	return ({
		sendCountRejectEmail: function() {
			// Get a reference to the currently active record
			var countRec = currentRecord.get();

			var countOwner = countRec.getValue('custbody_ax_invcount_owner');
			var countApprover = countRec.getValue('custbody_ax_invcount_app');
			
			var recordid = countRec.id;
			var emailBody = 'Your Inventory Count has been rejected, please review. Inventory Count Link: ';
			var baseUrl = url.resolveDomain({
				hostType: url.HostType.APPLICATION,
				accountId: '422523'
			});
			var countUrl = url.resolveRecord({
				recordType: record.Type.INVENTORY_COUNT,
				recordId: recordid
			});
			var fullUrl = 'https://' + baseUrl + countUrl + '&whence=&cmid=1659049876220_18495';
			emailBody += baseUrl + countUrl;
			email.send({
				author: countApprover,
				recipients: countOwner,
				subject: 'Inventory Count Rejected',
				body: emailBody,
			});
		
			//only way to mimic rejecting the count
			update_count_status('reject');
			
			window.location.reload(true);
		}
	});
});