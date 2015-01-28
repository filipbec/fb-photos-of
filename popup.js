var getFacebookId = function(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  var url = 'http://graph.facebook.com/' + url;

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var myArr = JSON.parse(xmlhttp.responseText);
        callback(myArr.id);
    }
  }
  xmlhttp.open('GET', url, true);
  xmlhttp.send();
};

var openPhotos = function(recent) {
  chrome.tabs.getSelected(null, function(tab) {
    getFacebookId(tab.url, function(facebookId) {
      if (facebookId) {
        var baseUrl = 'http://www.facebook.com/search/';
        var prefix = '/photos-of/';
        if (recent) {
          baseUrl = baseUrl + 'recent-photos/';
          prefix = prefix + 'intersect';
        };
        chrome.tabs.update(tab.id, {url: baseUrl + facebookId + prefix});
      }
      window.close();
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
    var photosOfLink = document.getElementById('photos-of');
    photosOfLink.addEventListener('click', function() {
        openPhotos(false);
    });

    var recentPhotosOfLink = document.getElementById('recent-photos-of');
    recentPhotosOfLink.addEventListener('click', function() {
        openPhotos(true);
    });
});