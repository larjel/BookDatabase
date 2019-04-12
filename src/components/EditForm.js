import React, { Component } from 'react'
import * as apiModule from '../utils/api.js'

class EditForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: this.props.book.title,
      author: this.props.book.author,
      id: this.props.book.id
    };
  }

  handleSubmit = (event) => {
    event.preventDefault(); // Prevent the normal HTML submit from taking place
    let title = this.state.title;
    let author = this.state.author;
    let id = this.state.id;
    console.log('Update book: Title: ' + title + ' Author: ' + author + ' ID: ' + id);

    apiModule.updateBook(id, title, author).then(resp => {
      if (resp.status === 'success') {
        this.props.updateBookInList(id, title, author); // Callback to trigger update of book list
        this.props.setEditing(false, {}); // Cancel editing mode
        this.props.setInfoMessage('Boken har uppdaterats! Det krävdes ' + resp.tryCount + ' försök.');
      } else {
        this.props.setInfoMessage('Fel! Kunde inte uppdatera bok. Meddelande: ' + resp.message, true);
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

export default EditForm