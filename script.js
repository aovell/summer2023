// script.js
$(document).ready(function() {
    $('#search-form').submit(function(event) {
      event.preventDefault();
      var searchTerm = $('#search-term').val();
      searchBooks(searchTerm);
    });
  });
  
  function searchBooks(searchTerm) {
    var apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=' + encodeURIComponent(searchTerm);
    
    $.getJSON(apiUrl, function(data) {
      displaySearchResults(data);
    });
  }
  
  function displaySearchResults(data) {
    var resultsContainer = $('#search-results');
    resultsContainer.empty();
    
    if (data.totalItems === 0) {
      resultsContainer.html('<p>No results found.</p>');
      return;
    }
    
    var books = data.items.slice(0, 60); // Get first 60 books
    
    $.each(books, function(index, book) {
      var title = book.volumeInfo.title;
      var coverImage = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.smallThumbnail : 'no-image.jpg';
      var bookId = book.id;
      
      var bookElement = $('<div class="book-item">');
      var titleElement = $('<h2>').text(title);
      var coverImageElement = $('<img>').attr('src', coverImage);
      
      var bookLink = $('<a>').attr('href', 'bookDetails.html?bookId=' + bookId).append(titleElement);
      
      bookElement.append(bookLink, coverImageElement);
      resultsContainer.append(bookElement);
    });
  }
  // script.js
$(document).ready(function() {
    var urlParams = new URLSearchParams(window.location.search);
    var bookId = urlParams.get('bookId');
    if (bookId) {
      getBookDetails(bookId);
    } else {
      $('#book-details').html('<p>No book ID found.</p>');
    }
  });
  
  function getBookDetails(bookId) {
    var apiUrl = 'https://www.googleapis.com/books/v1/volumes/' + bookId;
    
    $.getJSON(apiUrl, function(data) {
      displayBookDetails(data);
    });
  }
  
  function displayBookDetails(data) {
    var detailsContainer = $('#book-details');
    detailsContainer.empty();
    
    var book = data.volumeInfo;
    
    var title = book.title;
    var authors = book.authors ? book.authors.join(', ') : 'Unknown';
    var publisher = book.publisher || 'Unknown';
    var description = book.description || 'No description available.';
    var coverImage = book.imageLinks ? book.imageLinks.thumbnail : 'no-image.jpg';
    var price = book.saleInfo && book.saleInfo.listPrice ? book.saleInfo.listPrice.amount + ' ' + book.saleInfo.listPrice.currencyCode : 'Not for sale';
    
    var titleElement = $('<h2>').text(title);
    var authorsElement = $('<p>').text('Author(s): ' + authors);
    var publisherElement = $('<p>').text('Publisher: ' + publisher);
    var descriptionElement = $('<p>').text(description);
    var coverImageElement = $('<img>').attr('src', coverImage);
    var priceElement = $('<p>').text('Price: ' + price);
    
    detailsContainer.append(titleElement, authorsElement, publisherElement, descriptionElement, coverImageElement, priceElement);
  }
  // script.js
$(document).ready(function() {
    var bookshelfId = 'YOUR_BOOKSHELF_ID'; // Replace with your bookshelf ID from Google Books
    getBooksFromBookshelf(bookshelfId);
  });
  
  function getBooksFromBookshelf(bookshelfId) {
    var apiUrl = 'https://www.googleapis.com/books/v1/mylibrary/bookshelves/' + bookshelfId + '/volumes';
    
    $.getJSON(apiUrl, function(data) {
      displayBookshelf(data);
    });
  }
  
  function displayBookshelf(data) {
    var bookshelfContainer = $('#bookshelf');
    bookshelfContainer.empty();
    
    if (data.totalItems === 0) {
      bookshelfContainer.html('<p>No books in the bookshelf.</p>');
      return;
    }
    
    var books = data.items;
    
    $.each(books, function(index, book) {
      var title = book.volumeInfo.title;
      var coverImage = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.smallThumbnail : 'no-image.jpg';
      var bookId = book.id;
      
      var bookElement = $('<div class="book-item">');
      var titleElement = $('<h2>').text(title);
      var coverImageElement = $('<img>').attr('src', coverImage);
      
      var bookLink = $('<a>').attr('href', 'bookDetails.html?bookId=' + bookId).append(titleElement);
      
      bookElement.append(bookLink, coverImageElement);
      bookshelfContainer.append(bookElement);
    });
  }
  