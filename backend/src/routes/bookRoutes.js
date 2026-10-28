const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/', bookController.getBooks);         // GET /api/books & /api/books?search=...
router.get('/:id', bookController.getBookById);   // GET /api/books/:id
router.post('/', bookController.createBook);      // POST /api/books
router.put('/:id', bookController.updateBook);    // PUT /api/books/:id
router.delete('/:id', bookController.deleteBook); // DELETE /api/books/:id

module.exports = router;