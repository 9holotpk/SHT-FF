// DEV. EXTENTION BY iTON // => POPUP.JS
// NOTE: Click to Shorten URL

// # Event
document.getElementById("qrcode-canvas").addEventListener("click", save_qrcode);
document.getElementById("optionsX").addEventListener("click", show_options);
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("tag").addEventListener("click", save_optionsX);
document.getElementById("sharebt").addEventListener("click", save_optionsX);
document.getElementById("qrcbt").addEventListener("click", save_optionsX);
document.getElementById("darkmode").addEventListener("click", save_optionsX);
document.getElementById("hashtag").addEventListener("keyup", save_optionsX);
document.getElementById("atcopy").addEventListener("click", save_optionsX);
document.getElementById("qrcodeurlbt").addEventListener("click", save_optionsX);
document.getElementById("complete").addEventListener("click", copy);
document.getElementById("copped").addEventListener("click", copy);

document.getElementById("tweetbt").addEventListener("click", shareToTW);
document.getElementById("facebookbt").addEventListener("click", shareToFB);

// # Value
let w_hashtags = "&hashtags=iShortener";
let copy_now = false;
let qrcode_url = false;
let share_now = false;
let urlshort = '';

let tweetbt = '';
let facebookbt = '';

// # Onload
onGot();

function onGot() {
  urlshort = '';
  browser.tabs.query(
    { active: true, lastFocusedWindow: true },
    function (tabs) {
      TAB_URL = tabs[0].url;
      TITLE = tabs[0].title;
      if (TAB_URL) {
        let URL_RES = TAB_URL.substring(0, 4);
        if (URL_RES === "http") {
          browser.runtime.sendMessage({
            script: "shortenLink",
            tab_url: TAB_URL,
            title: TITLE,
          });
        } else {
          document.getElementById("loading").style.display = "none";
          document.getElementById("faq").style.display = "inline";
          document.getElementById("noURL").style.display = "block";
          document.getElementById("shareY").style.display = "none";
          document.getElementById("qrcX").style.display = "none";
        }
      }
    }
  );
}

browser.runtime.onMessage.addListener(function (request) {
  let resultSht = request;
  if (resultSht.shortLink) {
    setURLshorten(resultSht.shortLink, resultSht.title, resultSht.longLink);
  }
});

function checkDNT() {
  console.log("doNotTrack", window.navigator.doNotTrack);
  let dnt = window.navigator.doNotTrack;
  if (dnt == "1") {
    document.getElementById("dnt").style.display = "block";
    document.getElementById("shareY").style.display = "none";
  } else {
    document.getElementById("shareY").style.display = "block";
    document.getElementById("dnt").style.display = "none";
  }
}

function restore_options() {
  let manifestData = browser.runtime.getManifest();
  let version = document.getElementById("version");
  let getting = browser.storage.local.get([
    "twitterTag",
    "sharebutton",
    "qrcode",
    "mode",
    "hashtag",
    "autocopy",
    "qrcodeurl"
  ]);

  getting.then(onGotX, onError);
  version.textContent = manifestData.version;
}

function onGotX(items) {
  let tag = document.getElementById("tag");
  let sharebt = document.getElementById("sharebt");
  let qrcbt = document.getElementById("qrcbt");
  let darkbt = document.getElementById("darkmode");
  let hashtag = document.getElementById("hashtag");
  let atcopy = document.getElementById("atcopy");
  let qrcodeurlbt = document.getElementById("qrcodeurlbt");

  if (items.twitterTag) {
    tag.checked = items.twitterTag.value;
    if (items.twitterTag.value == true) {
      w_hashtags = "&hashtags=" + items.hashtag.value;
      hashtag.disabled = false;
      hashtag.value = items.hashtag.value;
    } else {
      w_hashtags = "";
      hashtag.disabled = true;
    }
  } else {
    tag.checked = true;
  }

  if (items.sharebutton) {
    sharebt.checked = items.sharebutton.value;
    if (items.sharebutton.value) {
      // show_button.style.display = "block";
      share_now = true;
    } else {
      // show_button.style.display = "none";
      share_now = false;
    }
  } else {
    sharebt.checked = true;
    share_now = true;
  }

  if (items.qrcode) {
    qrcbt.checked = items.qrcode.value;
    let show_qrc = document.getElementById("qrcX");
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
      document.getElementById("theme").classList.add("darkmode");
    } else {
      document.getElementById("theme").classList.remove("darkmode");
    }
  } else {
    darkbt.checked = false;
  }

  if (items.autocopy) {
    atcopy.checked = items.autocopy.value;
    if (items.autocopy.value) {
      atcopy.checked = true;
      copy_now = true;
    } else {
      atcopy.checked = false;
      copy_now = false;
    }
  } else {
    atcopy.checked = true;
    copy_now = true;
  }

  if (items.qrcodeurl) {
    qrcodeurlbt.checked = items.qrcodeurl.value;
    if (items.qrcodeurl.value) {
      qrcodeurlbt.checked = true;
      qrcode_url = true;
    } else {
      qrcodeurlbt.checked = false;
      qrcode_url = false;
    }
  } else {
    qrcodeurlbt.checked = true;
    qrcode_url = true;
  }
}

function setURLshorten(shtURL, title, LgURL) {
  let input = document.getElementById("url");
  if (shtURL && shtURL != undefined && shtURL.includes("https")) {
    let shtURLcut;
    urlshort = shtURL.slice(8);
    shtURLcut = shtURL;

    hide();
    input.value = shtURLcut;
    if (copy_now) {
      copy();
    }
    if (share_now) {
      document.getElementById("shareY").style.display = "block";
    }
    share(shtURLcut, title, LgURL);
    genQRC(shtURL);
    input.blur();
  } else {
    document.getElementById("loading").style.display = "none";
    document.getElementById("faq").style.display = "inline";
    document.getElementById("errorservice").style.display = "block";
    document.getElementById("shareY").style.display = "none";
    document.getElementById("qrcX").style.display = "none";
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
  let complete = document.getElementById("complete");
  let copped = document.getElementById("copped");

  let copyText = document.querySelector("#url");

  complete.style.display = "none";
  copped.style.display = "inline";

  copyText.select();
  document.execCommand("copy");
}

function hide() {
  let load = document.getElementById("loading");
  let complete = document.getElementById("complete");

  load.style.display = "none";
  complete.style.display = "inline";
}

function share(shtURL, title_o, lgURL) {
  let title = encodeURI(title_o);
  let url = encodeURI(shtURL);
  let hashtags = w_hashtags;

  tweetbt =
    "https://twitter.com/intent/tweet?size=m&url=" +
    shtURL +
    "&related=9holotpk&text=" +
    title +
    hashtags;

  facebookbt = "https://www.facebook.com/sharer/sharer.php?u=" + lgURL;
}

function shareToTW() {
  browser.tabs.create({
    url: tweetbt
  });
}

function shareToFB() {
  browser.tabs.create({
    url: facebookbt
  });
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
    "about:addons",
    "_blank" // <- This is what makes it open in a new window.
  );
}

function save_optionsX() {
  let tag = document.getElementById("tag").checked;
  let sharebt = document.getElementById("sharebt").checked;
  let show_button = document.getElementById("shareY");
  let qrcbt = document.getElementById("qrcbt").checked;
  let show_qrc = document.getElementById("qrcX");
  let darkbt = document.getElementById("darkmode").checked;
  let hashtag_in = document.getElementById("hashtag");
  let atcopy = document.getElementById("atcopy").checked;
  let qrcodeurlbt = document.getElementById("qrcodeurlbt").checked;

  if (!tag) {
    hashtag_in.value = "iShortener";
    hashtag_in.disabled = true;
  } else {
    hashtag_in.disabled = false;
  }

  if (qrcbt) {
    show_qrc.style.display = "block";
  } else {
    show_qrc.style.display = "none";
  }

  if (darkbt) {
    document.getElementById("theme").classList.add("darkmode");
  } else {
    document.getElementById("theme").classList.remove("darkmode");
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
  };
  var hashtag = {
    name: "Hashtag",
    value: hashtag_in.value,
  };
  var sharebutton = {
    name: "Facebook, Twitter",
    value: sharebt,
  };
  var qrcode = {
    name: "QR Code",
    value: qrcbt,
  };

  var mode = {
    name: "Mode",
    value: darkbt,
  };

  var autocopy = {
    name: "autocopy",
    value: atcopy,
  };

  var qrcodeurl = {
    name: "qrcodeurl",
    value: qrcodeurlbt,
  };

  // store the objects
  browser.storage.local
    .set({ twitterTag, sharebutton, qrcode, mode, hashtag, autocopy, qrcodeurl })
    .then(setItem, onError);
}

function save_qrcode() {
  var canvas = document.getElementById("qrcode-canvas");
  var gh = '';

  if (qrcode_url) {
    var canvas_draft = document.getElementById("qrcode-canvas-draft");
    var context = canvas_draft.getContext("2d");

    canvas_draft.width = 200;
    canvas_draft.height = 250;

    context.fillStyle = "white";
    context.fillRect(0, 0, 220, 250);
    context.drawImage(canvas, 32.5, 32.5);

    context.font = "16pt monospace";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText(urlshort, 100, 200);

    gh = canvas_draft.toDataURL('png');
  } else {
    gh = canvas.toDataURL('png');
  }

  var a = document.createElement('a');
  a.href = gh;
  a.download = urlshort + '.png';

  a.click()
}

function setItem() {
  // console.log("OK");
}

function onError(error) {
  console.log(`Error: ${error}`);
}
