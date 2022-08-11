/******************************************************************************************************
	Script Name - 	AVA_RES_General.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Restlet
*/

define(['N/crypto', 'N/encode', './utility/AVA_CommonServerFunctions'],
    function(crypto, encode, ava_commonFunction){
		function get(context){
			if(context.type == 'dosomething'){
				try{
					var key = crypto.createSecretKey({
						guid: context.ava_addtionalinfo1,
						encoding: encode.Encoding.UTF_8
					});
					var cipher = crypto.createCipher({
						algorithm: crypto.EncryptionAlg.AES,
						key: key
					});
					cipher.update({
						input: context.ava_lickey
					});
					var cipherout = cipher.final({
						outputEncoding: encode.Encoding.HEX
					});
					
					return cipherout.ciphertext + '+' + cipherout.iv;
				}
				catch(err){
					return err.message;
				}
			}
			else{
				return ava_commonFunction.mainFunction('AVA_General', (context.accountValue + '+' + context.ava_lickey + '+' + context.ava_additionalinfo1 + '+' + context.ava_additionalinfo2));
			}
		}
		
		return{
			get: get
		};
	}
);