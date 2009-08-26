function LoadDynamicFeedControl() {
  var feeds = [
    {title: 'Updates',
      url: 'http://www.stuorg.iastate.edu/dubh/new/rss2.xml'
    }];
  var options = {
    stacked : false,
    horizontal : true,
    title : ""
  }

  new GFdynamicFeedControl(feeds, 'feed-control', options);
}
// Load the feeds API and set the onload callback.
google.load('feeds', '1');
google.setOnLoadCallback(LoadDynamicFeedControl);
