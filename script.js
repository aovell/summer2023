// book search
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
  //bookshelf
  function handleResponse(response) {
    var bookshelf = document.getElementById('bookshelf');
    
    if (response && response.items) {
      var books = response.items;
      for (var i = 0; i < books.length; i++) {
        var book = books[i].volumeInfo;
        var title = book.title;
        var authors = book.authors ? book.authors.join(', ') : 'Unknown Author';
        var thumbnail = book.imageLinks ? book.imageLinks.smallThumbnail : '';
        var description = book.description ? book.description : 'No description available.';
        var previewLink = book.previewLink;
        
        var bookElement = document.createElement('div');
        bookElement.classList.add('book');
        
        var imageElement = document.createElement('img');
        imageElement.src = thumbnail;
        
        var titleElement = document.createElement('h3');
        titleElement.innerHTML = title;
        
        var authorElement = document.createElement('p');
        authorElement.innerHTML = 'By ' + authors;
        
        var descriptionElement = document.createElement('p');
        descriptionElement.innerHTML = description;
        
        var previewLinkElement = document.createElement('a');
        previewLinkElement.href = previewLink;
        previewLinkElement.innerHTML = 'Read more';
        
        bookElement.appendChild(imageElement);
        bookElement.appendChild(titleElement);
        bookElement.appendChild(authorElement);
        bookElement.appendChild(descriptionElement);
        bookElement.appendChild(previewLinkElement);
        
        bookshelf.appendChild(bookElement);
      }
    } else {
      bookshelf.innerHTML = 'No books found.';
    }
  }
  
  var booksApiUrl = 'https://www.googleapis.com/books/v1/users/114034464592823534860/bookshelves/1001/volumes?callback=handleResponse';
  $.ajax({
    url: booksApiUrl,
    dataType: 'jsonp',
    success: handleResponse
  });
  

  $(document).ready(function() {
    var searchTerms = '';
    var currentPage = 0;
  
    // Function to perform book search
    function searchBooks() {
      var query = encodeURIComponent(searchTerms);
      var startIndex = currentPage * 10;
      var url = 'https://www.googleapis.com/books/v1/volumes?q=' + query + '&startIndex=' + startIndex + '&maxResults=10';
  
      $.getJSON(url, function(data) {
        var totalItems = data.totalItems;
        var totalPages = Math.ceil(totalItems / 10);
        var books = data.items;
  
        // Clear previous search results
        $('#searchResults').empty();
  
        // Display search results
        for (var i = 0; i < books.length; i++) {
          var book = books[i].volumeInfo;
          var title = book.title;
          var coverImage = (book.imageLinks && book.imageLinks.thumbnail) ? book.imageLinks.thumbnail : '';
  
          // Create a new result item
          var resultItem = $('<div class="result-item"><img src="' + coverImage + '"><p>' + title + '</p></div>');
  
          // Attach click event to display book details
          resultItem.click(function() {
            var bookId = $(this).data('book-id');
            displayBookDetails(bookId);
          });
  
          // Set the book ID as data attribute
          resultItem.data('book-id', books[i].id);
  
          // Append the result item to the search results container
          $('#searchResults').append(resultItem);
        }
  
        // Update pagination
        $('#pagination').empty();
        for (var j = 0; j < totalPages; j++) {
          var pageNumber = j + 1;
          var pageLink = $('<a href="#">' + pageNumber + '</a>');
  
          // Attach click event to perform search for the selected page
          pageLink.click(function() {
            currentPage = $(this).text() - 1;
            searchBooks();
          });
  
          if (j === currentPage) {
            pageLink.addClass('active');
          }
  
          // Append the page link to the pagination container
          $('#pagination').append(pageLink);
        }
      });
    }
  
    // Function to display book details
    function displayBookDetails(bookId) {
      var url = 'https://www.googleapis.com/books/v1/volumes/' + bookId;
  
      $.getJSON(url, function(data) {
        var book = data.volumeInfo;
        var title = book.title;
        var description = book.description;
        var authors = book.authors ? book.authors.join(', ') : 'Unknown';
        var publisher = book.publisher ? book.publisher : 'Unknown';
        var publishedDate = book.publishedDate ? book.publishedDate : 'Unknown';
  
        // Create book details HTML
        var bookDetailsHtml = '<h2>' + title + '</h2>' +
          '<p><strong>Authors:</strong> ' + authors + '</p>' +
          '<p><strong>Publisher:</strong> ' + publisher + '</p>' +
          '<p><strong>Published Date:</strong> ' + publishedDate + '</p>' +
          '<p><strong>Description:</strong> ' + description + '</p>';
  
        // Display book details in the book details container
        $('#bookDetails').html(bookDetailsHtml);
      });
    }
  
    // Perform book search when the user enters search terms
    $('#searchInput').on('input', function() {
      searchTerms = $(this).val();
      currentPage = 0;
      searchBooks();
    });
  
    // Display books from the bookshelf
    function displayBookshelf() {
      var url = 'https://www.googleapis.com/books/v1/users/{user_id}/bookshelves/{shelf_id}/volumes';
      // Replace {user_id} and {shelf_id} with your actual user ID and shelf ID
  
      $.getJSON(url, function(data) {
        var books = data.items;
  
        // Clear previous bookshelf results
        $('#bookshelf').empty();
  
        // Display books from the bookshelf
        for (var i = 0; i < books.length; i++) {
          var book = books[i].volumeInfo;
          var title = book.title;
          var coverImage = (book.imageLinks && book.imageLinks.thumbnail) ? book.imageLinks.thumbnail : '';
  
          // Create a new bookshelf item
          var bookshelfItem = $('<div class="bookshelf-item"><img src="' + coverImage + '"><p>' + title + '</p></div>');
  
          // Attach click event to display book details
          bookshelfItem.click(function() {
            var bookId = $(this).data('book-id');
            displayBookDetails(bookId);
          });
  
          // Set the book ID as data attribute
          bookshelfItem.data('book-id', books[i].id);
  
          // Append the bookshelf item to the bookshelf container
          $('#bookshelf').append(bookshelfItem);
        }
      });
    }
  
    // Call the function to display books from the bookshelf
    displayBookshelf();
  });
  