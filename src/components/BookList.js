import React from 'react'
import Book from './Book'

export default (props) => (
  <div>
    {props.books.map(book =>
      <Book {...props} key={book.id} {...book} />)}
  </div>
)
