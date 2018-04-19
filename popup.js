// DEV. EXTENTION BY iTON // => POPUP.JS
// NOTE: Click to Shorten URL

// # Event
document.getElementById('optionsX').addEventListener('click', show_options);
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('tag').addEventListener('click', save_optionsX);
document.getElementById('sharebt').addEventListener('click', save_optionsX);

// # Value
let w_hashtags = "&hashtags=iShortener";

function restore_options() { 
  let manifestData = browser.runtime.getManifest();
  let version = document.getElementById('version');
  let getting = browser.storage.local.get(["twitterTag","sharebutton"]);

  getting.then(onGotX, onError);
  version.textContent = '「 ver. ' + manifestData.version + ' 」';
  
}

function onGotX(items) {
  console.log(items.sharebutton)
  let tag = document.getElementById('tag');
  let sharebt = document.getElementById('sharebt');
  if (items.twitterTag) {
    tag.checked = items.twitterTag.value;
    if (items.twitterTag.value == true) {
      w_hashtags = "&hashtags=iShortener";
    } else {
      w_hashtags = '';
    }
  } else {
    tag.checked = true;
  }
  if (items.sharebutton) {
    sharebt.checked = items.sharebutton.value;
    let show_button = document.getElementById('shareX');
    if (items.sharebutton.value) {
      show_button.style.display = "block";
    } else {
      show_button.style.display = "none";
    }
  } else {
    sharebt.checked = true;
  }    
}

function setURLshorten(shtURL, title) {
  let input = document.getElementById("url");
  if (shtURL != undefined) {
    hide();
    input.value = shtURL;
    copy();
    share(shtURL, title);
  }
}

function copy() {
  // console.log(document.getElementById("url").value);
  let copyText = document.querySelector("#url");
  copyText.select();
  document.execCommand("copy");
}

function hide() {
  let load = document.getElementById("loading");
  let complete = document.getElementById("complete");

  load.style.display = "none";
  complete.style.display = "inline";
}

function share(shtURL, title_o) {
  let title = encodeURI(title_o)
  let url = encodeURI(shtURL);
  let tweet = document.getElementById("tweet");
  let facebook = document.getElementById("facebook");
  let hashtags = w_hashtags;
  tweet.src = "https://platform.twitter.com/widgets/tweet_button.html?size=m&url=" + shtURL + "&related=9holotpk&text=" + title + hashtags;
  document.getElementsByTagName('iframe')[1].parentNode.appendChild(tweet);

  facebook.src = "https://www.facebook.com/plugins/share_button.php?href=" + shtURL + "&layout=button&size=small&mobile_iframe=true&width=60&height=20&appId";
  document.getElementsByTagName('iframe')[0].parentNode.appendChild(facebook);
}

function show_options() {
  var x = document.getElementById("myDIV");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function save_optionsX() {
  let tag = document.getElementById('tag').checked;
  let sharebt = document.getElementById('sharebt').checked;
  let show_button = document.getElementById('shareX');

  if (sharebt) {
    show_button.style.display = "block";
  } else {
    show_button.style.display = "none";
  }
  // define objects
  var twitterTag = {
    name: "#",
    value: tag,
  }
  var sharebutton = {
    name: "Facebook, Twitter",
    value: sharebt,
  }
  // store the objects
  browser.storage.local.set({twitterTag, sharebutton})
  .then(setItem, onError);
}

function setItem() {
  // console.log("OK");
}

function onError(error) {
  console.log(`Error: ${error}`);
}



