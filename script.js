
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
        
//
// JavaScript code
$(document).ready(function() {
  var searchResults = [
    // Sample search results data
    // Replace this with your actual data
    { title: "Book 1", author: "Author 1", published: "2022", thumbnail: "book1.jpg", description: "Description of Book 1" },
    { title: "Book 2", author: "Author 2", published: "2023", thumbnail: "book2.jpg", description: "Description of Book 2" },
    { title: "Book 3", author: "Author 3", published: "2021", thumbnail: "book3.jpg", description: "Description of Book 3" },
  ];

  var bookshelf = [
    // Sample bookshelf data
    // Replace this with your actual data
    { title: "Bookshelf Book 1", author: "Author 1", published: "2020", thumbnail: "bookshelf1.jpg" },
    { title: "Bookshelf Book 2", author: "Author 2", published: "2019", thumbnail: "bookshelf2.jpg" },
  ];

  // Compile the templates
  var searchResultsTemplate = Handlebars.compile($('#search-results-template').html());
  var bookDetailsTemplate = Handlebars.compile($('#book-details-template').html());
  var bookshelfTemplate = Handlebars.compile($('#bookshelf-template').html());

  // Render the initial search results
  renderSearchResults(searchResults);

  // Handle click event on search result items
  $(document).on('click', '.search-result-item', function() {
    var bookIndex = $(this).index();
    var book = searchResults[bookIndex];
    var bookDetailsHtml = bookDetailsTemplate(book);
    $('.book-details-container').html(bookDetailsHtml);
  });

  // Handle layout switching
  $('.layout-switch').on('click', function() {
    $('.layout-switch').removeClass('active');
    $(this).addClass('active');
    var layout = $(this).data('layout');
    if (layout === 'grid') {
      renderSearchResults(searchResults);
    } else if (layout === 'list') {
      renderSearchResults(searchResults, 'list');
    }
  });

  // Render search results using the specified layout
  function renderSearchResults(books, layout = 'grid') {
    var searchResultsHtml = searchResultsTemplate({ books: books });
    $('.search-results-container').html(searchResultsHtml);
    $('.search-results-container').removeClass().addClass('search-results-container').addClass(layout);
  }

  // Render bookshelf
  function renderBookshelf() {
    var bookshelfHtml = bookshelfTemplate({ books: bookshelf });
    $('.bookshelf-container').html(bookshelfHtml);
  }

  // Handle bookshelf tab click event
  $('.bookshelf-tab').on('click', function() {
    $('.tab').removeClass('active');
    $(this).addClass('active');
    $('.search-results-container').hide();
    $('.bookshelf-container').show();
    renderBookshelf();
  });

  // Handle search results tab click event
  $('.search-results-tab').on('click', function() {
    $('.tab').removeClass('active');
    $(this).addClass('active');
    $('.bookshelf-container').hide();
    $('.search-results-container').show();
  });
});


//Milestone4
// JavaScript code
$(document).ready(function() {
  var searchResults = [];
  var bookshelf = [];
  var currentPage = 0;
  var itemsPerPage = 10;
  var totalItems = 0;
  var currentQuery = '';

  // Compile the templates
  var searchResultsTemplate = Handlebars.compile($('#search-results-template').html());
  var bookDetailsTemplate = Handlebars.compile($('#book-details-template').html());
  var bookshelfTemplate = Handlebars.compile($('#bookshelf-template').html());

  // Handle layout switching
  $('.layout-switch').on('click', function() {
    $('.layout-switch').removeClass('active');
    $(this).addClass('active');
    var layout = $(this).data('layout');
    if (layout === 'grid') {
      renderSearchResults(searchResults);
    } else if (layout === 'list') {
      renderSearchResults(searchResults, 'list');
    }
  });

  // Handle click event on search result items
  $(document).on('click', '.search-result-item', function() {
    var bookIndex = $(this).index();
    var book = searchResults[bookIndex];
    var bookDetailsHtml = bookDetailsTemplate(book);
    $('.book-details-container').html(bookDetailsHtml);
  });

  // Handle search form submission
  $('#search-form').on('submit', function(e) {
    e.preventDefault();
    currentQuery = $('#search-input').val();
    currentPage = 0;
    fetchSearchResults(currentQuery, currentPage, itemsPerPage);
  });

  // Handle load more button click event
  $('#load-more').on('click', function() {
    currentPage++;
    fetchSearchResults(currentQuery, currentPage, itemsPerPage);
  });

  // Fetch search results from Google Books API
  function fetchSearchResults(query, page, itemsPerPage) {
    var startIndex = page * itemsPerPage;
    var url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${itemsPerPage}`;

    $.ajax({
      url: url,
      method: 'GET',
      success: function(data) {
        searchResults = data.items || [];
        totalItems = data.totalItems || 0;
        renderSearchResults(searchResults);
        updateLoadMoreButton();
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  // Render search results using the specified layout
  function renderSearchResults(books, layout = 'grid') {
    var searchResultsHtml = searchResultsTemplate({ books: books });
    $('.search-results-container').html(searchResultsHtml);
    $('.search-results-container').removeClass().addClass('search-results-container').addClass(layout);
  }

  // Update the load more button visibility based on the current page and total items
  function updateLoadMoreButton() {
    if ((currentPage + 1) * itemsPerPage >= totalItems) {
      $('#load-more').hide();
    } else {
      $('#load-more').show();
    }
  }

  // Fetch bookshelf data from Google Books API
  function fetchBookshelf() {
    var url = 'https://www.googleapis.com/books/v1/users/USER_ID/bookshelves/0/volumes';

    $.ajax({
      url: url,
      method: 'GET',
      success: function(data) {
        bookshelf = data.items || [];
        renderBookshelf();
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  // Render bookshelf
  function renderBookshelf() {
    var bookshelfHtml = bookshelfTemplate({ books: bookshelf });
    $('.bookshelf-container').html(bookshelfHtml);
  }

  // Handle bookshelf tab click event
  $('.bookshelf-tab').on('click', function() {
    $('.tab').removeClass('active');
    $(this).addClass('active');
    $('.search-results-container').hide();
    $('.bookshelf-container').show();
    fetchBookshelf();
  });

  // Handle search results tab click event
  $('.search-results-tab').on('click', function() {
    $('.tab').removeClass('active');
    $(this).addClass('active');
    $('.bookshelf-container').hide();
    $('.search-results-container').show();
  });
});
