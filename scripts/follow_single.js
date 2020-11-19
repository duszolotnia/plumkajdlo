/* Inserts "FOLLOW" icon on single topic page 
 * must check if topic is in one of the 'common' sections */
// nazwy sekcji dostępnych bez zalogowania
var COMMON_SECTIONS = [
    "Ogólne",
    "Wydarzenia",
    "Sportowe",
    "Osiągnięcia",
    "WPA",
    "Badania lekarskie",
    "Strzelnice",
    "Sprzęt",
    "Sklepy",
    "Oferty"
];
var topicId = document.querySelector("a[title='Pokazuj nowe wypowiedzi']").href.split("=")[1]; 

function modifyFollowButton(isFollowed){
    let fb = document.getElementById("follow-topic");
    if(!isFollowed){
        fb.innerText = "Obserwuj wątek w Plumkadle";
        fb.title = "Kliknij aby otrzymywać powiadomienia o nowych komentarzach!";
    }else{
        fb.innerText = "Nie obserwuj już w Plumkadle";
        fb.title = "Już obserwujesz ten wpis";
    }
}

function handleFollowTopic(event){
    var nowFollowed;
    if(event.type == "mouseup"){
        let getting = browser.storage.local.get("followedTopics");
        getting.then(ret => {
            console.log("Followed topics: ", ret.followedTopics);
            if(ret.followedTopics == undefined){
                // no topics followed and not set - follow
                console.log("Following...");
                ret.followedTopics = [topicId];
                nowFollowed = true;
            }else if(ret.followedTopics.includes(topicId)){
                // topic is followed - unfollow
                console.log("Unfollowing...");
                ret.followedTopics.splice(ret.followedTopics.indexOf(topicId), 1);
                nowFollowed = false;
            }else{
                // topic not followed - follow
                console.log("Following...");
                ret.followedTopics.push(topicId);
                nowFollowed = true;
            }   
            
            browser.storage.local.set({
                followedTopics: ret.followedTopics
            });

            modifyFollowButton(nowFollowed);
        });
    }
}

function main(){
    // insert button with 'syncing' waiting placeholder
    // get status
    //  if following: show it's following
    //  if not: show available to follow
    let followHTML = '<a href="javascript:void(0);" title="Śledź w plumkajdle!" class="btn btn-xs btn-default stat-item" style="padding: 4px 10px;" id="follow-topic">zbieram dane...</a> ';
    document.querySelector("h4").innerHTML = followHTML+document.querySelector("h4").innerHTML;

    // get directly from storage/dont use messaging - it's not 'cached' so no significant speed gain
    let getting = browser.storage.local.get("followedTopics");
    getting.then(ret => {
        if(ret.followedTopics == undefined){
            // no topics followed and not set
            modifyFollowButton(false)
        }else if(ret.followedTopics.includes(topicId)){
            // topic is followed
            modifyFollowButton(true)
        }else{
            // topic not followed
            modifyFollowButton(false)
        }  
    });

    document.getElementById("follow-topic").addEventListener("mouseup", handleFollowTopic);
}

let currentSection = document.getElementById("content").childNodes[0].childNodes[3].text.trim();
console.log("Temat w sekcji: ", currentSection);
if(COMMON_SECTIONS.includes(currentSection)) main();