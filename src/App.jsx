import React, { useState, useEffect } from 'react';
import axios from 'axios';


const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', image_url: ''});
  const [editBook, setEditBook] = useState(null);
  const uri = 'https://jubilant-fishstick-v64v5j7x6v4fwvvj-5001.app.github.dev/'

  const username = 'admin'; // ใช้ชื่อผู้ใช้ที่คุณตั้งใน Backend
  const password = 'password112'; // ใช้รหัสผ่านที่คุณตั้งใน Backend
  const encodedCredentials = btoa(`${username}:${password}`); 

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${uri}/books`,{
        headers: {
          'Authorization': `Basic ${encodedCredentials}` // ใส่ค่า Authorization Header
        }
      });
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };
//keyworld routing

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (editBook) {
      setEditBook({ ...editBook, [name]: value });
    } else {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  const handleCreateBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.image_url) {
      console.error('Please provide all required fields');
      return;
    }

    try {
      const response = await axios.post(`${uri}/books`, newBook,{
        headers: {
          'Authorization': `Basic ${encodedCredentials}` // ใส่ค่า Authorization Header
        }
      });
      setBooks([...books, response.data]);
      setNewBook({ title: '', author: '', image_url: '' }); // Clear the form
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleEditBook = (book) => {
    setEditBook({ ...book });
  };

  const handleUpdateBook = async () => {
    if (!editBook.title || !editBook.author || !editBook.image_url) {
      console.error('Please provide all required fields');
      return;
    }

    try {
      const response = await axios.put(`${uri}/books/${encodeURIComponent(editBook.title)}`, editBook,{
        headers: {
          'Authorization': `Basic ${encodedCredentials}` // ใส่ค่า Authorization Header
        }
      });
      const updatedBooks = books.map((book) =>
        book.title === editBook.title ? response.data : book
      );
      setBooks(updatedBooks);
      setEditBook({ title: '', author: '', image_url: '' }); // Clear edit form
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDeleteBook = async (bookTitle) => {
    if (!bookTitle) {
      console.error('Book title is undefined');
      return;
    }
  
    try {
      await axios.delete(`${uri}/books/${encodeURIComponent(bookTitle)}`,{
        headers: {
          'Authorization': `Basic ${encodedCredentials}` // ใส่ค่า Authorization Header
        }
      });
      const filteredBooks = books.filter((book) => book.title !== bookTitle);
      setBooks(filteredBooks);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div>
      <h1>Book List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>
              {editBook && editBook.title === book.title ? (
                <input
                  type="text"
                  name="image_url"
                  value={editBook.image_url}
                  onChange={handleInputChange}
                />
                ) : (
                  <img src={book.image_url} alt={book.title} width="50" /> 
                )}
              </td>
              <td>
                {editBook && editBook.title === book.title ? (
                  <input
                    type="text"
                    name="title"
                    value={editBook.title}
                    onChange={handleInputChange}
                  />
                ) : (
                  book.title
                )}
              </td>
              <td>
                {editBook && editBook.title === book.title ? (
                  <input
                    type="text"
                    name="author"
                    value={editBook.author}
                    onChange={handleInputChange}
                  />
                ) : (
                  book.author
                )}
              </td>
              <td>
                {editBook && editBook.title === book.title ? (
                  <button onClick={handleUpdateBook}>Update</button>
                ) : (
                  <button onClick={() => handleEditBook(book)}>Edit</button>
                )}
                <button onClick={() => handleDeleteBook(book.title)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Book</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={newBook.title}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="author"
        placeholder="Author"
        value={newBook.author}
        onChange={handleInputChange}
      />
      <input  
        type="text"
        name="image_url"
        placeholder="Image URL"
        value={newBook.image_url}
        onChange={handleInputChange}
      />
      <button onClick={handleCreateBook}>Create</button>
    </div>
  );
};

export default App;