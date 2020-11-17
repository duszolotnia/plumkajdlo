function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.25)';
    }
    return 'rgba(62, 157, 189, 0.4)';
}

function sanitizeString(str){
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
}

async function main(){
    var SETTINGS = {};
    var gettingSettings = browser.runtime.sendMessage({message: "send settings please"});
    await gettingSettings.then( ret => { 
        SETTINGS = ret.settings;
        //console.log("Got thiese settings: ", SETTINGS);
    })

    SETTINGS.nick = sanitizeString(SETTINGS.nick);

    if(SETTINGS.highlight == 'none') return 0;

    // Get all comments from topic
    let comments = document.getElementsByClassName("comment");
    let searchTag = "@" + SETTINGS.nick.toLowerCase();

    //console.log("Szukam w komentarzu: " + searchTag);

    for(let i=0; i < comments.length; i++){
        //console.log(comments[i].innerText);
        if(comments[i].innerText.toLowerCase().search(searchTag) > -1){
            let re = new RegExp("@"+SETTINGS.nick, "i");
            
            if(SETTINGS.highlight == "full"){
                // highlight full comment
                let spanned = "<span style='font-weight:bold'>@"+SETTINGS.nick+"</span>";
                comments[i].style = "background-color: " + hexToRgbA(SETTINGS.color) + "; padding: 10px 7px; margin: -7px; margin-top: 12px; border-radius: 5px;";

                // nick is sanitized - using this method to preserve other HTML that often in present in this comments
                comments[i].innerHTML = comments[i].innerHTML.replace(re, spanned);
            }else if(SETTINGS.highlight == 'partial'){
                // select only tag to highlight
                let spanned = "<span style='font-weight:bold; background-color: "+ hexToRgbA(SETTINGS.color) +"; padding: 1px 3px; border-radius: 4px;'>@"+SETTINGS.nick+"</span>";
                // nick is sanitized - using this method to preserve other HTML that often in present in this comments
                comments[i].innerHTML = comments[i].innerHTML.replace(re, spanned);                
            }
        }
    }
}

main();