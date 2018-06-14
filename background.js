// DEV. EXTENTION BY iTON // => BACKGROUND.JS
// NOTE:    Click to Shorten URL
// UPDATE:  10/04/2018 - Transitioning Google URL Shortener to Firebase Dynamic Links 
//          14/06/2018 - Optimize update and Bug fixed.

// OLD API
// const API_KEY = 'AIzaSyCjkUcGt5h2mFyNfgJFqUXqKY1kOQnjL4g';
// const API_URL = 'https://www.googleapis.com/urlshortener/v1/url';

// NEW API
const API_KEY = 'AIzaSyASAQzCena-R-4DQUwDIosyLeNl68C7p0k';
const API_URL = 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks';

let TAB_URL = '';
let TITLE = '';

browser.runtime.onMessage.addListener(function (request) {
  let resultX = request;
  if (resultX.script === "shortenLink") {
    shortenLink(resultX.tab_url, resultX.title);
  }
});

function onError(error) {
  console.log(`Error: ${error}`);
}

function shortenLink(link, title) {
  // const basename = "https://www.googleapis.com";
  // const urlfrag = "/urlshortener/v1/url?key=" + API_KEY;
  const basename = "https://firebasedynamiclinks.googleapis.com";
  const urlfrag = "/v1/shortLinks?key=" + API_KEY;
  // const longUrl = encodeURIComponent(link);
  const longDynamicLink = link;
  const dynamicLinkDomain = 'dh3p7.app.goo.gl';
  const xhr = new XMLHttpRequest();

  xhr.open("POST", basename + urlfrag, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      const response = (JSON.parse(xhr.responseText));
      browser.runtime.sendMessage({shortLink: response.shortLink, title: title});
    }
  };

  // xhr.send(JSON.stringify({ "longUrl": link }));
  xhr.send(JSON.stringify({
    "dynamicLinkInfo": {
      "dynamicLinkDomain": dynamicLinkDomain,
      "link": longDynamicLink
    },
    "suffix": {
      "option": "SHORT"
    }
  }));
}
