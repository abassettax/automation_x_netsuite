/******************************************************************************************************
	Script Name - 	AVA_CommonServerFunctions.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
* @NApiVersion 2.0
* @NModuleScope Public
*/

define(['N/crypto', 'N/encode'],
	function(crypto, encode){
		var mainReturnObj;
		function executeCommonServerFunction(functionName, details){
			switch(functionName){
				case 'AVA_General':
					mainReturnObj = AVA_General(details);
					break;
				
				default:
					break;
			}
			
			return mainReturnObj;
		}
		
		function AVA_General(details){
			details = details.split('+');
			var key = crypto.createSecretKey({
				guid: details[2],
				encoding: encode.Encoding.UTF_8
			});
			var decipher = crypto.createDecipher({
				algorithm: crypto.EncryptionAlg.AES,
				key: key,
				iv: details[3]
			});
			decipher.update({
				input: details[1],
				inputEncoding: encode.Encoding.HEX
			});
			var decipherout = decipher.final({
				outputEncoding: encode.Encoding.UTF_8
			});
			return encode.convert({
				string: details[0] + ':' + decipherout.toString(),
				inputEncoding: encode.Encoding.UTF_8,
				outputEncoding: encode.Encoding.BASE_64
			});
		}
		
		return{
			mainFunction: executeCommonServerFunction
		};
	}
);