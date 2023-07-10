
//
  $(document).ready(function() {
    var apiKey = '114034464592823534860'; // Replace with your Google Books API key
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
  