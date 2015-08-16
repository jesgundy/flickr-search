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
      this.render();
    },


    getInlineTemplates: function () {
      this.placeholderTemplate = _.template( $('#placeholderTemplate').html() );
      this.noResultsTemplate = _.template( $('#noResultsTemplate').html() );
      this.photosTemplate = _.template( $('#photosTemplate').html() );
    },


    render: function () {
      this.$('.results').html( this.placeholderTemplate() );
    },


    search: _.debounce(function () {
      var query = this.$('#searchInput').val();
      console.log(query);
    }, 500)
  });



  // Instantiate
  var flickrSearch = new FlickrSearch();



});
