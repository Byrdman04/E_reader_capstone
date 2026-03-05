class Book {
/*
Basic book class:
    -Attributes
    -Consructor
    -Getters and Setters
    -Add Genre method(Allows books to have multiple genres)
*/

//Attributes
    Id = null
    Title = ""
    Author = ""
    Genre = ""
    Path = ""

    //constructor
    constructor(id, title, author, genre, path) {
        this.Id = id,
        this.Title = title,
        this.Author = author,
        this.Genre = genre,
        this.Path = path
    }

    //Getters and Setters
    getId() {
        return this.Id
    }
    setID(id){
        this.Id=id
    }

    getTitle(){
        return this.Title
    }
    setTitle(title){
        this.Title=title
    }

    getAuthor(){
        return this.Author
    }
    setAuthor(author){
        this.Author=author
    }

    getGenre(){
        return this.Genre
    }
    setGenre(genre){
        this.Genre=genre
    }

    getPath(){
        return this.Path
    }
    setPath(path){
        this.Path=path
    }

    //AddGenre method 
    //this will add a genere to the book.
    addGenre(genre){
        this.Genre=this.Genre+","+genre 
    }


}

export default Book;