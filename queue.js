class Queue{
    constructor(){
        this.data = [];
        this.head = 0;
        this.tail =0;
    }
    push(task){
        this.data[this.tail] = task;
        this.tail++;
    }
    pop(){
        if(this.data.length ==0 )return undefined;
        delete this.data[this.head];
        this.head++;
    }
    front(){
        return this.data[head];
    }
    empty(){
        return this.tail === this.head;
    }
}