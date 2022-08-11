/******************************************************************************************************
	Script Name - 	AVA_CLI_CreateCompanyForm.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
*/

define(['N/record', 'N/url', 'N/https', './utility/AVA_Library'],
	function(record, url, https, ava_library){
		function createCompany(context){
			var cRecord = context.currentRecord;
			
			var companyName = cRecord.getValue({
				fieldId: 'ava_companyname'
			});
			var address1 = cRecord.getValue({
				fieldId: 'ava_address1'
			});
			var address2 = cRecord.getValue({
				fieldId: 'ava_address2'
			});
			var city = cRecord.getValue({
				fieldId: 'ava_city'
			});
			var state = cRecord.getValue({
				fieldId: 'ava_state'
			});
			var zip = cRecord.getValue({
				fieldId: 'ava_zip'
			});
			var country = cRecord.getValue({
				fieldId: 'ava_country'
			});
			var companyCode = cRecord.getValue({
				fieldId: 'ava_companycode'
			});
			var email = cRecord.getValue({
				fieldId: 'ava_email'
			});
			var firstName = cRecord.getValue({
				fieldId: 'ava_firstname'
			});
			var lastName = cRecord.getValue({
				fieldId: 'ava_lastname'
			});
			var phoneNumber = cRecord.getValue({
				fieldId: 'ava_phonenumber'
			});
			var tinNumber = cRecord.getValue({
				fieldId: 'ava_tinnumber'
			});
			var accountValue = cRecord.getValue({
				fieldId: 'ava_accvalue'
			});
			var licenseKey = cRecord.getValue({
				fieldId: 'ava_lickey'
			});
			var additionalInfo1 = cRecord.getValue({
				fieldId: 'ava_addtionalinfo1'
			});
			var additionalInfo2 = cRecord.getValue({
				fieldId: 'ava_addtionalinfo2'
			});
			var serviceUrl = cRecord.getValue({
				fieldId: 'ava_serviceurl'
			});
			
			if(companyName == null || companyName.length == 0){
				alert('Please enter company name');
				return false;
			}
			if(address1 == null || address1.length == 0){
				alert('Please enter address 1');
				return false;
			}
			if(city == null || city.length == 0){
				alert('Please enter city');
				return false;
			}
			if(state == null || state.length == 0){
				alert('Please enter state');
				return false;
			}
			if(zip == null || zip.length == 0){
				alert('Please enter zip');
				return false;
			}
			if(country == null || country.length == 0){
				alert('Please enter country');
				return false;
			}
			if(companyCode == null || companyCode.length == 0){
				alert('Please enter company code');
				return false;
			}
			if(email == null || email.length == 0){
				alert('Please enter email');
				return false;
			}
			if(firstName == null || firstName.length == 0){
				alert('Please enter first name');
				return false;
			}
			if(lastName == null || lastName.length == 0){
				alert('Please enter last name');
				return false;
			}
			if(phoneNumber == null || phoneNumber.length == 0){
				alert('Please enter phone number');
				return false;
			}
			
			var Url = url.resolveScript({
				scriptId: 'customscript_ava_general_restlet',
				deploymentId: 'customdeploy_ava_general_restlet'
			});
			Url = Url + '&type=dosomethingelse' + '&accountValue=' + accountValue + '&ava_lickey=' + licenseKey + '&ava_additionalinfo1=' + additionalInfo1+ '&ava_additionalinfo2=' + additionalInfo2;
			var resp = https.get({
				url: Url
			});
			
			var AvaTax = ava_library.mainFunction('AVA_InitSignatureObject', serviceUrl);
			
			var company = new AvaTax.company();	
			company.accountId 	   	 = accountValue;
			company.companyCode    	 = companyCode;
			company.name 		   	 = companyName;
			company.isDefault 	   	 = false;
			company.isActive 	   	 = true;
			company.taxpayerIdNumber = tinNumber;
			company.hasProfile 	   	 = true;
			company.defaultCountry 	 = country;
			
			var contact = company.newContact();
			contact.contactCode	= firstName.toUpperCase() + lastName.toUpperCase();
			contact.firstName 	= firstName;
			contact.lastName 	= lastName;
			contact.line1 		= address1;
			contact.line2 		= address2;
			contact.city 		= city;
			contact.region 		= state;
			contact.postalCode 	= zip;
			contact.country 	= country;
			contact.email 		= email;
			contact.phone 		= phoneNumber;
			
			company.contacts.push(contact);
			var createCompany = company.create(resp.body);
			
			try{
				var response = https.post({
					url: createCompany.url,
					body: createCompany.data,
					headers: createCompany.headers
				});
				
				if(response.code == 200 || response.code == 201){
					alert('Company created successfully.');
					var responseBody = JSON.parse(response.body);
					cRecord.setValue({
						fieldId: 'ava_companyid',
						value: responseBody[0].id
					});
					window.opener.location.reload(); // Refresh parent window
					return true;
				}
				else{
					var responseBody = JSON.parse(response.body);
					var message = responseBody.error.message;
					alert(message.replace('taxpayerIdNumber', 'Business Tax Identification Number (TIN)'));
					return false;
				}
			}
			catch(err){
				alert(err.message);
				return false;
			}
		}
		
		return{
			saveRecord: createCompany
		};
	}
);