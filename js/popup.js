var getFacebookIdFromGraphAPI = function(url, callback) {
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
}

var getParameterByName = function(url, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var getFacebookIdFromUrl = function(url) {
  var re1 = /^http[s]?:\/\/(www)?(\.)?facebook\.\w+\/profile.php.+$/;
  var re2 = /^http[s]?:\/\/(www)?(\.)?facebook\.\w+\/search\/(\d+)\/.*$/;
  var re3 = /^http[s]?:\/\/(www)?(\.)?facebook\.\w+\/search\/recent-photos\/(\d+)\/.*$/;

  var res1 = url.match(re1);
  var res2 = url.match(re2);
  var res3 = url.match(re3);

  if (res1) {
    return getParameterByName(url, 'id');
  } else if (res2) {
    return res2[3];
  } else if (res3) {
    return res3[3];
  }
  return undefined;
}

var openPhotosOfWithFacebookId = function(facebookId, recent, tab) {
  var baseUrl = 'http://www.facebook.com/search/';
  var prefix = '/photos-of/';
  if (recent) {
    baseUrl = baseUrl + 'recent-photos/';
    prefix = prefix + 'intersect';
  };
  chrome.tabs.update(tab.id, {url: baseUrl + facebookId + prefix});
}

var openPhotos = function(recent) {
  chrome.tabs.getSelected(null, function(tab) {
    var facebookId = getFacebookIdFromUrl(tab.url);
    if (facebookId) {
      openPhotosOfWithFacebookId(facebookId, recent, tab);
      window.close();
    } else {
      // Facebook ID is not in the URL, try graph API
      getFacebookIdFromGraphAPI(tab.url, function(facebookId) {
        if (facebookId) {
          openPhotosOfWithFacebookId(facebookId, recent, tab);
        }
        window.close();
      });
    }
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