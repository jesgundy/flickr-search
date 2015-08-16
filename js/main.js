// Document Ready
$(function() {



  // Flickr Search Constructor
  var FlickrSearch = Backbone.View.extend({
    el: '.container',


    initialize: function () {
      this.getInlineTemplates();
      this.render();
    },


    getInlineTemplates: function () {
      this.placeholderTemplate = _.template( $('#placeholderTemplate').html() );
      this.noResultsTemplate = _.template( $('#noResultsTemplate').html() );
      this.photosTemplate = _.template( $('#photosTemplate').html() );
    },


    render: function () {
      this.$('.results').html( this.placeholderTemplate() );
    }
  });



  // Instantiate
  var flickrSearch = new FlickrSearch();



});
