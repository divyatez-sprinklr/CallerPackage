
class obj1{
    constructor(){
        console.log('Constructor started obj1');
        this.testFn();
    }

    testFn(){
        console.log('Test fn in constructor working obj2');
    }
}


class obj2{
    constructor(){
        console.log('Constructor started obj2');
        this.testFn();
    }

    testFn(){
        console.log('Test fn in constructor working obj2');
    }
}


module.exports = {obj1: obj1, obj2: obj2}


