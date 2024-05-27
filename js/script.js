const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKS_APPS';

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function findBook(bookID) {
    for (const bookItem of books) {
        if (bookItem.id === bookID) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookID) {
    for (const index in books) {
        if (books[index].id === bookID) {
            return index;
        }
    }
    return -1;
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        windows.alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(book) {
    const { id, title, author, year, isCompleted } = book;

    const textTitle = document.createElement('h2');
    textTitle.innerText = title;
    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Author : ${author}`;
    const textYear = document.createElement('p');
    textYear.innerText = `Released : ${year}`;

    const textContainer = document.createElement('div');
    textContainer.classList.add('book-item');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('item-list')
    container.append(textContainer);
    container.setAttribute('id', `book-${id}`);

    if (isCompleted) {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.textContent = 'Set Unfinish';
        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.textContent = 'Delete';
        trashButton.addEventListener('click', function () {
            if (confirm('Do you really want to delete this book?')) {
                removeBookFromCompleted(id);
            }
        });

        buttonContainer.append(undoButton, trashButton);
        container.append(buttonContainer);
    } else {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        checkButton.textContent = 'Set Finish';
        checkButton.addEventListener('click', function () {
            addBookToCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.textContent = 'Delete';
        trashButton.addEventListener('click', function () {
            if (confirm('Do you really want to delete this book?')) {
                removeBookFromCompleted(id);
            }
        });

        buttonContainer.append(checkButton, trashButton);
        container.append(buttonContainer);
    }

    return container;
}

function addBook() {
    const title = document.getElementById('input-title').value;
    const author = document.getElementById('input-author').value;
    const year = document.getElementById('input-year').value;
    const isCompleted = document.getElementById('input-is-complete').checked;
``
    if (!title || !author || !year) {
        alert('Harap isi semua field');
        return;
    }

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, title, author, year, isCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    document.getElementById('input-title').value = '';
    document.getElementById('input-author').value = '';
    document.getElementById('input-year').value = '';
    document.getElementById('input-is-complete').checked = false;
}

function addBookToCompleted(bookID) {
    const bookTarget = findBook(bookID);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(bookID) {
    const bookTarget = findBookIndex(bookID);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookID) {

    const bookTarget = findBook(bookID);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const incompleteBookshelfList = document.getElementById('unreadedBook');
const completeBookshelfList = document.getElementById('readedBook');

function updateSearchResults(results) {
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    for (const book of results) {
        const bookItem = makeBook(book);
        if (book.isCompleted) {
            completeBookshelfList.appendChild(bookItem);
        } else {
            incompleteBookshelfList.appendChild(bookItem);
        }
    }
}

function updateSearchResults(results) {
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    for (const book of results) {
        const bookItem = makeBook(book);
        if (book.isCompleted) {
            completeBookshelfList.appendChild(bookItem);
        } else {
            incompleteBookshelfList.appendChild(bookItem);
        }
    }
}

function updateSearchResults(query) {
    const filteredBooks = books.filter(book => {
        const title = book.title.toLowerCase();
        const author = book.author.toLowerCase();
        const year = book.year.toString().toLowerCase();

        return title.includes(query) || author.includes(query) || year.includes(query);
    });

    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    for (const book of filteredBooks) {
        const bookItem = makeBook(book);
        if (book.isCompleted) {
            completeBookshelfList.appendChild(bookItem);
        } else {
            incompleteBookshelfList.appendChild(bookItem);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {

    const submitForm = document.getElementById('form-add-book');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
    const unreadedBookList = document.getElementById('unreadedBook');
    const listReaded = document.getElementById('readedBook');

    unreadedBookList.innerHTML = '';
    listReaded.innerHTML = '';

    for (const book of books) {
        const bookItem = makeBook(book);
        if (book.isCompleted) {
            listReaded.appendChild(bookItem);
        } else {
            unreadedBookList.appendChild(bookItem);
        }
    }
});

document.addEventListener('input', function (event) {
    const searchInput = document.getElementById('search-book-title');
    const query = searchInput.value.toLowerCase().trim();

    if (query) {
        updateSearchResults(query);
    } else {
        updateSearchResults(books);
    }
});