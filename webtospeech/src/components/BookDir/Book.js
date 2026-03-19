class Book {
/*
Basic book class:
    -Attributes
    -Consructor
    -Add Genre method(Allows books to have multiple genres)

    NOTES: 
    1. Didn't know that JS made the getters and setter for you, so I got 
    rid of the ones I made before. 
*/

//Attributes
    id = null
    title = ""
    author = ""
    genre = ""
    fileType = ""
    uploadDate = ""
    path = ""

    //constructor
    constructor(id, title, author, genre, fileType, uploadDate, path) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.fileType = fileType;
        this.uploadDate = uploadDate;
        this.path = path;
    }

    
    //AddGenre method 
    //this will add a genere to the book.
    addGenre(genre){
        this.genre=this.genre+","+genre 
    }


}

export default Book;