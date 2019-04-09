import React, { Component } from 'react'
import Header from './components/ui/Header/Header'
import * as apiModule from './utils/api.js'

//-----------------------------------------------------------------------------
const BookList = (props) => (
  <div>
    {props.books.map(book =>
      <li className="list-item list-group-item d-flex align-items-center" key={book.id}>
        <Book {...book} />
      </li>)}
  </div>
);

//-----------------------------------------------------------------------------
class Book extends Component {
  render() {
    const book = this.props;
    return (
      <>
        <strong className="title">{book.title}</strong>
        <div className="author">{book.author}</div>
      </>
    );
  }
}

//-----------------------------------------------------------------------------
class Form extends Component {

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
        this.props.onSubmit(resp.id, title, author); // Callback to APP to tell it to update the book list
        this.setState({ title: '', author: '' }); // Clear input fields        
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
            aria-describedby="title"
            placeholder="Lägg till titel"
            value={this.state.title}
            onChange={event => this.setState({ title: event.target.value })}
            required
          />

          <input
            type="text"
            className="form-control"
            id="author"
            rows="3"
            data-gramm="true"
            data-txt_gramm_id="63b74fb6-c7e4-7f0e-0c1f-438d47ac87a0"
            data-gramm_id="63b74fb6-c7e4-7f0e-0c1f-438d47ac87a0"
            data-gramm_editor="true"
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
  };

  addNewBook = (id, title, author) => {
    console.log('App: New book added');
    this.setState(prevState => ({
      books: [...prevState.books, { id, title, author }] // Like concat
    }))
  }

  fetchBooks() {
    apiModule.fetchBooks().then(resp => {
      console.log('Response: ', resp);
      console.log('ID: ', resp.id);
      console.log('Data: ', resp.data);
      if (resp.status === 'success') {
        console.log('fetchBooks() success!');
        this.setState(() => ({
          books: resp.data
        }))
      } else {
        window.alert('Fel! Kunde inte hämta böcker. Meddelande: ' + resp.message);
      }
    });
  }

  componentDidMount() {
    this.fetchBooks();
  }

  handleUpdateListClick = () => {
    this.fetchBooks();
  };

  render() {
    return (
      <div className="App">
        <Header />
        <div className="container">
          <div className="row form-section">
            <Form onSubmit={this.addNewBook} />
          </div>
        </div>
        <div className="display-books">
          <div className="container">
            <div className="col-12">
              <ul className="list-group">
                <li className="list-item list-group-item d-flex align-items-center">
                  <strong className="title">Titel</strong>
                  <div className="author">Författare</div>
                  <div className="buttons">
                    <button type="button" className="btn btn-success" onClick={this.handleUpdateListClick}>
                      Uppdatera lista
                    </button>
                  </div>
                </li>
                <BookList books={this.state.books} />
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
