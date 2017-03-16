var req = new XMLHttpRequest();
req.open('GET', "https://query.yahooapis.com/v1/public/yql?q=select%20astronomy.sunset%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22maui%2C%20hi%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", true);
req.send();

var div = document.querySelector("#second");

req.onreadystatechange = processRequest;

function processRequest() {
	 if (req.readyState == 4 && req.status == 200) {
        var response = JSON.parse(req.responseText);
        var textNode = "<li><img src='#component.img'><a href='#component.link'> component.title" + JSON.stringify(response["query"]["results"]) + "</a></li>";
        div.insertAdjacentHTML('beforeend', textNode);
    }
}

