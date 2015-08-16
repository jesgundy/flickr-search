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


    url: function () {
      var url = 'https://api.flickr.com/services/rest/';
      url += '?method=flickr.photos.search';
      url += '&api_key=4e258a4396bf5ba0448b2e2fe574034e';
      url += '&text=' + this.queryString;
      url += '&extras=views,url_sq'; // include viewcount in query
      url += '&format=json';
      url += '&nojsoncallback=1';
      return url;
    },


    parse: function (response) {
      if (response.stat == 'fail') {
        return null;
      }
      return response.photos.photo;
    }
  });



  // Flickr Search Constructor
  var FlickrSearch = Backbone.View.extend({
    el: '.container',
    queryString: '', // container for the query string


    events: {
      'keyup #searchInput': 'search'
    },


    initialize: function () {
      this.photoCollection = new PhotoCollection();
      this.getInlineTemplates();
      this.renderPlaceholder();
    },


    getInlineTemplates: function () {
      this.placeholderTemplate = _.template( $('#placeholderTemplate').html() );
      this.loadingTemplate = _.template( $('#loadingTemplate').html() );
      this.noResultsTemplate = _.template( $('#noResultsTemplate').html() );
      this.photosTemplate = _.template( $('#photosTemplate').html() );
    },


    search: function () {
      this.queryString = $.trim( this.$('#searchInput').val() );

      if (this.queryString.length) {
        this.renderLoading();
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


    renderLoading: function () {
      this.$('.results').html( this.loadingTemplate() );
    },


    renderPhotos: function () {
      var data = { photos: this.photoCollection.toJSON() };
      this.$('.results').html( this.photosTemplate(data) );
    },


    queryFlickr: _.debounce(function () {
      var self = this;
      self.photoCollection.queryString = self.queryString;

      self.photoCollection.fetch({
        success: function (collection) {
          if (collection.length) {
            self.renderPhotos();
          } else {
            self.renderNoResults();
          }
        },
        error: function (response, error, options) {
          alert('There was an error querying the Flickr API.');
        }
      });
    }, 500),
  });



  // Instantiate
  var flickrSearch = new FlickrSearch();



});
