/**
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 * @NScriptType Suitelet
 */
define(["require", "exports", "N/log", "N/record", "N/https", "N/search", "N/runtime", "N/ui/serverWidget", "N/email"],
    function (require, exports, log, record, https, search, runtime, serverWidget, email) {
        Object.defineProperty(exports, "__esModule", { value: true });
        var FORM = {
            title: 'Purchasing/Sourcing Inquiry'
        };
        exports.onRequest = function (context) {
            var requestRouter = {};
            requestRouter[https.Method.GET] = getHandler;
            requestRouter[https.Method.POST] = postHandler;
            var form = requestRouter[context.request.method] ? requestRouter[context.request.method](context) : null;
            if (form !== null) {
                context.response.writePage(form);
            }
        };
        var getHandler = function (context) {
            log.debug({
                title: 'params',
                details: JSON.stringify(context.request.parameters)
            });
            var userName = runtime.getCurrentUser().name;
            log.debug({
                title: 'userName',
                details: userName
            });
            var nameSplit = userName.split(',');
            var finalName = nameSplit[1].concat(' ' + nameSplit[0]);

            var rfqType = -1;
            if (context.request.parameters.type) {
                rfqType = +context.request.parameters.type;
            }
            var tranId = -1;
            if (context.request.parameters.tranid) {
                tranId = +context.request.parameters.tranid;
            }
            var itemId = -1;
            if (context.request.parameters.itemid) {
                itemId = +context.request.parameters.itemid;
            }
            var form = serverWidget.createForm({ title: FORM.title });
            var mainGroup = form.addFieldGroup({
                id : 'custpage_main',
                label : 'Settings'
            });
            var emailGroup = form.addFieldGroup({
                id : 'custpage_secondary',
                label : 'Email Details'
            });

            var rfqTypeFld = form.addField({ id: 'custpage_rfqtype', type: serverWidget.FieldType.SELECT, label: 'Request Type', container : 'custpage_main'});
            rfqTypeFld.addSelectOption({
                value: '',
                text: ''
            });
            rfqTypeFld.addSelectOption({
                value: '1',
                text: 'Purchasing - RFQ'
            });
            rfqTypeFld.addSelectOption({
                value: '2',
                text: 'Purchasing - PO Update'
            });
            rfqTypeFld.addSelectOption({
                value: '3',
                text: 'Sourcing - Inactive/Direct 5 Code'
            });

            if (rfqType != -1) {
                rfqTypeFld.defaultValue = rfqType;
                var emailFld = form.addField({ id: 'custpage_email', type: serverWidget.FieldType.TEXT, label: 'Email'});
                emailFld.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.DISABLED
                });
                emailFld.updateBreakType({
                    breakType : serverWidget.FieldBreakType.STARTROW
                });
                var subjectFld = form.addField({ id: 'custpage_subject', type: serverWidget.FieldType.TEXTAREA, label: 'Subject'});
                subjectFld.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.DISABLED
                });
                // subjectFld.updateBreakType({
                //     breakType : serverWidget.FieldBreakType.STARTROW
                // });
                var urgentFld = form.addField({ id: 'custpage_urgent', type: serverWidget.FieldType.CHECKBOX, label: 'Urgent', container : 'custpage_secondary'});
                urgentFld.updateBreakType({
                    breakType : serverWidget.FieldBreakType.STARTROW
                });
                
                if (rfqType == '3') {
                    var ccFld = form.addField({ id: 'custpage_ccteam', type: serverWidget.FieldType.CHECKBOX, label: 'CC Purchasing', container : 'custpage_secondary'});
                    ccFld.updateBreakType({
                        breakType : serverWidget.FieldBreakType.STARTROW
                    });
                    var ccEmailFld = form.addField({ id: 'custpage_ccemail', type: serverWidget.FieldType.TEXT, label: 'CC Email', container : 'custpage_secondary'});
                    ccEmailFld.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                    ccEmailFld.updateBreakType({
                        breakType : serverWidget.FieldBreakType.STARTROW
                    });
                    ccEmailFld.defaultValue = 'purchasing@automation-x.com';
                } else {
                    var ccFld = form.addField({ id: 'custpage_ccteam', type: serverWidget.FieldType.CHECKBOX, label: 'CC Sourcing', container : 'custpage_secondary'});
                    ccFld.updateBreakType({
                        breakType : serverWidget.FieldBreakType.STARTROW
                    });
                    var ccEmailFld = form.addField({ id: 'custpage_ccemail', type: serverWidget.FieldType.TEXT, label: 'CC Email', container : 'custpage_secondary'});
                    ccEmailFld.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                    ccEmailFld.updateBreakType({
                        breakType : serverWidget.FieldBreakType.STARTROW
                    });
                    ccEmailFld.defaultValue = 'sourcing@automation-x.com';
                }
                
                var tranFld = form.addField({ id: 'custpage_tranid', type: serverWidget.FieldType.SELECT, label: 'Related Transaction', source: 'transaction' , container : 'custpage_secondary'});
                tranFld.updateBreakType({
                    breakType : serverWidget.FieldBreakType.STARTROW
                });
                var itemFld = form.addField({ id: 'custpage_itemid', type: serverWidget.FieldType.SELECT, label: 'Item', source: 'item' , container : 'custpage_secondary'});
                itemFld.updateBreakType({
                    breakType : serverWidget.FieldBreakType.STARTROW
                });
                var fiveCodeFld = form.addField({ id: 'custpage_fivecode', type: serverWidget.FieldType.TEXT, label: '5 Code' , container : 'custpage_secondary'});
                fiveCodeFld.updateBreakType({
                    breakType : serverWidget.FieldBreakType.STARTROW
                });
                var qtyFld = form.addField({ id: 'custpage_qty', type: serverWidget.FieldType.INTEGER, label: 'Quantity' , container : 'custpage_secondary'});
                qtyFld.updateBreakType({
                    breakType : serverWidget.FieldBreakType.STARTROW
                });
                var vendorFld = form.addField({ id: 'custpage_vendor', type: serverWidget.FieldType.SELECT, label: 'Vendor', source: 'vendor' , container : 'custpage_secondary'});
                vendorFld.updateBreakType({
                    breakType : serverWidget.FieldBreakType.STARTROW
                });
                var customerFld = form.addField({ id: 'custpage_cust', type: serverWidget.FieldType.SELECT, label: 'Customer', source: 'customer' , container : 'custpage_secondary'});
                customerFld.updateBreakType({
                    breakType : serverWidget.FieldBreakType.STARTROW
                });
                var dueDateFld = form.addField({ id: 'custpage_due', type: serverWidget.FieldType.DATE, label: 'Deadline' , container : 'custpage_secondary'});
                dueDateFld.updateBreakType({
                    breakType : serverWidget.FieldBreakType.STARTROW
                });
                var notesFld = form.addField({ id: 'custpage_notes', type: serverWidget.FieldType.RICHTEXT, label: 'Additional Notes' , container : 'custpage_secondary'});
                notesFld.updateBreakType({
                    breakType : serverWidget.FieldBreakType.STARTROW
                });
                var attachmentFld = form.addField({ id: 'custpage_attach', type: serverWidget.FieldType.FILE, label: 'Email Attachment'});
                // attachmentFld.updateBreakType({
                //     breakType : serverWidget.FieldBreakType.STARTROW
                // });
                var emailBodyFld = form.addField({ id: 'custpage_emailbody', type: serverWidget.FieldType.RICHTEXT, label: 'Email Body'});
                emailBodyFld.updateBreakType({
                    breakType : serverWidget.FieldBreakType.STARTROW
                });
                emailBodyFld.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.INLINE
                });
                if (rfqType == '1') {
                    //RFQ
                    emailFld.defaultValue = 'rfq@automation-x.com';
                    subjectFld.defaultValue = 'RFQ | [5 Code] | [Tran #]';
                    if (tranId == -1 && itemId == -1) {
                        emailBodyFld.defaultValue = 'Hello,<br><br>I would like to submit a RFQ for [5 Code] on [Tran #] . Details below. Please reach out with any questions.<br><br>5 Code: [5 Code]<br>Quantity: [QTY]<br>Vendor: [VND]<br>Customer: [CST]<br>Deadline: [DUE]<br><br>Thanks,<br>'+finalName;
                    }
                    fiveCodeFld.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                    tranFld.isMandatory = true;
                    itemFld.isMandatory = true;
                    qtyFld.isMandatory = true;
                    vendorFld.isMandatory = true;
                    customerFld.isMandatory = true;
                    dueDateFld.isMandatory = true;
                } else if (rfqType == '2') {
                    //PO Update
                    emailFld.defaultValue = 'purchasing@automation-x.com';
                    subjectFld.defaultValue = 'PO Update | [PO #]';
                    emailBodyFld.defaultValue = 'Hello,<br><br>I am requesting an update on [PO #] to provide my customer(s).<br><br>Thanks,<br>'+finalName;
                    fiveCodeFld.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                    itemFld.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                    qtyFld.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                    vendorFld.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                    customerFld.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                    dueDateFld.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                    tranFld.isMandatory = true;
                } else {
                    //Inactive/Direct Code
                    emailFld.defaultValue = 'sourcing@automation-x.com';
                    subjectFld.defaultValue = 'Inactive/Direct 5 Code Inquiry | [5 Code]';
                    emailBodyFld.defaultValue = 'Hello,<br><br>Please reactivate [5 Code] or provide an alternative that I can use.<br><br>Thanks,<br>'+finalName;
                    tranFld.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                    itemFld.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                    qtyFld.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                    vendorFld.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                    customerFld.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                    dueDateFld.updateDisplayType({
                        displayType : serverWidget.FieldDisplayType.HIDDEN
                    });
                    fiveCodeFld.isMandatory = true;
                }
    
                form.addSubmitButton({
                    label: 'Send Email'
                });
            }
            
            form.clientScriptModulePath = './AX RFQ Email SU Client.js';
            return form;
        };
        var postHandler = function (context) {
            var rfqType = context.request.parameters.custpage_rfqtype;
            log.debug({
                title: 'post rfqType',
                details: rfqType
            });
            var tranId = context.request.parameters.custpage_tranid;
            log.debug({
                title: 'post tranId',
                details: tranId
            });
            var userId = runtime.getCurrentUser().id;
            log.debug({
                title: 'post userId',
                details: userId
            });
            var emailTo = context.request.parameters.custpage_email;
            log.debug({
                title: 'post emailTo',
                details: emailTo
            });
            var subject = context.request.parameters.custpage_subject;
            log.debug({
                title: 'post subject',
                details: subject
            });
            var emailBody = context.request.parameters.custpage_emailbody;
            log.debug({
                title: 'post emailBody',
                details: emailBody
            });
            var ccCheck = context.request.parameters.custpage_ccteam;
            log.debug({
                title: 'post ccCheck',
                details: ccCheck
            });
            var ccEmail = context.request.parameters.custpage_ccemail;
            log.debug({
                title: 'post ccEmail',
                details: ccEmail
            });
            var ccEmails = [];
            if (ccCheck) {
                ccEmails.push(ccEmail);
            }
            log.debug({
                title: 'post ccEmails',
                details: JSON.stringify(ccEmails)
            });
            var attachment = context.request.files['custpage_attach'];
            log.debug({
                title: 'post attachment',
                details: attachment
            });
            if (attachment) {
                var file1 = context.request.files['custpage_attach'];
                var attachments = [file1];
            } else {
                var attachments = [];
            }
            
            // emailTo = 'andrew.bassett@automation-x.com';
            // var ccEmails = [];

            if (tranId != '') {
                email.send({
                    author: userId,
                    recipients: emailTo,
                    subject: subject,
                    body: emailBody,
                    relatedRecords: {
                        transactionId: tranId
                    },
                    cc: ccEmails,
                    attachments: attachments
                });
            } else {
                email.send({
                    author: userId,
                    recipients: emailTo,
                    subject: subject,
                    body: emailBody,
                    cc: ccEmails,
                    attachments: attachments
                });
            }
            log.debug({
                title: 'post',
                details: 'Inquiry Email Sent'
            });
            // Reload the current page.
            context.response.sendRedirect({
                type: https.RedirectType.SUITELET,
                identifier: runtime.getCurrentScript().id,
                id: runtime.getCurrentScript().deploymentId
            });
            return null;
        };
    });
