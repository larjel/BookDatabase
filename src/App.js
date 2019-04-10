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
class App extends Component {

  state = {
    books: [], // The list of books. Will be populated via the Rest API.
    editing: false, // Is book editing mode enabled?
    bookToEdit: {}, // Holds book to edit (if editing mode enabled).
  };

  /**
   * Add new book to the visible list without having to fetch the whole list again.
   * @param {number} id The ID of the book to add.
   * @param {string} title The title of the book to add.
   * @param {string} author The author of the book to add.
   */
  addBookToList = (id, title, author) => {
    console.log('App: New book added');
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
      bookListCopy.forEach(el => {
        if (el.id === id) {
          el.title = title;
          el.author = author;
        }
      });
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
        console.log('Remove book success!');
        this.removeBookFromList(bookId);
        window.alert('Boken har tagits bort! Det krävdes ' + resp.tryCount + ' försök.');
      } else {
        window.alert('Fel! Kunde inte ta bort boken. Meddelande: ' + resp.message);
      }
    });
  };

  /**
   * Fetch list of books from the database via the Rest API.
   * @param {boolean} showAlerts If to display popup alert when list is updated.
   */
  fetchBooks(showAlerts) {
    apiModule.fetchBooks().then(resp => {
      console.log('Response: ', resp);
      console.log('ID: ', resp.id);
      console.log('Data: ', resp.data);
      if (resp.status === 'success') {
        console.log('fetchBooks() success!');
        this.setState(() => ({
          books: resp.data
        }))
        if (showAlerts) {
          window.alert('Boklistan har uppdaterats! Det krävdes ' + resp.tryCount + ' försök.');
        }
      } else if (showAlerts) {
        window.alert('Fel! Kunde inte uppdatera boklistan. Meddelande: ' + resp.message);
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
   * After all the elements of the page is rendered correctly, this method is called to fetch the list of books.
   */
  componentDidMount() {
    this.fetchBooks(false);
  }

  handleUpdateListClick = () => {
    this.fetchBooks(true);
  }

  render() {
    return (
      <div className="App">
        <Header />
        <div className="container">
          <div className="row form-section">
            {this.state.editing ? (
              <EditForm addBookToList={this.addBookToList} setEditing={this.setEditing} book={this.state.bookToEdit} updateBookInList={this.updateBookInList} />
            ) : (
                <AddForm addBookToList={this.addBookToList} />
              )}
          </div>
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
