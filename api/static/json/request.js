(function () {

    var req = new XMLHttpRequest();

    // creating GET request to yahoo weather API
    req.open('GET', "http://127.0.0.1:5000/api/applications", true);
    // sending a request
    req.send();

    req.onreadystatechange = processRequest;
    var navbar = document.querySelector('#component');

    function processRequest() {
        if (req.readyState == 4 && req.status == 200) {
            var listGenerateString = '';
            var linkArray = JSON.parse(req.responseText);
            for (var i = 0; i < linkArray.length; i++) {
                listGenerateString += '<li><a href="' + linkArray[i]['link'] + '">' + linkArray[i]['name'] + '</a></li>';
            }
            navbar.insertAdjacentHTML('beforeend', listGenerateString);
        }
    }


})()