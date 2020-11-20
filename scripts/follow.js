/* Inserts "FOLLOW" button in every topic of given section 
 * also it checks if topic is followed and changes button styles accordingly */
var bellFull = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAFpOLgnAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAUnSURBVHjaYvz//z8DToAm+RRZnAVZHRLNyMDAwMCEJIBshASysYxICv7DxJnQjPoHM5KBgYGBEZ9rAQAAAP//wiuJE+zA4tL/DAwMDMo4vMDAxsDA4ITm9Cfoxq4l6CoAAAAA//8iz7k4NCG7hRlZDXKQ9jAwMPxFizEY+MPIyMjAwMBwA92mdwwMDFVYbMEIr////0M8CzUJmy0o/kfRRCoAAAAA//8iWRMTAxWBIbEKo6Ap+B8DA8MfXIqOQWlOLMG7FUmdOAMDA8M0KMeAgYGhFE+cZMDYL5FM6MWj4RsDA8NlJgYGBn+owHsGBoafOJwswsDAwM3AwKCDrQTAZUMPNpNgoYOu4TvBnIArfdE+aQAAAAD//yIv65IImBjoAUj0iScDA8MHBgaG6QwMDPLEmPP//38MyWfIRTpSjsKVdmDJAz3YSxgYGHLQLeFEShZiSGx9HOkMV2I1RMo6ZgwMDN+QLXnIwMCgh6WM6yLSAmQ9WgwMDC+g7PvIxfUtHAUNOQkjiYGBYT+ULY8eYb8ZGBg8oGwvKN1OYnAxMzAwKELZtxkYGMqwRTyuGotY/AFb6mLB421lBgYGcyRXOjEwMKSgpb4INP6K4Z3jAQAAAP//7Je9SgNBFIU/FNFGRQKWASuxsUsawcraziewsomikAfwBRIfwypVLPwpYqOC2NgIvoGgjYgiZrW5A8dxNrs3WEjwwjIDOztnz8zcM+eODpPRAfGq8FSBtUrO72EyZ+Yi5MevM3nIyfD9UvMLyArQSYx7GaBffWAz8c1TCiQUKdPR4JZT5kMc2AX4DeQW2LEB58C29fslQRoiqnXxc0sKEv5mGXhzKnEGnEY2FWAduEiBdKM1LivxZ5E1nLGC61GPcGZtRa5OT4xL/9X29t2AfjDZAi6HYNJL1MeLwF28XPMyqDYkyDVwZP0esKcgq5YPmGmfdYIE9mvWVrXk02Q8Bm6E9rPDRHwCzWjJFvIcZIgTR47oU/EI5GRBRufFRO71KxWyxoYczQw4jN5fAW2pnu9t4wsN96DYNVYf1o6VVfl/I/H3QL7Ys4JQiKIoesbEgt0MEZMolIWdxeyFkmLB1oaFZM9GTTYUzYaNncWUBTaalWRho8RCSUojC8uRaDLUmG/xz8/t9ebP/OY/E/1br6Yz77/3zv/3vXvufb/yTf6P7AqIeFR2Bt2rDsAuD7So0fUbJuJkwBZ+ash/gkgMwAbVaanAmQewL3RKNVlMRUSiDMCV2LymZlRO1Dq/tzwQafVCpAv2vYnF0kLIZeAmADceCJQilWe9y80WxTPj5YhMs+MbgB4lT5wB0CKwdmZSlk/tA0CHGL+BOemAgl2w/3YpIhPscK9osz3iV0KLg8Qsn9uhsugd4hmmOo6liCd1RM7556R4IEHsQPOpEz4SKGryNNWlTpRD5RPAg45IlrqzWzxwyUFGNBMkq9wbunaqmacZwCtzwk6BXwPIOeuXkf2Fyl3ug4woPKtWECreLwtrsF661RNLLgDQyBPsXRfZV/lWUmKQNhK0YN9nSds0sEfOlDn6WPm1AIwKfI7Ysc61wsyX1KJSPYA08SWBrxhwLVkBiBN7VFxqiHgOQMwtjqyx4zPsuz+dDYs35SeRAuzLFp1FYF9gOoTDlUT2CLPbZQWPc+M5BL4MuJfTFpS5xwAcARisVmuFANwaXLiu9ZsSjdKlTLYi41RNZXyMcqPoEvim1IW4tVrnI7MMqFl+xTsA6x4UtScZHxQfAiIBEXf7HgBraFcvGJx/twAAAABJRU5ErkJggg==";
var bellEmpty = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAFpOLgnAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAQDSURBVHjaYvz//z8DLsCEzGFkZHzKyMiIEPj//z8DVDfMiH64GJLkTAwNSJKc6JLIdn5nYGB4ieIGfK4FAAAA///CKcmE5AUGZC8w4TQLm1HIrnNEFsemYxVMDKerAAAAAP//wusXomIEyVv/GRkZa6A0M1aXI4U5AwMDw1xcvsYWDzDwh5DzUPzEyMj4n4GBYRc0iBiRaPb///87UBQQAAAAAP//IlkTE8VBDUs9jIyMhugpCZcNEQwMDNcYGBhSGBgYfuMNbxz+mYMij6a4CFsc4spMDAwMDMzUCiVGbKUAckmADGqR1cEjDhp826DO+o9iKgOD1f///3lRYhotvP+jOwWujuZJAwAAAP//IivFUiWrD4glSAnfk5GR8QMjI+N0RkZGeSRx/Aagp3MsaV4bGqMsWLRHoydrrOYQsESDgYHhHRGpGuYiVmzmsOAKHijwZWBgWE3AEuSU85voOKF2iiMU8RzElBZYCwRCEY8UDBwkWFDPwMDwlug4gQJlBgaGQKQwd2JgYHBhYGAogzYutkCLaJjrbzIwMAgP7xwPAAAA///sly0OwkAQhb8WCAhMHZojkRAcohcgkCCQKE6A5ABIJCFBoLkBBgcSDBhSMCM2TZedhZTwN2abJjtf0+578/pj3vURkKLGgVPiPGeJTh3mHRUBfblu5fG6duLGdWAAdEWkQ9VuxywBOAIjy/aTzJSn5kkbWGqs/iGIEbhrDsgKiO+BQseJKgB7B2Qiwy1XnVxcUvh+WwleAQk9e1S8xSh1AGZK0BXoWPtZIAsPgAmKfIJEWULBPNUksPyIJHKvpB6/IsamkbkSYAo0RBMxUAXGBmwDrDMt32GOZvXkabeyhtpv/A8S7we5AQAA///smTFLxEAQhb8JeLbCNSpXWAj2ngeKIFhYC1bWHlheK1hZ2FlZ21haW/kPBLW1sxDEQhEVtFK4WGQWlkVjNrcbT83AEEKS3XkzuzOTt5XE5M94qwZSNRCbMXA0EZFDEbkQkWbOe8UYhx+MSB9YBNrA2G9aWi1gD7jVSpAC0/rsSu9fgSOgM4xANtXIG2AB6AINrZWuLgFvwJl+sx/Egrxe/zvVjuFUDdotMf2qUkrPwNQg9pQFYDoTA2J9AF/O6l56ASbcGhcNyCe040mAhbGtYx2UBZL4pllLJvV6HQCIGWP8C0Yz3GbPyfEh/pKksqw17D3Zv21RGk7VjtEJGBmJUkccWQbudUP2AgDo6FjvytD52+cJZF6LVwoc43dAUER2rNZmIxYQITvzTYG5yMv9QeeZiRWRFeDJ8los7QNbUSLisX9aZLy6We+J5YQ7NXQtdO9X1tgi0gXONSk8ApdkrPhojGRUkw81kBpIvnwMAAMUBJp0IsTrAAAAAElFTkSuQmCC";
var bell = bellEmpty;
var topics = document.querySelectorAll("table.table-hover tr td:first-child");
var topicId;

function handleFollowTopic(event){
    let nowFollowed;
    let elid = event.target.id;
    console.log("topic id: ", event.target.id);
    if(event.type == "mouseup"){
        let getting = browser.storage.local.get("followedTopics");

        getting.then(ret => {
            if(ret.followedTopics == undefined){
                // no topics followed and not set - follow
                console.log("Following...");
                ret.followedTopics = [elid];
                nowFollowed = true;
            }else if(ret.followedTopics.includes(elid)){
                // topic is followed - unfollow
                console.log("Unfollowing...");
                ret.followedTopics.splice(ret.followedTopics.indexOf(elid), 1);
                nowFollowed = false;
            }else{
                // topic not followed - follow
                console.log("Following...");
                ret.followedTopics.push(elid);
                nowFollowed = true;
            }   

            //console.log("Followed topics: ", ret.followedTopics);
            browser.storage.local.set({
                followedTopics: ret.followedTopics
            });

            modifyFollowButton(elid, nowFollowed);
        });
    }
}

function modifyFollowButton(buttonId, isFollowed){
    let fb = document.getElementById("follow-topic-"+buttonId);
    //console.log("Handle: ",fb);
    if(!isFollowed){
        fb.childNodes[0].src = bellEmpty;
        fb.title = "Obserwuj wątek w plumkadle!";
    }else{
        fb.childNodes[0].src = bellFull;
        fb.title = "Już obserwujesz ten wątek";
    }
}

var getFollowedTopics = browser.storage.local.get("followedTopics");
getFollowedTopics.then(res => {
    if(res.followedTopics != undefined){
        if( res.followedTopics.length ){
            let title;
            for(let i=0; i<topics.length; i++){
                topicId = topics[i].querySelector("a").href.split("/")[5];
                if(res.followedTopics.includes(topicId)){
                    bell = bellFull;
                    title = "Już obserwujesz ten wątek";
                }else{
                    bell = bellEmpty;
                    title = "Obserwuj wątek w plumkajdle aby otrzymywać powiadomienia o nowych komentarzach"
                }
                topics[i].innerHTML ='<a href="javascript:void(0);" title="'+title+'" class="btn btn-xs btn-default stat-item btn-follow-small" id="follow-topic-'+topicId+'"><img id="'+topicId+'" src="'+bell+'" alt="bell"/></a> ' + topics[i].innerHTML;
                document.getElementById(topicId).addEventListener("mouseup", handleFollowTopic);
            }

        }
    }
});

