/*
In NativeScript, the app.js file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/
const traceModule = require("tns-core-modules/trace");
traceModule.Trace.addCategories(
    // trace.categories.Layout, // add these two for detailed
    traceModule.Trace.categories.ViewHierarchy, // add these two for detailed
    //traceModule.Trace.categories.NativeLifecycle, // these two are for brief
    traceModule.Trace.categories.Navigation // these two are for brief
);
//traceModule.Trace.setCategories(traceModule.Trace.categories.All); // this option is extremely detailed
const { setupTimestampConsoleWriter } = require("~/traceWriter");
setupTimestampConsoleWriter();
//traceModule.Trace.enable()

/*const statusBar = require("nativescript-status-bar");
setInterval(() => {
    statusBar.hide()
}, 10000);*/

const { openWebsocketConnection } = require("./websocket");
openWebsocketConnection()

const { Application } = require("@nativescript/core");
Application.run({ moduleName: "app-root" });
//app-root
/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
