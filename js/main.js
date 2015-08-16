// Document Ready
$(function() {



  // Flickr Search Constructor
  var FlickrSearch = Backbone.View.extend({
    el: '.container',


    events: {
      'keyup #searchInput': 'search'
    },


    initialize: function () {
      this.getInlineTemplates();
      this.renderPlaceholder();
    },


    getInlineTemplates: function () {
      this.placeholderTemplate = _.template( $('#placeholderTemplate').html() );
      this.loadingTemplate = _.template( $('#loadingTemplate').html() );
      this.noResultsTemplate = _.template( $('#noResultsTemplate').html() );
      this.photosTemplate = _.template( $('#photosTemplate').html() );
    },


    search: _.debounce(function () {
      var query = this.$('#searchInput').val();

      if (query.length) {
        this.renderLoading();
      } else {
        this.renderPlaceholder();
      }
    }, 500),


    renderPlaceholder: function () {
      this.$('.results').html( this.placeholderTemplate() );
    },


    renderLoading: function () {
      this.$('.results').html( this.loadingTemplate() );
    },


    renderPhotos: function () {
      this.$('.results').html( this.photosTemplate() );
    }
  });



  // Instantiate
  var flickrSearch = new FlickrSearch();



});
