import React, { Component } from 'react'
import * as apiModule from '../utils/api.js'

class AddForm extends Component {

  state = { title: '', author: '' };

  handleSubmit = (event) => {
    event.preventDefault(); // Prevent the normal HTML submit from taking place
    let title = this.state.title;
    let author = this.state.author;
    console.log('Add book: Title: ' + title + ' Author: ' + author);

    apiModule.addBook(title, author).then(resp => {
      console.log('Add book response: ', resp);
      if (resp.status === 'success') {
        this.props.addBookToList(resp.id, title, author); // Callback to trigger update of book list
        this.setState({ title: '', author: '' }); // Clear input fields        
        this.props.setInfoMessage('Boken har lagts till! Det krävdes ' + resp.tryCount + ' försök.');
      } else {
        this.props.setInfoMessage('Fel! Kunde inte lägga till bok. Meddelande: ' + resp.message, true);
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

export default AddForm