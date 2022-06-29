var CallerPackage = require("../../CallerPackage/client/client.js").CallerPackage;
var cp = new CallerPackage();
cp.ping();
cp.eventEmitter.on('DEBUG', function () {
    console.log('Listened on parent using listener-emit');
});
console.log('11');
