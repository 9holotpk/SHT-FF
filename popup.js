// DEV. EXTENTION BY iTON // => POPUP.JS
// NOTE: Click to Shorten URL

  function setURLshorten(shtURL) {
    // console.log(shtURL);
    let input = document.getElementById("url");
    if (shtURL != undefined) {
      hide();
      input.value = shtURL;
      copy();
      
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

    load.style.display  = "none";
    complete.style.display = "inline";
  }

