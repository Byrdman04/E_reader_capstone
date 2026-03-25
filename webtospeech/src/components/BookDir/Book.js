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
    genres = [] //genre is an array to allow for multiple genres
    fileType = ""
    uploadDate = ""
    path = ""

    //constructor
    constructor(id, title, author, genres = [], fileType, uploadDate, path) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.genres = Array.isArray(genres) ? genres : [genres]; // Ensure genre is always an array
        this.fileType = fileType;
        this.uploadDate = uploadDate;
        this.path = path;
    }

    
    //AddGenre method 
    //this will add a genere to the book.
    addGenre(genres){
        if(!this.genres.includes(genres)){
            this.genres.push(genres);
        }
    }

    hasGenre(slug){
        return this.genres.some(g => g.slug === slug);
    }


}

export default Book;