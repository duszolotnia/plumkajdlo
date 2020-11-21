function getRadioValue(name, allowedVallues=[]){
  var radios = document.getElementsByName(name);
  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      //console.log("OO, znalazlem cos dla " + name + "=> " + radios[i].value);
      if(!allowedVallues){
        //console.log("CHECKED: " + radios[i].value);
        return radios[i].value;
      }
      else if(allowedVallues.includes(radios[i].value)){
        //console.log("CHECKED: " + radios[i].value);
        return radios[i].value;
      }
    }
  }
  //console.log("Nie znalazlem zaznaczonego pola");
  return allowedVallues[0];
}

function saveOptions(e) {
    e.preventDefault();
    chrome.storage.sync.set({
      nick: document.querySelector("#nick").value,
      color: document.querySelector("#color").value,
      use_sounds: parseInt(getRadioValue("use_sounds", ['1', '0'])),
      sound: getRadioValue("sound", [ "cheerful.mp3", "strzala.mp3", "deduction.mp3"]),
      highlight: getRadioValue("highlight", ["full", 'partial', 'none']),
      volume: (parseFloat(document.querySelector("#volume").value) / 100)
    });

    alert("Ustawienia zapisano!");

    // at the end stop current wait between main() executions and 
    // run it right away with new parameters
    var gettingPage = chrome.runtime.getBackgroundPage();
    gettingPage.then(w => {
      w.resetCurrentTimeout();
    });

    
  }
  
  function restoreOptions() {
  
    function setCurrentChoice(result) {
      //console.log("Wczytano nastepujace ustawienia...");
      //console.log(result);
      // Display currently stored settings
      document.querySelector("#nick").value = result.nick || ""; //username
      document.querySelector("#color").value = result.color || "#3E9DBD"; // highlight color
      document.querySelector("#volume").value = result.volume*100 || 30; // volume level

      // Does currently we use sound?
      if(result.use_sounds === 0)
        document.querySelector("#use_sounds_1").checked = true;
      else
        document.querySelector("#use_sounds_0").checked = true;

      // Set currently used sound
      if(result.sound == "deduction.mp3")
        document.querySelector("#sound_2").checked = true;
      else if (result.sound == "cheerful.mp3")
        document.querySelector("#sound_1").checked = true;
      else // set default sound strzała
        document.querySelector("#sound_0").checked = true;

      // Set current policy on highlighting text
      if(result.highlight == "none")
        document.querySelector("#highlight_2").checked = true;
      else if (result.highlight == "partial")
        document.querySelector("#highlight_0").checked = true;
      else // full is default setting
        document.querySelector("#highlight_1").checked = true;

      let slider = document.querySelector("#volume");
      let volume_display = document.querySelector("#volume-display");
      volume_display.textContent = slider.value;
      slider.oninput = function(){
        volume_display.textContent = this.value;
      }
      
    }
  
    chrome.storage.sync.get(["nick", "color", "use_sounds", "sound", "highlight", "volume"], setCurrentChoice);
  }
  
  function testNotification(){
    var tmpSettings = {
      nick: document.querySelector("#nick").value,
      color: document.querySelector("#color").value,
      use_sounds: parseInt(getRadioValue("use_sounds", ["1","0", 1, 0])),
      sound: getRadioValue("sound", [ "cheerful.mp3", "strzala.mp3", "deduction.mp3"]),
      highlight: getRadioValue("highlight", ["full", 'partial', 'none']),
      volume: (parseFloat(document.querySelector("#volume").value) / 100)
    }

    chrome.runtime.getBackgroundPage(function (win){
        //console.log("Temporary settings used:");
        //console.log(tmpSettings)
        if(tmpSettings.use_sounds)
          win.showNotification("https://braterstwo.eu|test-00", "To jest powiadomienie testowe!", "Ja grab, ja grab. Wisla wisla jak mnie słyszysz?\nKliknij we mnie aby przejść na stronę braterstwa.\n\nPS Nie zapomnij zapisać ustawień ;)", "../media/"+tmpSettings.sound, tmpSettings.volume);
        else
          win.showNotification("https://braterstwo.eu|test-00", "To jest powiadomienie testowe!", "Ja grab, ja grab. Wisla wisla jak mnie słyszysz?\nKliknij we mnie aby przejść na stronę braterstwa.\n\nPS Nie zapomnij zapisać ustawień ;)");
      
    });
  }

  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);
  document.querySelector("#powiadomienie").addEventListener("click", testNotification);