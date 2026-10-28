const Book = require('../models/Books');

// 1. Lấy danh sách sách + Tìm kiếm (GET /api/books hoặc /api/books?search=...)
exports.getBooks = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    // Tìm kiếm theo tên sách (title), tác giả (author) hoặc thể loại (category)
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const books = await Book.find(query);
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách sách', error: error.message });
  }
};

// 2. Xem thông tin 1 sách theo ID (GET /api/books/:id)
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    // Hỗ trợ tìm theo _id của MongoDB hoặc bookId tự định nghĩa
    const book = await Book.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { bookId: id }]
    });

    if (!book) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy thông tin sách', error: error.message });
  }
};

// 3. Thêm sách mới (POST /api/books)
exports.createBook = async (req, res) => {
  try {
    const { bookId, title, author, category, publisher, publishYear, isbn, quantity, description } = req.body;

    // Kiểm tra dữ liệu đầu vào (Validation)
    if (!bookId || !title || !author || !category || !publisher || !publishYear || !isbn) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ các thông tin bắt buộc' });
    }

    // Kiểm tra trùng mã bookId
    const existingBook = await Book.findOne({ bookId });
    if (existingBook) {
      return res.status(400).json({ success: false, message: 'Mã sách (bookId) đã tồn tại trong hệ thống' });
    }

    const newBook = new Book({
      bookId,
      title,
      author,
      category,
      publisher,
      publishYear,
      isbn,
      quantity: quantity || 0,
      description: description || ''
    });

    await newBook.save();
    res.status(201).json({ success: true, message: 'Thêm sách mới thành công', data: newBook });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi thêm sách', error: error.message });
  }
};

// 4. Cập nhật thông tin sách (PUT /api/books/:id)
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookId, title, author, category, publisher, publishYear, isbn, quantity, description } = req.body;

    // Kiểm tra sách có tồn tại không
    let book = await Book.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { bookId: id }]
    });

    if (!book) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sách để cập nhật' });
    }

    // Nếu người dùng đổi bookId, kiểm tra trùng lặp
    if (bookId && bookId !== book.bookId) {
      const duplicateBook = await Book.findOne({ bookId });
      if (duplicateBook) {
        return res.status(400).json({ success: false, message: 'Mã sách (bookId) mới bị trùng với sách khác' });
      }
    }

    // Cập nhật dữ liệu
    book.bookId = bookId || book.bookId;
    book.title = title || book.title;
    book.author = author || book.author;
    book.category = category || book.category;
    book.publisher = publisher || book.publisher;
    book.publishYear = publishYear || book.publishYear;
    book.isbn = isbn || book.isbn;
    if (quantity !== undefined) book.quantity = quantity;
    if (description !== undefined) book.description = description;

    await book.save();
    res.status(200).json({ success: true, message: 'Cập nhật sách thành công', data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi cập nhật sách', error: error.message });
  }
};

// 5. Xóa sách (DELETE /api/books/:id)
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findOneAndDelete({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { bookId: id }]
    });

    if (!book) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sách để xóa' });
    }

    res.status(200).json({ success: true, message: 'Xóa sách thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xóa sách', error: error.message });
  }
};