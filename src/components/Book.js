import React, { Component } from 'react'

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

export default Book