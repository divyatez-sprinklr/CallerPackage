
const {eventEmitter} = require('./constants')

module.exports = {fn: fn, fn2:fn2};

function fn(){
    console.log('fn working');
}

function fn2(){
    console.log('fn2 : emit testing');
    eventEmitter.emit('module_function_emit');
}