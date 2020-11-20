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
var bellFull = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAFpOLgnAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAUnSURBVHjaYvz//z8DToAm+RRZnAVZHRLNyMDAwMCEJIBshASysYxICv7DxJnQjPoHM5KBgYGBEZ9rAQAAAP//wiuJE+zA4tL/DAwMDMo4vMDAxsDA4ITm9Cfoxq4l6CoAAAAA//8iz7k4NCG7hRlZDXKQ9jAwMPxFizEY+MPIyMjAwMBwA92mdwwMDFVYbMEIr////0M8CzUJmy0o/kfRRCoAAAAA//8iWRMTAxWBIbEKo6Ap+B8DA8MfXIqOQWlOLMG7FUmdOAMDA8M0KMeAgYGhFE+cZMDYL5FM6MWj4RsDA8NlJgYGBn+owHsGBoafOJwswsDAwM3AwKCDrQTAZUMPNpNgoYOu4TvBnIArfdE+aQAAAAD//yIv65IImBjoAUj0iScDA8MHBgaG6QwMDPLEmPP//38MyWfIRTpSjsKVdmDJAz3YSxgYGHLQLeFEShZiSGx9HOkMV2I1RMo6ZgwMDN+QLXnIwMCgh6WM6yLSAmQ9WgwMDC+g7PvIxfUtHAUNOQkjiYGBYT+ULY8eYb8ZGBg8oGwvKN1OYnAxMzAwKELZtxkYGMqwRTyuGotY/AFb6mLB421lBgYGcyRXOjEwMKSgpb4INP6K4Z3jAQAAAP//7Je9SgNBFIU/FNFGRQKWASuxsUsawcraziewsomikAfwBRIfwypVLPwpYqOC2NgIvoGgjYgiZrW5A8dxNrs3WEjwwjIDOztnz8zcM+eODpPRAfGq8FSBtUrO72EyZ+Yi5MevM3nIyfD9UvMLyArQSYx7GaBffWAz8c1TCiQUKdPR4JZT5kMc2AX4DeQW2LEB58C29fslQRoiqnXxc0sKEv5mGXhzKnEGnEY2FWAduEiBdKM1LivxZ5E1nLGC61GPcGZtRa5OT4xL/9X29t2AfjDZAi6HYNJL1MeLwF28XPMyqDYkyDVwZP0esKcgq5YPmGmfdYIE9mvWVrXk02Q8Bm6E9rPDRHwCzWjJFvIcZIgTR47oU/EI5GRBRufFRO71KxWyxoYczQw4jN5fAW2pnu9t4wsN96DYNVYf1o6VVfl/I/H3QL7Ys4JQiKIoesbEgt0MEZMolIWdxeyFkmLB1oaFZM9GTTYUzYaNncWUBTaalWRho8RCSUojC8uRaDLUmG/xz8/t9ebP/OY/E/1br6Yz77/3zv/3vXvufb/yTf6P7AqIeFR2Bt2rDsAuD7So0fUbJuJkwBZ+ash/gkgMwAbVaanAmQewL3RKNVlMRUSiDMCV2LymZlRO1Dq/tzwQafVCpAv2vYnF0kLIZeAmADceCJQilWe9y80WxTPj5YhMs+MbgB4lT5wB0CKwdmZSlk/tA0CHGL+BOemAgl2w/3YpIhPscK9osz3iV0KLg8Qsn9uhsugd4hmmOo6liCd1RM7556R4IEHsQPOpEz4SKGryNNWlTpRD5RPAg45IlrqzWzxwyUFGNBMkq9wbunaqmacZwCtzwk6BXwPIOeuXkf2Fyl3ug4woPKtWECreLwtrsF661RNLLgDQyBPsXRfZV/lWUmKQNhK0YN9nSds0sEfOlDn6WPm1AIwKfI7Ysc61wsyX1KJSPYA08SWBrxhwLVkBiBN7VFxqiHgOQMwtjqyx4zPsuz+dDYs35SeRAuzLFp1FYF9gOoTDlUT2CLPbZQWPc+M5BL4MuJfTFpS5xwAcARisVmuFANwaXLiu9ZsSjdKlTLYi41RNZXyMcqPoEvim1IW4tVrnI7MMqFl+xTsA6x4UtScZHxQfAiIBEXf7HgBraFcvGJx/twAAAABJRU5ErkJggg==";
var bellEmpty = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAFpOLgnAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAQDSURBVHjaYvz//z8DLsCEzGFkZHzKyMiIEPj//z8DVDfMiH64GJLkTAwNSJKc6JLIdn5nYGB4ieIGfK4FAAAA///CKcmE5AUGZC8w4TQLm1HIrnNEFsemYxVMDKerAAAAAP//wusXomIEyVv/GRkZa6A0M1aXI4U5AwMDw1xcvsYWDzDwh5DzUPzEyMj4n4GBYRc0iBiRaPb///87UBQQAAAAAP//IlkTE8VBDUs9jIyMhugpCZcNEQwMDNcYGBhSGBgYfuMNbxz+mYMij6a4CFsc4spMDAwMDMzUCiVGbKUAckmADGqR1cEjDhp826DO+o9iKgOD1f///3lRYhotvP+jOwWujuZJAwAAAP//IivFUiWrD4glSAnfk5GR8QMjI+N0RkZGeSRx/Aagp3MsaV4bGqMsWLRHoydrrOYQsESDgYHhHRGpGuYiVmzmsOAKHijwZWBgWE3AEuSU85voOKF2iiMU8RzElBZYCwRCEY8UDBwkWFDPwMDwlug4gQJlBgaGQKQwd2JgYHBhYGAogzYutkCLaJjrbzIwMAgP7xwPAAAA///sly0OwkAQhb8WCAhMHZojkRAcohcgkCCQKE6A5ABIJCFBoLkBBgcSDBhSMCM2TZedhZTwN2abJjtf0+578/pj3vURkKLGgVPiPGeJTh3mHRUBfblu5fG6duLGdWAAdEWkQ9VuxywBOAIjy/aTzJSn5kkbWGqs/iGIEbhrDsgKiO+BQseJKgB7B2Qiwy1XnVxcUvh+WwleAQk9e1S8xSh1AGZK0BXoWPtZIAsPgAmKfIJEWULBPNUksPyIJHKvpB6/IsamkbkSYAo0RBMxUAXGBmwDrDMt32GOZvXkabeyhtpv/A8S7we5AQAA///smTFLxEAQhb8JeLbCNSpXWAj2ngeKIFhYC1bWHlheK1hZ2FlZ21haW/kPBLW1sxDEQhEVtFK4WGQWlkVjNrcbT83AEEKS3XkzuzOTt5XE5M94qwZSNRCbMXA0EZFDEbkQkWbOe8UYhx+MSB9YBNrA2G9aWi1gD7jVSpAC0/rsSu9fgSOgM4xANtXIG2AB6AINrZWuLgFvwJl+sx/Egrxe/zvVjuFUDdotMf2qUkrPwNQg9pQFYDoTA2J9AF/O6l56ASbcGhcNyCe040mAhbGtYx2UBZL4pllLJvV6HQCIGWP8C0Yz3GbPyfEh/pKksqw17D3Zv21RGk7VjtEJGBmJUkccWQbudUP2AgDo6FjvytD52+cJZF6LVwoc43dAUER2rNZmIxYQITvzTYG5yMv9QeeZiRWRFeDJ8los7QNbUSLisX9aZLy6We+J5YQ7NXQtdO9X1tgi0gXONSk8ApdkrPhojGRUkw81kBpIvnwMAAMUBJp0IsTrAAAAAElFTkSuQmCC";
var topicId = document.querySelector("a[title='Pokazuj nowe wypowiedzi']").href.split("=")[1]; 

function modifyFollowButton(isFollowed){
    let fb = document.getElementById("follow-topic");
    if(!isFollowed){
        fb.childNodes[2].innerText = "Obserwuj wątek w Plumkajdle";
        fb.title = "Kliknij aby otrzymywać powiadomienia o nowych komentarzach";
        fb.childNodes[1].src = bellEmpty;
    }else{
        fb.childNodes[2].innerText = "Nie obserwuj już w Plumkajdle";
        fb.title = "Już obserwujesz ten wpis";
        fb.childNodes[1].src = bellFull;
    }
}

function handleFollowTopic(event){
    var nowFollowed;
    if(event.type == "mouseup"){
        let getting = browser.storage.local.get("followedTopics");
        getting.then(ret => {
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
            console.log("Followed topics: ", ret.followedTopics);
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
    let followHTML = '<a href="javascript:void(0);" title="Śledź w plumkajdle!" class="btn btn-xs btn-default stat-item" style="padding-top: 3px; padding-right: 7px;" id="follow-topic"> <img style="width:25px" id="'+topicId+'" src="'+bellEmpty+'" alt="bell"/><span style="display:block; float:right; margin: 5px 0px 4px 7px;" id="follow-content">zbieram dane...</span></a> ';
    document.querySelector("h4").innerHTML = followHTML+document.querySelector("h4").innerHTML;

    // get directly from storage/dont use messaging - it's not 'cached' so no significant speed gain
    let getting = browser.storage.local.get("followedTopics");
    getting.then(ret => {
        if(ret.followedTopics == undefined){
            // no topics followed and not set so topic not followed
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