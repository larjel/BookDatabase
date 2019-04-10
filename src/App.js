import React, { Component } from 'react'
import Header from './components/ui/Header/Header'
import * as apiModule from './utils/api.js'

//-----------------------------------------------------------------------------
const BookList = (props) => (
  <div>
    {props.books.map(book =>
      <Book {...props} key={book.id} {...book} />)}
  </div>
);

//-----------------------------------------------------------------------------
class Book extends Component {

  handleRemoveBookClick = () => {
    const book = this.props;
    book.removeBook(book.id);
  };

  enableEditingClick = () => {
    const book = this.props;
    book.setEditing(true, book);
  };

  render() {
    const book = this.props;
    return (
      <li className="list-item list-group-item d-flex align-items-center">
        <strong className="title">{book.title}</strong>
        <div className="author">{book.author}</div>
        <div className="buttons">
          <button type="button" className="btn btn-success" onClick={this.enableEditingClick}>
            Editera
          </button>
          <button type="button" className="btn btn-danger" onClick={this.handleRemoveBookClick}>
            Ta bort
          </button>
        </div>
      </li>
    );
  }
}

//-----------------------------------------------------------------------------
class EditForm extends Component {

  state = {
    title: this.props.book.title,
    author: this.props.book.author,
    id: this.props.book.id
  };

  handleSubmit = (event) => {
    event.preventDefault(); // Prevent the normal HTML submit from taking place
    let title = this.state.title;
    let author = this.state.author;
    let id = this.state.id;
    console.log('Title: ' + title + ' Author: ' + author + ' ID: ' + id);

    apiModule.updateBook(id, title, author).then(resp => {
      console.log('Status: ', resp.status);
      if (resp.status === 'success') {
        //this.props.addBookToList(resp.id, title, author); // Callback to APP to tell it to update the book list
        //this.setState({ title: '', author: '' }); // Clear input fields        
        this.props.setEditing(false, {}); // Cancel editing mode
        window.alert('Boken har uppdaterats! Det krävdes ' + resp.tryCount + ' försök.');
      } else {
        window.alert('Fel! Kunde inte uppdatera bok. Meddelande: ' + resp.message);
      }
    });
  };

  handleAbort = () => {
    this.props.setEditing(false, {});
  };

  render() {
    return (
      <form className="book-form col-6" onSubmit={this.handleSubmit}>
        <legend>Uppdatera information om boken</legend>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Ny titel"
            value={this.state.title}
            onChange={event => this.setState({ title: event.target.value })}
            required
          />

          <input
            type="text"
            className="form-control"
            id="author"
            placeholder="Ny författare"
            value={this.state.author}
            onChange={event => this.setState({ author: event.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">
          Uppdatera
          </button>
        <button type="button" className="btn btn-danger btn-update-abort" onClick={this.handleAbort}>
          Avbryt
          </button>
      </form>
    );
  }
}

//-----------------------------------------------------------------------------
class AddForm extends Component {

  state = { title: '', author: '' };

  handleSubmit = (event) => {
    event.preventDefault(); // Prevent the normal HTML submit from taking place
    let title = this.state.title;
    let author = this.state.author;
    console.log('Title: ' + title + ' Author: ' + author);

    apiModule.addBook(title, author).then(resp => {
      console.log('Response: ', resp);
      console.log('ID: ', resp.id);
      console.log('Status: ', resp.status);
      if (resp.status === 'success') {
        this.props.addBookToList(resp.id, title, author); // Callback to APP to tell it to update the book list
        this.setState({ title: '', author: '' }); // Clear input fields        
        window.alert('Boken har lagts till! Det krävdes ' + resp.tryCount + ' försök.');
      } else {
        window.alert('Fel! Kunde inte lägga till bok. Meddelande: ' + resp.message);
      }
    });
  };

  render() {
    return (
      <form className="book-form col-6" onSubmit={this.handleSubmit}>
        <legend>Lägg till dina favoritböcker</legend>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Lägg till titel"
            value={this.state.title}
            onChange={event => this.setState({ title: event.target.value })}
            required
          />

          <input
            type="text"
            className="form-control"
            id="author"
            placeholder="Lägg till författare"
            value={this.state.author}
            onChange={event => this.setState({ author: event.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-lg btn-block">
          Skicka
        </button>
      </form>
    );
  }
}

//-----------------------------------------------------------------------------
class App extends Component {

  state = {
    books: [],
    editing: false,
    bookToEdit: {},
  };

  // Add new book to the visible list without having to fetch the whole list again
  addBookToList = (id, title, author) => {
    console.log('App: New book added');
    this.setState(prevState => ({
      books: [...prevState.books, { id, title, author }] // Like concat
    }))
  }

  removeBook = (bookId) => {
    apiModule.removeBook(bookId).then(resp => {
      if (resp.status === 'success') {
        console.log('Remove book success!');
        this.fetchBooks(false);
        window.alert('Boken har tagits bort! Det krävdes ' + resp.tryCount + ' försök.');
      } else {
        window.alert('Fel! Kunde inte ta bort boken. Meddelande: ' + resp.message);
      }
    });
  };

  setEditing = (active, book) => {
    this.setState(() => ({
      bookToEdit: book,
      editing: active
    }))
  };

  // Fetch book list from Rest API
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

  // After all the elements of the page is rendered correctly, this method is called.
  componentDidMount() {
    this.fetchBooks(false);
  }

  handleUpdateListClick = () => {
    this.fetchBooks(true);
  };

  render() {
    return (
      <div className="App">
        <Header />
        <div className="container">
          <div className="row form-section">
            {this.state.editing ? (
              <EditForm addBookToList={this.addBookToList} setEditing={this.setEditing} book={this.state.bookToEdit} />
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
