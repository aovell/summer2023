
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
  
  var books = data.items.slice(0, 50); // Get first 50 books
  
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
        
//

$(document).ready(function() {
  // Define variables
  var apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
  var maxResults = 60;
  var resultsPerPage = 10;
  var currentPage = 1;
  var totalResults = 0;
  var totalPages = 0;

  // Handle search button click
  $('#search-button').click(function() {
    var searchTerm = $('#search-input').val();
    if (searchTerm.trim() !== '') {
      // Construct API URL
      var url = apiUrl + encodeURIComponent(searchTerm) + '&maxResults=' + maxResults;
      
      // Call API and process response
      $.getJSON(url, function(response) {
        if (response.items) {
          totalResults = response.items.length;
          totalPages = Math.ceil(totalResults / resultsPerPage);
          currentPage = 1;
          displayResults(currentPage);
        } else {
          $('#results-container').html('No results found.');
        }
      });
    }
  });

  // Display search results for the specified page
  function displayResults(page) {
    var startIndex = (page - 1) * resultsPerPage;
    var endIndex = startIndex + resultsPerPage;
    var books = response.items.slice(startIndex, endIndex);
    var html = '';
    for (var i = 0; i < books.length; i++) {
      var book = books[i].volumeInfo;
      html += '<div class="book-item">';
      if (book.imageLinks && book.imageLinks.smallThumbnail) {
        html += '<img src="' + book.imageLinks.smallThumbnail + '" alt="' + book.title + '">';
      }
      html += '<div class="book-info">';
      html += '<h2 class="book-title">' + book.title + '</h2>';
      if (book.description) {
        html += '<p class="book-description">' + book.description + '</p>';
      }
      html += '</div></div>';
    }
    $('#results-container').html(html);
    displayPagination(page);
  }

  // Display pagination controls
  function displayPagination(page) {
    var html = '';
    if (totalPages > 1) {
      html += '<select id="page-select">';
      for (var i = 1; i <= totalPages; i++) {
        html += '<option value="' + i + '"';
        if (i === page) {
          html += ' selected';
        }
        html += '>' + i + '</option>';
      }
      html += '</select>';
    }
    $('#results-container').append(html);

    // Handle page select change
    $('#page-select').change(function() {
      var selectedPage = parseInt($(this).val());
      displayResults(selectedPage);
    });
  }
});


//4
// Handle layout switching
$('.layout-switch').on('click', function() {
  $('.layout-switch').removeClass('active');
  $(this).addClass('active');
  var layout = $(this).data('layout');
  if (layout === 'grid') {
    $('.search-result-item').addClass('grid-view');
  } else if (layout === 'list') {
    $('.search-result-item').removeClass('grid-view');
  }
});

