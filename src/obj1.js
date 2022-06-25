
const {eventEmitter} = require('./constants')

class obj1{
    constructor(){
        console.log('Constructor started obj1');
        this.testFn();
    }

    testFn(){
        console.log('Test fn in constructor working obj1');
    }
}


class obj2{
    constructor(){
        console.log('Constructor started obj2');
        this.testFn();
    }

    testFn(){
        console.log('Obj2: Emit testing');
        this.emit();
    }

    emit(params) {
        eventEmitter.emit('module_from_class_emit'); 
    }


}


module.exports = {obj1: obj1, obj2: obj2}


