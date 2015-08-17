// Document Ready
$(function() {



  var PhotoModel = Backbone.Model.extend({
    parse: function (response) {
      // Map photo url (http://cl.ly/cFWK)
      response.linkUrl = 'https://www.flickr.com/photos/';
      response.linkUrl += response.owner + '/';
      response.linkUrl += response.id;
      return response;
    }
  });



  // Photo Collection
  var PhotoCollection = Backbone.Collection.extend({
    model: PhotoModel,
    queryString: '', // container for the query string
    currentPage: 1,
    totalPages: null,


    url: function () {
      var url = 'https://api.flickr.com/services/rest/';
      url += '?method=flickr.photos.search';
      url += '&api_key=4e258a4396bf5ba0448b2e2fe574034e';
      url += '&text=' + this.queryString;
      url += '&extras=views,url_sq'; // include viewcount in query
      url += '&format=json';
      url += '&nojsoncallback=1';
      url += '&page=' + this.currentPage;
      url += '&per_page=45';
      return url;
    },


    parse: function (response) {
      // bail if there's an error
      if (response.stat == 'fail') {
        return null;
      }

      // Update page counters
      this.currentPage = response.photos.page;
      this.totalPages = response.photos.pages;

      // return photos array for collection
      return response.photos.photo;
    }
  });



  // Flickr Search Constructor
  var FlickrSearch = Backbone.View.extend({
    el: '.container',
    queryString: '', // container for the query string


    events: {
      'keyup #searchInput': 'search',
      'click .loadMorePhotos': 'loadMorePhotos'
    },


    initialize: function () {
      this.photoCollection = new PhotoCollection();
      this.getInlineTemplates();
      this.renderPlaceholder();
    },


    getInlineTemplates: function () {
      this.placeholderTemplate = _.template( $('#placeholderTemplate').html() );
      this.progressTemplate = _.template( $('#progressTemplate').html() );
      this.loaderTemplate = _.template( $('#loaderTemplate').html() );
      this.noResultsTemplate = _.template( $('#noResultsTemplate').html() );
      this.photosTemplate = _.template( $('#photosTemplate').html() );
    },


    search: function () {
      var newQueryString = $.trim( this.$('#searchInput').val() );

      if (newQueryString == this.queryString) {
        return;
      }

      this.queryString = newQueryString;

      if (this.queryString.length) {
        this.renderProgress();
        this.queryFlickr();
      } else {
        this.renderPlaceholder();
      }
    },


    renderPlaceholder: function () {
      this.$('.results').html( this.placeholderTemplate() );
    },


    renderNoResults: function () {
      this.$('.results').html( this.noResultsTemplate() );
    },


    renderProgress: function () {
      this.$('.results').html( this.progressTemplate() );
    },


    renderPhotos: function () {
      var html = '<ul class="photoList">'
      html += this.photosTemplate({
        photos: this.photoCollection.toJSON()
      });
      html += '</ul>';

      html += this.loaderTemplate({
        totalPages: this.photoCollection.totalPages,
        currentPage: this.photoCollection.currentPage,
        hasMorePages: this.photoCollection.currentPage < this.photoCollection.totalPages
      });

      this.$('.results').html( html );
    },


    renderAdditionalPhotos: function () {
      var newPhotos = this.photosTemplate({
        photos: this.photoCollection.toJSON()
      });
      this.$('.photoList').append( newPhotos );
    },


    queryFlickr: _.debounce(function () {
      var self = this;
      self.photoCollection.queryString = self.queryString;

      self.photoCollection.fetch({
        success: function (collection) {
          if (collection.length) {
            if (collection.currentPage > 1) {
              self.renderAdditionalPhotos();
            } else {
              self.renderPhotos();
            }
          } else {
            self.renderNoResults();
          }
        },
        error: function (response, error, options) {
          alert('There was an error querying the Flickr API.');
        }
      });
    }, 500),


    loadMorePhotos: function () {
      this.photoCollection.currentPage++;
      this.queryFlickr();
    }
  });



  // Instantiate
  var flickrSearch = new FlickrSearch();



});
