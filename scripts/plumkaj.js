//TODO: IDEA - extend notifications to watching some thread! 
//TODO: IDEA - add content_script to color mentions in comments!

// Global variables
var currentTimeout = false; //keeps current setTimeout id
var lastCheckedDatetime = false; //keep time of last data grab no to repeat mentions. initialize with now
var SETTINGS = {
  nick: false,
  volume: 0.3,
  sound: "strzala.mp3",
  color: "#3E9DBD",
  use_sounds: 1,
  highlight: "full",  
}
const SPLIT_CHAR = "|";
const VERSION = "1.1.1";
const MENTION_CHAR = "@";
const AVAIL_TITLES = [
  "Ktoś Cię oznaczył w komentarzu!",
  "Halo haloo! Tęsknimy! Ktoś już się o ciebie upomniał ;)",
  "Czołem Bracie! Ktoś o Tobie wspomniał w komentarzu!",
  "Psst... Ktoś o Tobie wspomniał na forum",
  "Celnie wypatrzyłem, że jest o Tobie głośno ;)"
];
//TESTING - set last checked date to a week ago
//lastCheckedDatetime.setHours(lastCheckedDatetime.getHours() - 2);

// Opening settings page on icon click
function openPage() {
  browser.tabs.create({
    url: "options.html"
  });
}

function playSound(sound, vol=0.3){
  // Play sound...
  var sound = new Howl({
    src: [sound], //TODO: get from settings, later enable user to umpolad own .mp3 to local storage
    autoplay: true,
    loop: false,
    volume: vol
  });
  sound.play();
}

function resetCurrentTimeout(){
  // try to clear currentTimeout only when it's in progress
  if(currentTimeout){
    clearTimeout(currentTimeout);
    //console.log("Przerwano czekanie. Wykonywanie main() od razu...");
    main();
  }
}

function tableToJson(table){
  var data = [];

  // first row needs to be headers
  var headers = [];
  for (var i=0; i<table.rows[0].cells.length; i++) {
      headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/<\/?strong>/gi,'');
  }
  // There will be new parameter - link extracted from first column
  headers[i]="link";

  // go through cells
  for (var i=1; i<table.rows.length; i++) {
      var tableRow = table.rows[i];
      var rowData = {};

      for (var j=0; j<tableRow.cells.length; j++) {
        // If its first cell extract link and remove slugs
        if(!j) rowData["link"] = tableRow.cells[j].innerHTML.match(/<\/?a[^>]*>/gi,'')[0].match(/\/.*[\w\d\#]/gi)[0].replace("#amv", "");
        rowData[ headers[j] ] = tableRow.cells[j].innerHTML.replace(/<\/?a[^>]*>/gi,'').replace(/<span[^]*<\/span>[^<]?/gi,'');
      }
      data.push(rowData);
  }       

  return data;
}

async function getActiveTopics(){
  const url = "https://braterstwo.eu/tforum/aktywne/";
  var table;

  await fetch(url, {credentials: "omit"})
    .then(resp => resp.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/html"))
    .then(xmlData => {
      table = xmlData.getElementsByTagName("table");
      if(!table){
        console.log("Error: No table found in XML Document");
      }
      table = tableToJson(table[0]);
    })

  //console.log("Tematy:", table);
  return table;
}

async function getNewComments(topic){
  const url = "https://braterstwo.eu" + topic.link;
  var newComments = [];
  var XMLComments;
  var tmpComment;

  await fetch(url, {credentials: "omit"})
    .then(resp => resp.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/html"))
    .then(xmlData => {
      XMLComments = xmlData.getElementsByClassName("comment");

      for(let i=(XMLComments.length-1); i >= 0; i--){
        tmpComment = parseComment(XMLComments[i]);
        if(tmpComment.datetime < lastCheckedDatetime)
          break;
        else
          newComments.push(tmpComment);
      }
    })
  
  return newComments;
}

function showNotification(id, title, message, sound=false, volume=0.3){
  //console.log("Wysylam powiadomienie...");
  browser.notifications.create(id, {
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/braterstwo1-48.png"),
    "title": title,
    "message": message,
  });

  if(sound){
    playSound(sound, volume);
  }
}

function parseComment(xmlComment){
  var comment = {
    user: "",
    datetime: new Date(0),
    content: "",
    id: ""
  };
  var tmpContent;
  let [d, t] = xmlComment.getElementsByClassName("time")[0].innerHTML.match(/(\d{2}.){2}\d{4} \d{1,2}:\d{1,2}/gi,'')[0].split(" ");
  d = d.split(".");
  t = t.split(":");

  comment.user = xmlComment.getElementsByClassName('user')[0].innerHTML.match(/>(.)*</gi)[0].slice(1, -1);
  //console.log("Comment datetime: ", d, t);
  // new Date( year, month-1, day, hours, minutes )
  comment.datetime = new Date(d[2], d[1]-1, d[0], t[0], t[1]);
  tmpContent = xmlComment.getElementsByTagName("div");
  comment.content = tmpContent[tmpContent.length - 1].innerHTML;
  comment.id = xmlComment.id;

  //console.log("Parsed this comment: ", JSON.stringify(comment));

  return comment;
}

async function checkNewPrivateMessages(){
  console.log("Sprawdzam nowe wiadomości prywatne");
  const url = "https://braterstwo.eu/priv/";
  var privs;
  var id = url+ SPLIT_CHAR + parseInt((Math.random() * 10000)+1);
  
  fetch(url, {credentials: "include"})
    .then(resp => resp.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/html"))
    .then(xmlData => {
      privs = xmlData.getElementsByTagName("tr");

      if(privs.length){
        for(let i=(privs.length-1); i >= 0; i--){
          if(privs[i].innerText.includes("(nowa)")){

            let username = privs[i].innerText.match(/.*\n/gi)[1].trim();
            let msg = "Masz nową wiadomość prywatną od \""+ username +"\".\nKLiknij we mnie aby przejść do zakładki wiadomości prywatne na braterstwie";

            if(SETTINGS.use_sounds) showNotification(id, "Nowa wiadomość prywatna", msg, "../media/"+SETTINGS.sound, SETTINGS.volume);
            else showNotification(id, "Nowa wiadomość prywatna", msg)
          }
        }
      }else console.log("You have no private message threads.")

      console.log("Private messages check end.");

    })
}

function parseTopicTime(topic){
  var parts = topic.ostatnie.match(/\d{1,2}\D/g); //ex. "1h21m" => ["1h", "21m"], "17h" => ["17h"], "17h2m" => ["17h", "2m"]
  let literal, value;
  topic.lastDatetime = new Date(); // set last update datetime to now

  // subtract last update time from now time
  parts.forEach(part => { // Max 2 parts
    literal = part.slice(-1);
    value = parseInt(part.slice(0, -1));
    switch(literal){ // m, h, d, w
      case 'm':
        topic.lastDatetime.setMinutes(topic.lastDatetime.getMinutes() - value); 
        break;
      case 'h':
        topic.lastDatetime.setHours(topic.lastDatetime.getHours() - value); 
        break;
      case 'd':
        topic.lastDatetime.setDate(topic.lastDatetime.getDate() - value); 
        break;
      case 'w':
        topic.lastDatetime.setDate(topic.lastDatetime.getDate() - (value*7)); 
        break;
    }
  });
}

function pickRandomTitle(){
  let randomId = Math.floor(Math.random() * AVAIL_TITLES.length);
  return AVAIL_TITLES[randomId];
}

async function getTopicDetails(tid){
  /* Returns object {
    lastCommentDatetime: Date object with datetime of last comment
    lastCommentUsername: str - username of last user to comment
    title: str - topic title
  } */
  var topic = {
    lastCommentUsername: "nouser",
    lastCommentDatetime: new Date(0),
    title: "notitle"
  };
  var url = "https://braterstwo.eu/tforum/t/"+tid+"/";
  var comment;
  var offset = 1;

  await fetch(url, {credentials: "omit"}) // no need for credentials since only common sections can be followed
    .then(resp => resp.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/html"))
    .then(xmlData => {
      var comments = xmlData.getElementsByClassName("comment");
      if(comments.length){
        while(comments.length >= offset){
          comment = parseComment(comments[comments.length-offset]);
          topic.lastCommentUsername = comment.user;
          topic.lastCommentDatetime = comment.datetime;
          topic.title = xmlData.querySelector("h4").textContent;
          offset = offset + 1;
          if(topic.lastCommentUsername.trim() != SETTINGS.nick.trim()) break;
        }
      }
    });

  return topic;
}

// ---------------------------------
//             MAIN LOOP
// ---------------------------------
async function main(){
  // right away set currentTimeout to false and clear
  // SETTINGS_CHANGED FLAG indicate execution in progress
  currentTimeout = false;
  // get last update time and settings
  let letgettingLastCheckedDatetime = browser.storage.local.get("lastCheckedDatetime");
  await letgettingLastCheckedDatetime.then(res => {
    if(res.lastCheckedDatetime == undefined)
      lastCheckedDatetime = new Date(); // set to now, but if settings will be empty do not save it
    else 
      lastCheckedDatetime = res.lastCheckedDatetime;
  });

  let gettingSettings = browser.storage.sync.get(["nick", "color", "use_sounds", "sound", "highlight", "volume"]);
  await gettingSettings.then(res => {
    SETTINGS.nick = res.nick;
    SETTINGS.color = res.color;
    SETTINGS.use_sounds = res.use_sounds;
    SETTINGS.sound = res.sound;
    SETTINGS.highlight = res.highlight;
    SETTINGS.volume = res.volume;
  })
  
  // if nick not found open settings page and quit
  if(!SETTINGS.nick) {
    openPage();
    currentTimeout = setTimeout(main, 300000); // every 5 minutes by default
    return 1;
  }
  var topics;
  var newComments = [];

  // async checking for new private messages
  checkNewPrivateMessages();

  console.log("Teraz jest " + new Date());
  console.log("Ostatnie sprawdzenie forum było " + lastCheckedDatetime);

  function handleMessage(request, sender, sendResponse) {
      if(request.message == 'send settings please')
        sendResponse({settings: SETTINGS})
  }
  browser.runtime.onMessage.addListener(handleMessage);

  topics = await getActiveTopics();
  // Parse times to valid Date objects and remove old topics from list
  for(let i=0; i<topics.length; i++){
    parseTopicTime(topics[i]);
    //console.log(topics[i].temat + " - " + topics[i].lastDatetime.toString());
    if(topics[i].lastDatetime < lastCheckedDatetime){
      topics = topics.slice(0, i); // remove further topics
      break;
    }
  }

  if(topics.length)
    console.log("Topics with new updates: ", topics);
  else
    console.log("No new comments since last update.");

  for(let i=0; i<topics.length; i++){
    //console.log("Parsing topic: ", JSON.stringify(topics[i]));

    // check new comments from this topic
    newComments = await getNewComments(topics[i]);

    // for each comment check for mention in format @nick
    //console.log("Comments: ", newComments);
    newComments.forEach(comment => {
      if(comment.content.toLowerCase().includes( (MENTION_CHAR + SETTINGS.nick).toLowerCase() )){
        let msg = "Użytkownik \"@" + comment.user + "\"\n" + 
          "oznaczył cię w komentarzu w temacie: " +
          "\"" + topics[i].temat + "\"\n" +
          "w sekcji: \"" + topics[i].sekcja + "\"\n\n" + 
          "Kliknij w okienko by otworzyć ten temat w nowej karcie.";

        // set notification ID to have url of topic to open
        // add random integer from range [1-10,000) so even in mentioned multiple times in single topic ID will be unique
        let id = "https://braterstwo.eu"+topics[i].link+"#"+comment.id + SPLIT_CHAR + parseInt((Math.random() * 10000)+1);

        //console.log(SETTINGS);
        if(SETTINGS.use_sounds) showNotification(id, pickRandomTitle(), msg, "../media/"+SETTINGS.sound, SETTINGS.volume);
        else showNotification(id, pickRandomTitle(), msg);
      }
    }); //forEach comment end
  } // forEach topic end

  // Check for updates in followed topics
  console.log("Checking followed topics...");
  let gettingTopics = browser.storage.local.get("followedTopics");
  let freezeLastCheckedDatetime = lastCheckedDatetime;

  gettingTopics.then(res => {
    if(res.followedTopics == undefined){
        // no topics to check - for better of universe let's set it to proper empty list
        browser.storage.local.set({ followedTopics: [] });
    }else if(res.followedTopics.length){

        // if at least 1 topic is followed check if there were any updates
        for(let i=0; i<res.followedTopics.length; i++){

          getTopic = getTopicDetails(res.followedTopics[i]);
          getTopic.then(topic => {
            let id, msg;
            //console.log("Topic primise: ", topic);
            if(topic.lastCommentDatetime > freezeLastCheckedDatetime){
              //console.log("Sending notification about topic: ", topic.title);
              id = "https://braterstwo.eu/tforum/t/"+res.followedTopics[i]+"/#amv"+SPLIT_CHAR+"topicNotify";
              msg = "Użytkownik @" + topic.lastCommentUsername + " dodał komentarz do tematu: " +
              "\""+topic.title+"\"\n\n" + 
              "Kliknij mnie, aby otworzyć ten wątek w nowej karcie.";

              if(SETTINGS.use_sounds) showNotification(id, "Nowy komentarz w obserwowanym wątku", msg, "../media/"+SETTINGS.sound, SETTINGS.volume);
              else showNotification(id, "Nowy komentarz w obserwowanym wątku", msg);
            }

          });
        }

    } 
  });

  console.log("Job well done");
  currentTimeout = setTimeout(main, 120000); // every 2 minutes by default
  lastCheckedDatetime = new Date(); // update last checked date
  browser.storage.local.set({
    lastCheckedDatetime: lastCheckedDatetime
  });
} //main() END


browser.browserAction.onClicked.addListener(openPage);
browser.notifications.onClicked.addListener(function(notificationId) {
  //console.log('Notification ' + notificationId + ' was clicked by the user');
  let notificationUrl = notificationId.split(SPLIT_CHAR)[0];
  //browser.windows.create({url: notificationUrl});
  browser.tabs.create({url: notificationUrl});
});
main();
