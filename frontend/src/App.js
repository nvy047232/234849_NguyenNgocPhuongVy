import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/books';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [search, setSearch] = useState('');

  // Form State (Dùng chung cho Thêm và Cập nhật)
  const [formData, setFormData] = useState({
    bookId: '',
    title: '',
    author: '',
    category: '',
    publisher: '',
    publishYear: '',
    isbn: '',
    quantity: 0,
    description: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null); // Chi tiết sách

  // 1. Tải danh sách sách
  const fetchBooks = async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `${API_URL}?search=${encodeURIComponent(query)}` : API_URL;
      const res = await axios.get(url);
      setBooks(res.data.data || []);
      setMessage({ text: '', type: '' });
    } catch (err) {
      setMessage({ text: 'Không thể tải danh sách sách từ Server!', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 2. Tìm kiếm sách
  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(search);
  };

  // 3. Xử lý thay đổi Input Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Thêm hoặc Cập nhật Sách
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        // Cập nhật sách
        await axios.put(`${API_URL}/${formData.bookId}`, formData);
        setMessage({ text: 'Cập nhật sách thành công!', type: 'success' });
      } else {
        // Thêm sách mới
        await axios.post(API_URL, formData);
        setMessage({ text: 'Thêm sách mới thành công!', type: 'success' });
      }
      resetForm();
      fetchBooks(search);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra!';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 5. Chuẩn bị dữ liệu để Sửa
  const handleEdit = (book) => {
    setFormData(book);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 6. Xóa sách
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa cuốn sách này?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage({ text: 'Xóa sách thành công!', type: 'success' });
      if (selectedBook && (selectedBook._id === id || selectedBook.bookId === id)) {
        setSelectedBook(null);
      }
      fetchBooks(search);
    } catch (err) {
      setMessage({ text: 'Không thể xóa sách!', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      bookId: '', title: '', author: '', category: '',
      publisher: '', publishYear: '', isbn: '', quantity: 0, description: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="container">
      <header>
        <h1>Hệ Thống Quản Lý Sách</h1>
        <p>MSSV: 234849 - Họ tên: Nguyễn Ngọc Phương Vy</p>
      </header>

      {/* Thông báo kết quả / lỗi */}
      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Form Tìm Kiếm */}
      <div className="card">
        <h3>Tìm Kiếm Sách</h3>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Nhập tên sách, tác giả hoặc thể loại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Tìm kiếm</button>
          <button type="button" onClick={() => { setSearch(''); fetchBooks(''); }}>Tải lại</button>
        </form>
      </div>

      {/* Form Thêm / Cập nhật Sách */}
      <div className="card">
        <h3>{isEditing ? 'Cập Nhật Thông Tin Sách' : 'Thêm Sách Mới'}</h3>
        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-grid">
            <input name="bookId" placeholder="Mã sách (bookId) *" value={formData.bookId} onChange={handleChange} disabled={isEditing} required />
            <input name="title" placeholder="Tên sách *" value={formData.title} onChange={handleChange} required />
            <input name="author" placeholder="Tác giả *" value={formData.author} onChange={handleChange} required />
            <input name="category" placeholder="Thể loại *" value={formData.category} onChange={handleChange} required />
            <input name="publisher" placeholder="Nhà xuất bản *" value={formData.publisher} onChange={handleChange} required />
            <input type="number" name="publishYear" placeholder="Năm xuất bản *" value={formData.publishYear} onChange={handleChange} required />
            <input name="isbn" placeholder="Mã ISBN *" value={formData.isbn} onChange={handleChange} required />
            <input type="number" name="quantity" placeholder="Số lượng" value={formData.quantity} onChange={handleChange} required />
          </div>
          <textarea name="description" placeholder="Mô tả sách" value={formData.description} onChange={handleChange} rows="3" />
          <div className="form-actions">
            <button type="submit" className="btn-primary">{isEditing ? 'Lưu cập nhật' : 'Thêm mới'}</button>
            {isEditing && <button type="button" onClick={resetForm} className="btn-secondary">Hủy bỏ</button>}
          </div>
        </form>
      </div>

      {/* Màn hình Xem Chi Tiết Sách */}
      {selectedBook && (
        <div className="card detail-card">
          <h3>Chi Tiết Sách: {selectedBook.title}</h3>
          <p><strong>Mã sách:</strong> {selectedBook.bookId}</p>
          <p><strong>Tác giả:</strong> {selectedBook.author}</p>
          <p><strong>Thể loại:</strong> {selectedBook.category}</p>
          <p><strong>Nhà xuất bản:</strong> {selectedBook.publisher} ({selectedBook.publishYear})</p>
          <p><strong>Mã ISBN:</strong> {selectedBook.isbn}</p>
          <p><strong>Số lượng:</strong> {selectedBook.quantity}</p>
          <p><strong>Mô tả:</strong> {selectedBook.description || 'Chưa có mô tả'}</p>
          <button onClick={() => setSelectedBook(null)} className="btn-secondary">Đóng chi tiết</button>
        </div>
      )}

      {/* Danh Sách Sách */}
      <div className="card">
        <h3>Danh Sách Sách ({books.length})</h3>
        {loading ? (
          <p className="loading">Đang tải dữ liệu...</p>
        ) : books.length === 0 ? (
          <p>Chưa có dữ liệu sách.</p>
        ) : (
          <table className="book-table">
            <thead>
              <tr>
                <th>Mã Sách</th>
                <th>Tên Sách</th>
                <th>Tác Giả</th>
                <th>Thể Loại</th>
                <th>Số Lượng</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b._id || b.bookId}>
                  <td>{b.bookId}</td>
                  <td><strong>{b.title}</strong></td>
                  <td>{b.author}</td>
                  <td>{b.category}</td>
                  <td>{b.quantity}</td>
                  <td className="actions">
                    <button onClick={() => setSelectedBook(b)} className="btn-info">Xem</button>
                    <button onClick={() => handleEdit(b)} className="btn-warning">Sửa</button>
                    <button onClick={() => handleDelete(b.bookId || b._id)} className="btn-danger">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;