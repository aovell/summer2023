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
    var apiKey = 'YOUR_API_KEY'; // Replace with your Google Books API key
    var currentQuery = '';
    var currentPage = 1;
  
    $('#searchBtn').click(function() {
      currentQuery = $('#searchInput').val();
      currentPage = 1;
      searchBooks(currentQuery, currentPage);
    });
  
    function searchBooks(query, page) {
      var startIndex = (page - 1) * 10;
      var url = 'https://www.googleapis.com/books/v1/volumes?q=' + encodeURIComponent(query) + '&startIndex=' + startIndex + '&maxResults=10&key=' + apiKey;
  
      $.getJSON(url, function(data) {
        var totalItems = data.totalItems;
        var totalPages = Math.ceil(totalItems / 10);
  
        $('#results').empty();
  
        if (totalItems === 0) {
          $('#results').text('No books found.');
          return;
        }
  
        $.each(data.items, function(index, item) {
          var book = item.volumeInfo;
          var title = book.title;
          var imageLinks = book.imageLinks;
          var thumbnail = imageLinks ? imageLinks.thumbnail : 'no-image.png';
  
          var $bookDiv = $('<div class="book"><img src="' + thumbnail + '"><br>' + title + '</div>');
          $bookDiv.click(function() {
            displayBookDetails(book);
          });
  
          $('#results').append($bookDiv);
        });
  
        displayPagination(totalPages);
      });
    }
  
    
    //
    function displayBookDetails(book) {
      $('#bookDetails').empty();
  
      var title = book.title;
      var authors = book.authors ? book.authors.join(', ') : 'Unknown';
      var description = book.description ? book.description : 'No description available';
      var publisher = book.publisher ? book.publisher : 'Unknown';
      var publishedDate = book.publishedDate ? book.publishedDate : 'Unknown';
  
      var $detailsDiv = $('<div><h3>' + title + '</h3><p>Authors: ' + authors + '</p><p>Publisher: ' + publisher + '</p><p>Published Date: ' + publishedDate + '</p><p>' + description + '</p></div>');
  
      $('#bookDetails').append($detailsDiv);
    }
  
    function displayPagination(totalPages) {
      var $paginationDiv = $('<div class="pagination"></div>');
  
      for (var i = 1; i <= totalPages; i++) {
        var $pageLink = $('<a href="#" class="pageLink">' + i + '</a>');
  
        if (i === currentPage) {
          $pageLink.addClass('active');
        }
  
        $pageLink.click(function() {
          currentPage = parseInt($(this).text());
          searchBooks(currentQuery, currentPage);
        });
  
        $paginationDiv.append($pageLink);
      }
  
      $('#results').append($paginationDiv);
    }
  
    searchBooks('programming', 1); // Initial search for sample query
  });
  