const data_buku = "";
let books = [];
const incomplete_book = "incompleteBookshelfList";
const complete_book = "completeBookshelfList";

//webstorage init
webstorageSupport = () => {
    if (typeof Storage === "undefined") {
        alert("failure!");
        return false;
    } else {
        return true;
    }
};

updateJson = () => {
    if (webstorageSupport()) {
        localStorage.setItem(data_buku, JSON.stringify(books));
    }
};

fetchJson = () => {
    let data = JSON.parse(localStorage.getItem(data_buku));

    if (data !== null) {
        books = data;
    }

    document.dispatchEvent(new Event("fetch"));
};

book_object = (id, title, author, year, isComplete) => {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    };
};

//book initiator
books_identity = () => {
    for (book of books) {
        const newBook = books_create(
            book.id, book.title, book.author, book.year, book.isComplete, );

        if (book.isComplete) {
            document.getElementById(complete_book).append(newBook);
        } else {
            document.getElementById(incomplete_book).append(newBook);
        }
    }
};
//books Filter

booksFilter = (keyword) => {
    const filter = keyword.toUpperCase();
    const judul = document.getElementsByTagName("h3");

    for (let i = 0; i < judul.length; i++) {
        const judulText = judul[i].textContent || judul[i].innerText;

        if (judulText.toUpperCase().indexOf(filter) > -1) {
            judul[i].closest(".book_item").style.display = "";
        } else {
            judul[i].closest(".book_item").style.display = "none";
        }
    }
};

//submit initiator

document.addEventListener("DOMContentLoaded", function () {
    const input_book = document.getElementById("inputBook");
    const search_book = document.getElementById("searchBook");

    input_book.addEventListener("submit", function (event) {
        event.preventDefault();
        books_add();

        document.getElementById("inputBookTitle").value = "";
        document.getElementById("inputBookAuthor").value = "";
        document.getElementById("inputBookYear").value = "";
        document.getElementById("inputBookIsComplete").checked = false;
    });

    search_book.addEventListener("submit", function (event) {
        event.preventDefault();

        const inputSearch = document.getElementById("searchBookTitle").value;
        booksFilter(inputSearch);
    });

    if (webstorageSupport()) {
        fetchJson();
    }
});

document.addEventListener("fetch", function () {
    books_identity();
});

//delete books
books_delete = (bookId) => {
    for (let bookPosition = 0; bookPosition < books.length; bookPosition++) {
        if (books[bookPosition].id == bookId) {
            books.splice(bookPosition, 1);
            break;
        }
    }
};
//add Books
books_add = () => {
    const bookId = +new Date();
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = document.getElementById("inputBookYear").value;
    const inputBookIsComplete = document.getElementById(
        "inputBookIsComplete", ).checked;

    const book = books_create(
        bookId, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete, );
    const bookObject = book_object(
        bookId, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete, );

    books.push(bookObject);

    if (inputBookIsComplete) {
        document.getElementById(complete_book).append(book);
    } else {
        document.getElementById(incomplete_book).append(book);
    }

    updateJson();
};
//create books
books_create = (
    bookId, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete, ) => {
    const book = document.createElement("article");
    book.setAttribute("id", bookId);
    book.classList.add("book_item");

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = inputBookTitle;

    const bookAuthor = document.createElement("span");
    bookAuthor.innerText = inputBookAuthor;

    const bookYear = document.createElement("span");
    bookYear.innerText = inputBookYear;

    const br = document.createElement("br");

    const detail_book = document.createElement("div");
    detail_book.classList.add("box");

    const content_book = document.createElement("div");
    content_book.classList.add("list_content");

    const action_book = booksAddAction(inputBookIsComplete, bookId);

    content_book.append(bookTitle, bookAuthor, br, bookYear);
    detail_book.append(content_book);
    detail_book.append(action_book);
    book.append(detail_book);

    return book;
};
//books action
booksAddAction = (inputBookIsComplete, bookId) => {
    const action_books = document.createElement("div");
    action_books.classList.add("action");

    const actionDelete = booksDeleteAction(bookId);
    const actionRead = booksReadAction(bookId);
    const actionUndo = booksUndoAction(bookId);

    action_books.append(actionDelete);

    if (inputBookIsComplete) {
        action_books.append(actionUndo);
    } else {
        action_books.append(actionRead);
    }

    return action_books;
};
//delete action books
booksDeleteAction = (bookId) => {
    const actionDelete = document.createElement("button");
    actionDelete.classList.add("red");
    actionDelete.innerText = "hapus";
    actionDelete.style.color = "white";

    actionDelete.addEventListener("click", function () {
        let konfirmasi = confirm("Hapus Buku?");

        if (konfirmasi) {
            const book_itemParent = document.getElementById(bookId);
            book_itemParent.addEventListener("eventDelete", function (event) {
                event.target.remove();
            });
            book_itemParent.dispatchEvent(new Event("eventDelete"));

            books_delete(bookId);
            updateJson();
        }
    });

    return actionDelete;
};
//add create element books
booksReadAction = (bookId) => {
    const action = document.createElement("button");
    action.classList.add("white");
    action.innerText = "Selesai Baca";
    action.style.color = "white";

    action.addEventListener("click", function () {
        const book_itemParent = document.getElementById(bookId);

        const bookTitle = book_itemParent.querySelector("h3").innerText;
        const bookAuthor =
            book_itemParent.querySelectorAll("span")[0].innerText;
        const bookYear = book_itemParent.querySelectorAll("span")[1].innerText;

        book_itemParent.remove();

        const book = books_create(bookId, bookTitle, bookAuthor, bookYear, true);
        document.getElementById(complete_book).append(book);

        books_delete(bookId);
        const bookObject = book_object(
            bookId, bookTitle, bookAuthor, bookYear, true, );

        books.push(bookObject);
        updateJson();
    });

    return action;
};
//undo books
booksUndoAction = (bookId) => {
    const action = document.createElement("button");
    action.classList.add("button");
    action.innerText = "Belum Selesai";
    action.style.color = "white	";

    action.addEventListener("click", function () {
        const book_itemParent = document.getElementById(bookId);

        const bookTitle = book_itemParent.querySelector("h3").innerText;
        const bookAuthor =
            book_itemParent.querySelectorAll("span")[0].innerText;
        const bookYear = book_itemParent.querySelectorAll("span")[1].innerText;

        book_itemParent.remove();

        const book = books_create(bookId, bookTitle, bookAuthor, bookYear, false);
        document.getElementById(incomplete_book).append(book);

        books_delete(bookId);
        const bookObject = book_object(
            bookId, bookTitle, bookAuthor, bookYear, false, );

        books.push(bookObject);
        updateJson();
    });

    return action;
};
