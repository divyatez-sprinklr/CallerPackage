const { CallerPackage } = require("../../CallerPackage/client/client.js");

let cp = new CallerPackage();
cp.ping();



cp.eventEmitter.on('DEBUG',()=>{
    console.log('Listened on parent using listener-emit');
})