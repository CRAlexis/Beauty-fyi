//import {
//    CFAlertDialog,
//    DialogOptions,
//    CFAlertGravity,
//    CFAlertActionAlignment,
//    CFAlertActionStyle,
//    CFAlertStyle
//} from ('nativescript-cfalert-dialog');

const CFAlertDialog = require('nativescript-cfalert-dialog').CFAlertDialog
const CFAlertStyle = require('nativescript-cfalert-dialog').CFAlertStyle
const CFAlertActionStyle = require('nativescript-cfalert-dialog').CFAlertActionStyle
const CFAlertActionAlignment = require('nativescript-cfalert-dialog').CFAlertActionAlignment
let active = false

exports.errorMessage = function(message){
    if(!active){
        active = true;
        let cfalertDialog = new CFAlertDialog();

        let options = {
            // Options go here
            dialogStyle: CFAlertStyle.ALERT,
            title: message,
            onDismiss: function(){
                active = true;
            }
        }
        cfalertDialog.show(options).then(function(){
            active = false;
            resolve()
        }); // That's about it ;)
    }
}

exports.areYouSure = function(message){
    
    return new Promise((resolve, reject) => {
        if (!active) {
            active = true;
            let cfalertDialog = new CFAlertDialog();
            let options = {
                // Options go here
                dialogStyle: CFAlertStyle.ALERT,
                title: message,
                buttons: [{
                        text: "Yes",
                        buttonStyle: CFAlertActionStyle.DEFAULT,
                        buttonAlignment: CFAlertActionAlignment.JUSTIFIED,
                        onClick: function (){
                            active = false;
                            resolve(true)
                            }
                        },
                        {
                        text: "No",
                        buttonStyle: CFAlertActionStyle.DEFAULT,
                        buttonAlignment: CFAlertActionAlignment.JUSTIFIED,
                        onClick: function () {
                            active = false;
                            reject()
                        }
                    },
                ],  
                cancellable: false
            }

            cfalertDialog.show(options).then(function(result){
                active = false;
                resolve(true)
           // }, e => {
           //     active = false
           //     reject()
            }).catch(function(error){
                console.log(error)
            }); // That's about it ;)
        }
    })
}

