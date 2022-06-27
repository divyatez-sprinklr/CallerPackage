
const {eventEmitter} = require('./constants')

class obj1{
    attri =0;
    obj22;
    constructor(a1){
        this.attri = a1; 
        console.log('Constructor started obj1');
        this.testFn();
        this.obj22 = new obj2(this.attri);
    }
    testFn(){
        console.log('Test fn in constructor working obj1');
    }

    ppfa(){
        console.log("Parent func attri:"+this.attri);
    }
    upa(p){
        this.attri = p;
        console.log("Parent func attri:"+this.attri);
    }
}


class obj2{
    attri=2;
    constructor(a2){
        console.log('Constructor started obj2');
        this.testFn();
        this.attri = a2;
    }

    testFn(){
        console.log('Obj2: Emit testing');
        this.emit();
    }

    emit(params) {
        eventEmitter.emit('module_from_class_emit'); 
    }

    pcfa(){
        console.log("child func attri:"+this.attri);
    }

    ucfa(p){
        this.attri = p;
        console.log("child func attri:"+this.attri);
    }

}


module.exports = {obj1: obj1, obj2: obj2}


