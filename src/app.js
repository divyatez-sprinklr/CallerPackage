const JsSIP = require("JsSIP");
var {obj1,obj2} = require('./obj1');
var {fn,fn2} = require('./fn');
const {eventEmitter} = require('./constants')
// const EventEmitter = require('events');
// const eventEmitter = new EventEmitter();



///Class testing//
console.log('-----------Module Class----------------');
eventEmitter.on('module_from_class_emit', () => {
    console.log('This is reply to emit sent from class');
});
let a = new obj1();
console.log('');
let b = new obj2();
console.log('------------------------------------------');
console.log('------------------------------------------');
console.log('');
////



///module function
eventEmitter.on('module_function_emit', () => {
    console.log('This is reply to emit that was declared in other module and listener in other');
});
console.log('-----------Module Function----------------');
fn();
fn2();
console.log('------------------------------------------');
console.log('------------------------------------------');
console.log('');
////



// local emit and listener
console.log('-----------Local emit testing----------------');
eventEmitter.on('local_emit', () => {
    console.log('reply to local emit');
});
function f3(){
    eventEmitter.emit('local_emit');
}
f3();
console.log('------------------------------------------');
console.log('------------------------------------------');
console.log('');
////

