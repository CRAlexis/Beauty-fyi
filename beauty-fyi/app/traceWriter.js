"use strict";
exports.__esModule = true;
var trace = require("tns-core-modules/trace");
var StampedWriter = /** @class */ (function () {
  function StampedWriter() {
  }
  StampedWriter.prototype.write = function (message, category, type) {
    if (!console)
      return;
    var newTime = new Date();
    if (!this.startTime || (newTime.getTime() - this.lastCalledAt.getTime()) > 3000) {
      this.startTime = newTime;
    }
    this.lastCalledAt = newTime;
    var timeDiff = newTime.getTime() - this.startTime.getTime();
    var msgType = type || trace.Trace.messageType.log;
    var traceMessage = "time +" + timeDiff + " " + category + ": " + message;
    switch (msgType) {
      case trace.Trace.messageType.log:
        console.log(traceMessage);
        break;
      case trace.Trace.messageType.info:
        console.info(traceMessage);
        break;
      case trace.Trace.messageType.warn:
        console.warn(traceMessage);
        break;
      case trace.Trace.messageType.error:
        console.error(traceMessage);
        break;
    }
  };
  return StampedWriter;
}());
function setupTimestampConsoleWriter() {
  trace.Trace.clearWriters();
  trace.Trace.addWriter(new StampedWriter);
}
exports.setupTimestampConsoleWriter = setupTimestampConsoleWriter;