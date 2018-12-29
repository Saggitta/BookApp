// Book Class

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//  UI Class
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(book => UI.addBookToLIst(book));
  }
  static addBookToLIst(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href='#' class ='btn btn-danger btn-sm delete'>x</a></td>`;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    //REMOVE ALERT

    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

// Store Class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Events Display Book

document.addEventListener("DOMContentLoaded", UI.displayBooks);

//  Event Add a Book

document.querySelector("#book-form").addEventListener("submit", e => {
  //prevent submit
  e.preventDefault();

  //get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // VALIDATION

  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    //Instantiate book
    const book = new Book(title, author, isbn);

    // ad book to UI
    UI.addBookToLIst(book);

    //add book to the storage
    Store.addBook(book);

    //SUCCESS ALERT
    UI.showAlert("Book Added", "success");

    //CLEAR FIELDS
    UI.clearFields();
  }
});

//  Event Remove a Book
document.querySelector("#book-list").addEventListener("click", e => {
  //remove from UI
  UI.deleteBook(e.target);

  //remove book from stirage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //suc alert
  UI.showAlert("Book Removed", "success");
});
