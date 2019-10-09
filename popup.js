// DEV. EXTENTION BY iTON // => POPUP.JS
// NOTE: Click to Shorten URL
// UPDATE:  14/06/2018  - Optimize update and Bug fixed.
//          12/06/2019  - Add QR code.
//          13/06/2019  - Add Dark Mode.



// # Event
document.getElementById('optionsX').addEventListener('click', show_options);
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('tag').addEventListener('click', save_optionsX);
document.getElementById('sharebt').addEventListener('click', save_optionsX);
document.getElementById('qrcbt').addEventListener('click', save_optionsX);
document.getElementById('darkmode').addEventListener('click', save_optionsX);

// document.getElementById('about').addEventListener('click', gotoAbout);

// # Value
let w_hashtags = "&hashtags=iShortener";

// # Onload
onGot();

function onGot() {
  browser.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
    TAB_URL = tabs[0].url;
    TITLE = tabs[0].title;
    console.log('Page: (' + tabs[0].id + ') ' + TITLE);
    if (TAB_URL) {
      let URL_RES = TAB_URL.substring(0, 4);
      if (URL_RES === 'http') {
        browser.runtime.sendMessage({ script: "shortenLink", tab_url: TAB_URL, title: TITLE });
      } else {
        document.getElementById("loading").style.display = "none";
        document.getElementById("faq").style.display = "inline";
        document.getElementById("noURL").style.display = "block";
        document.getElementById("shareX").style.display = "none";
        document.getElementById("dnt").style.display = "none";
        document.getElementById("qrcX").style.display = "none";
      }
    }
  });
}

browser.runtime.onMessage.addListener(
  function (request) {
    let resultSht = request;
    if (resultSht.shortLink) {
      setURLshorten(resultSht.shortLink, resultSht.title);
      // checkDNT();
    }
  }
);

function checkDNT() {
  console.log('doNotTrack', window.navigator.doNotTrack);
  // alert("doNotTrack");
  let dnt = window.navigator.doNotTrack;
  if (dnt == "1") {
    // document.getElementById("shareX").style.display = "none";
    document.getElementById("dnt").style.display = "block";
    document.getElementById("shareY").style.display = "none";
  } else {
    document.getElementById("shareY").style.display = "block";
    document.getElementById("dnt").style.display = "none";
  }
}

function restore_options() {
  let manifestData = browser.runtime.getManifest();
  let version = document.getElementById('version');
  let getting = browser.storage.local.get(["twitterTag", "sharebutton", "qrcode", "mode"]);

  getting.then(onGotX, onError);
  version.textContent = '「 ver. ' + manifestData.version + ' 」';

}

function onGotX(items) {
  let tag = document.getElementById('tag');
  let sharebt = document.getElementById('sharebt');
  let qrcbt = document.getElementById('qrcbt');
  let darkbt = document.getElementById('darkmode');

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

  if (items.qrcode) {
    qrcbt.checked = items.qrcode.value;
    let show_qrc = document.getElementById('qrcX');
    if (items.qrcode.value) {
      show_qrc.style.display = "block";
    } else {
      show_qrc.style.display = "none";
    }
  } else {
    qrcbt.checked = true;
  }

  if (items.mode) {
    darkbt.checked = items.mode.value;
    if (items.mode.value) {
      document.getElementById("theme").classList.add('darkmode');
    } else {
      document.getElementById("theme").classList.remove('darkmode');
    }
  } else {
    darkbt.checked = false;
  }
}

function setURLshorten(shtURL, title) {
  let input = document.getElementById("url");
  if (shtURL != undefined) {
    hide();
    input.value = shtURL;
    copy();
    share(shtURL, title);
    genQRC(shtURL);
    input.blur()
  }
}

function genQRC(url) {
  var canvas = document.getElementById("qrcode-canvas");
  var QRC = qrcodegen.QrCode;
  var qr0 = QRC.encodeText(url, QRC.Ecc.MEDIUM);
  var scale = 5;
  qr0.drawCanvas(scale, 1, canvas);
  canvas.style.removeProperty("display");
}

function copy() {
  let copyText = document.querySelector("#url");
  copyText.select();
  document.execCommand("copy");
}

function hide() {
  let load = document.getElementById("loading");
  let complete = document.getElementById("complete");

  load.style.display = "none";
  complete.style.display = "inline";
  checkDNT();
}

function share(shtURL, title_o) {
  // checkDNT();
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

function gotoAbout() {
  window.open(
    'about:addons',
    '_blank' // <- This is what makes it open in a new window.
  );

}

function save_optionsX() {
  let tag = document.getElementById('tag').checked;
  let sharebt = document.getElementById('sharebt').checked;
  let show_button = document.getElementById('shareX');
  let qrcbt = document.getElementById('qrcbt').checked;
  let show_qrc = document.getElementById('qrcX');
  let darkbt = document.getElementById('darkmode').checked;

  if (qrcbt) {
    show_qrc.style.display = "block";
  } else {
    show_qrc.style.display = "none";
  }

  if (darkbt) {
    document.getElementById("theme").classList.add('darkmode');
  } else {
    document.getElementById("theme").classList.remove('darkmode');
  }

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
  var qrcode = {
    name: "QR Code",
    value: qrcbt,
  }

  var mode = {
    name: 'Mode',
    value: darkbt
  }

  console.log(mode);
  // store the objects
  browser.storage.local.set({ twitterTag, sharebutton, qrcode, mode })
    .then(setItem, onError);
}

function setItem() {
  // console.log("OK");
}

function onError(error) {
  console.log(`Error: ${error}`);
}



