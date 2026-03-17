import Book from './Book'
/*
Changes Log:
--March 17, 2026--
1. Finished deleteBook method.
2. Changed checkForBook method to use the some function instead of includes,
    because some gives me more control with the callback function. 
4. Finished findBook method.
*/
class Collection {
    //instace var
    collectionArray;

    //constructor
    constructor(){
        this.collectionArray = [];
    }

    getCollection(){               
        return this.collectionArray;
    }

    addBook(book){
        this.collectionArray.push(book);
    }

    /*
    Filter Function Notes
    Syntax: array.filter(function(currentValue, index, array), thisValue);
    Returns a Array.

    Examples included at bottem of page.

    What this does is check all elements in the arrays id and returns
    an array with all the books except the one we were looking for. 
    */
    deleteBook(bookId){
        this.collectionArray = this.collectionArray.filter(book => book.id !== bookId);
    }

    /*
        Similar to the filter function, this will go through the array
        checking if the IDs are equal and will either 
        return true or false. 
    */
    checkForBook(book){
        return this.collectionArray.some(bok => bok.id === book.id);
    }

    /*
        Same as the rest but the find function will
        return the book object. 
    */ 
    getBook(findTitle){
        return this.collectionArray.find(book => book.title === findTitle);
    }

}

export default Collection;

/*
Filter Exapmples: 
const numbers = [12, 5, 8, 130, 44];
const bigEnough = numbers.filter(value => value >= 10);
// Output: [12, 130, 44]

const fruits = ["apple", "banana", "grapes", "mango", "orange"];
const filteredFruits = fruits.filter(fruit => fruit.includes("ap"));
// Output: ["apple", "grapes"]

const users = [
  { name: "Alice", active: true },
  { name: "Bob", active: false },
  { name: "Carol", active: true }
];
const activeUsers = users.filter(user => user.active);
// Output: [{ name: "Alice", active: true }, { name: "Carol", active: true }]

const values = [10, null, 20, undefined, 30];
const filteredValues = values.filter(Boolean); // Boolean function checks for truthy values
// Output: [10, 20, 30]

*/