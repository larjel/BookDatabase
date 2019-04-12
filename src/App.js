import React, { Component } from 'react'
import Header from './components/Header'
import Book from './components/Book'
import EditForm from './components/EditForm'
import AddForm from './components/AddForm'
import * as apiModule from './utils/api.js'

//-----------------------------------------------------------------------------
const BookList = (props) => (
  <div>
    {props.books.map(book =>
      <Book {...props} key={book.id} {...book} />)}
  </div>
);

//-----------------------------------------------------------------------------
const InfoUpdate = (props) => (
  <div className="book-form col-6 info-box">
    {props.text}
  </div>
);

//-----------------------------------------------------------------------------
class App extends Component {

  state = {
    books: [], // The list of books. Will be populated via the Rest API.
    editing: false, // Is book editing mode enabled?
    bookToEdit: {}, // Holds book to edit (if editing mode enabled).
    infoMessage: 'Välkommen till bokdatabasen!', // Message to display in page info box
  };

  /**
   * Add new book to the visible list without having to fetch the whole list again.
   * @param {number} id The ID of the book to add.
   * @param {string} title The title of the book to add.
   * @param {string} author The author of the book to add.
   */
  addBookToList = (id, title, author) => {
    this.setState(prevState => ({
      books: [...prevState.books, { id, title, author }] // Append new book
    }))
  };

  /**
   * Update a book in the visible list without having to fetch the whole list again.
   * @param {number} id The ID of the book to update.
   * @param {string} title The (new) title of the book to update.
   * @param {string} author The (new) author of the book to update.
   */
  updateBookInList = (id, title, author) => {
    this.setState(prevState => {
      let bookListCopy = [...prevState.books];
      let idx = bookListCopy.findIndex(el => el.id === id);
      if (idx >= 0) {
        bookListCopy[idx].title = title;
        bookListCopy[idx].author = author;
      }
      return { books: bookListCopy }
    })
  };

  /**
   * Remove a book from the visible list without having to fetch the whole list again.
   * @param {number} id The ID of the book to remove.
   */
  removeBookFromList(id) {
    this.setState(prevState => ({
      books: prevState.books.filter(el => el.id !== id)
    }));
  }

  /**
   * Remove a book from the database via the Rest API.
   * @param {number} bookId The ID of the book to remove.
   */
  removeBook = (bookId) => {
    apiModule.removeBook(bookId).then(resp => {
      if (resp.status === 'success') {
        this.removeBookFromList(bookId);
        this.setInfoMessage('Boken har tagits bort! Det krävdes ' + resp.tryCount + ' försök.');
      } else {
        this.setInfoMessage('Fel! Kunde inte ta bort boken. Meddelande: ' + resp.message, true);
      }
    });
  };

  /**
   * Fetch list of books from the database via the Rest API.
   */
  fetchBooks() {
    apiModule.fetchBooks().then(resp => {
      console.log('fetchBooks() response: ', resp);
      if (resp.status === 'success') {
        this.setState({
          books: resp.data
        });
        this.setInfoMessage('Boklistan har uppdaterats! Det krävdes ' + resp.tryCount + ' försök.');
      } else {
        this.setInfoMessage('Fel! Kunde inte uppdatera boklistan. Meddelande: ' + resp.message, true);
      }
    });
  }

  /**
   * Activate or deactivate the book editing form.
   * @param {boolean} active If true, editing mode is activated. If false, it is deactivated.
   * @param {Book} book The book to edit (if editing mode is activated).
   */
  setEditing = (active, book) => {
    this.setState(() => ({
      bookToEdit: book,
      editing: active
    }))
  };

  /**
   * Set the message to display in the information box. On error, a popup alert will also be displayed.
   * @param {string} message Message to display.
   * @param {boolean} isError Set to true to indicate that it is an error message. Default false.
   */
  setInfoMessage = (message, isError = false) => {
    this.setState({
      infoMessage: message,
    });
    if (isError) {
      window.alert(message);
    }
  };

  /**
   * After all the elements of the page is rendered correctly, this method is called to fetch the list of books.
   */
  componentDidMount() {
    this.fetchBooks();
  }

  handleUpdateListClick = () => {
    this.fetchBooks();
  }

  handleClearApiKeyClick = () => {
    if (window.confirm('Varning! Om du fortsätter kommer den gamla databasen inte längre vara tillgänglig.')) {
      apiModule.clearApiKey();
      this.setInfoMessage('API-nyckeln har nollställts!');
      this.setState({
        books: []
      });
    } else {
      this.setInfoMessage('Operationen avbröts.');
    }
  }

  render() {
    return (
      <div className="App">
        <Header />
        <div className="container">
          <div className="row form-section">
            {this.state.editing ? (
              <EditForm updateBookInList={this.updateBookInList} setEditing={this.setEditing}
                book={this.state.bookToEdit} setInfoMessage={this.setInfoMessage} />
            ) : (
                <AddForm addBookToList={this.addBookToList} setInfoMessage={this.setInfoMessage} />
              )}
          </div>
          <InfoUpdate text={this.state.infoMessage} />
        </div>
        <div className="display-books">
          <div className="container">
            <ul className="list-group">
              <li className="list-item list-group-item d-flex align-items-center list-heading">
                <strong className="title">Titel</strong>
                <strong className="author">Författare</strong>
                <div className="buttons">
                  <button type="button" className="btn btn-success" onClick={this.handleUpdateListClick}>
                    Uppdatera lista
                  </button>
                  <button type="button" className="btn btn-danger" onClick={this.handleClearApiKeyClick}>
                    Rensa API-nyckel
                  </button>
                </div>
              </li>
              <BookList books={this.state.books} removeBook={this.removeBook} setEditing={this.setEditing} />
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default App
