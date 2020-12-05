(function () {
    var trainingDropdownSelector = "#page > form > div:nth-child(2) > div > select > option";
    var placesSelector = "td.h-o-m";
    var gunsSelector = "td:nth-child(3) > span";
    
    function getGunsList(trainingsTable) {
        var elements = Array.from(trainingsTable.querySelectorAll(gunsSelector)).map(function(node) {return node.textContent;});
        return elements.filter(function(item, pos) { return elements.indexOf(item) == pos; }).sort();
    }
    function showAllTrainingsTableRows(trainingsTable){
        trainingsTable.querySelectorAll('tbody > tr').forEach(row => {
            row.hidden = false;
        })
    }
    function hideTrainingsTableRows(trainingsTable, gunName) {
        trainingsTable.querySelectorAll('tbody > tr').forEach(row => {
            var elements = Array.from(row.querySelectorAll("td:nth-child(3) > span")).map(function(node) {return node.textContent;});
            if (!elements.includes(gunName)) {
                row.hidden = true;
            }
        })
    }
    function showAllTrainsingSelectors() {
        var options = document.querySelectorAll(trainingDropdownSelector);
        options.forEach(option => {
            option.hidden = false;
            option.removeAttribute("disabled");
            option.removeAttribute("style");
        })
    }

    function hideTrainingsSelectors(gunName) {
        var options = document.querySelectorAll(trainingDropdownSelector);
        options.forEach(option => {
            if (!option.innerText.includes(gunName)) {
                option.hidden = true;
                option.setAttribute("disabled","true");
                option.setAttribute("style", "display: none");
            }
        });
    }

    function addGunsFilter(trainingsTable) {
        var gunsFilterNode = document.createElement('select');
        gunsFilterNode.setAttribute('name','gunsSelector');
        gunsFilterNode.setAttribute('id','gunsSelector');

        var gunsList = getGunsList(trainingsTable);
        gunsList = ["WSZYSTKO"].concat(gunsList);
        gunsList.forEach(gunName => {
            var value_node = document.createElement('option');
            value_node.setAttribute('value',gunName);
            value_node.innerText = gunName;
            gunsFilterNode.appendChild(value_node);
            
        });
        gunsFilterNode.oninput = function() {
            var selectorValue = document.querySelector("#gunsSelector").value;
            if (selectorValue == 'WSZYSTKO') {
                showAllTrainingsTableRows(trainingsTable);
                showAllTrainsingSelectors();
            } else {
                showAllTrainingsTableRows(trainingsTable);
                showAllTrainsingSelectors();
                hideTrainingsTableRows(trainingsTable, selectorValue);
                hideTrainingsSelectors(selectorValue)
            }
        };
        var tableGunsHeaderNode = trainingsTable.querySelector("thead > tr > th:nth-child(3) > strong");
        tableGunsHeaderNode.parentNode.insertBefore(gunsFilterNode, tableGunsHeaderNode.nextSibling);
    }
    addGunsFilter(document.querySelector("#page > table:nth-child(13)"));

})();