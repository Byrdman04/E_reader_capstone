import Book from './Book'

class Collection {
    //instace var
    collectionArray;

    //constructor
    constructor(){
        this.collectionArray = new Array();
    }

    //getter
    getCollection(){
        return this.collectionArray;
    }

    addBook(book){
        this.collectionArray.push(book);
    }

    deleteBook(book){

    }

    checkForBook(book){
        return this.collectionArray.includes(book);
    }

}

testCol = new Collection;
testCol.collectionArray