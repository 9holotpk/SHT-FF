// DEV. EXTENTION BY iTON // => POPUP.JS
// NOTE: Click to Shorten URL

function setURLshorten(shtURL) {
  // console.log(shtURL);
  let input = document.getElementById("url");
  if (shtURL != undefined) {
    hide();
    input.value = shtURL;
    copy();
    share(shtURL);
  }

}

function copy() {
  // console.log(document.getElementById("url").value);
  var copyText = document.querySelector("#url");
  copyText.select();
  document.execCommand("copy");
}

function hide() {
  let load = document.getElementById("loading");
  let complete = document.getElementById("complete");

  load.style.display = "none";
  complete.style.display = "inline";
}

function share(shtURL) {
  var url = shtURL;
  var tweet = document.getElementById("tweet");
  var facebook = document.getElementById("facebook");
  tweet.src = "https://platform.twitter.com/widgets/tweet_button.html?size=m&url=" + shtURL + "&related=twitterapi%2Ctwitter&text=share%20url&hashtags=iShortener";
  document.getElementsByTagName('iframe')[1].parentNode.appendChild(tweet);

  facebook.src = "https://www.facebook.com/plugins/share_button.php?href=" + shtURL + "&layout=button&size=small&mobile_iframe=true&width=60&height=20&appId";
  document.getElementsByTagName('iframe')[0].parentNode.appendChild(facebook);
}



