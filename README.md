<h2>HTTP requests- Angular</h2>
<p>There are four types of request GET, POST, PUT, DELETE and they can be called like this:</p>

<code>
restful.get(<i>string</i> table_name[, <i>integer</i> element_id]).then(function(response){
<i>JSON Object </i> response
});
</code>

<br/>

<code>
restful.post(<i>string</i> table_name, <i>integer</i> element_id, <i>JSON Object </i> data);
</code>

<br/>

<code>
restful.update(<i>string</i> table_name, <i>integer</i> element_id, <i>JSON Object </i> data);
</code>

<br/>

<code>
restful.delete(<i>string</i> table_name, <i>integer</i> element_id);
</code>
<br/>
<p>And there're two function which are used to login and logout:</p>

<code>
restful.login(<i>JSON Object </i> data).then(function(response){
<i>Boolean </i> response
});
</code>
<br/>
<code>
restful.logout();
</code>
<br/>
<br/>
<p>Every created service's functions could get couple params but some of them are REQUIRED for each function:</p>
<table>
<thead>
      <tr>
        <th>Request type</th>
        <th>Table name</th>
        <th>Element ID</th>
        <th>JSON Object</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>GET</td>
        <td>Yes</td>
        <td>Optional</td>
        <td>No</td>
      </tr>
      <tr>
        <td>POST</td>
        <td>Yes</td>
        <td>Yes</td>
        <td>Yes</td>
      </tr>
      <tr>
        <td>PUT</td>
        <td>Yes</td>
        <td>Yes</td>
        <td>Yes</td>
      </tr>
      <tr>
        <td>DELETE</td>
        <td>Yes</td>
        <td>Yes</td>
        <td>No</td>
      </tr>
    </tbody>
</table>
<p>If you don't follow this restrictions the request will not be sent. But even if you somehow done that, Flask is also secured in a similar way.</p>
<h2>Innovative cross-app-links</h2>
<h3>It's online! <a href="https://cross-app-links.herokuapp.com">https://cross-app-links.herokuapp.com</a></h3>
<h2>To run locally</h2>
<p>We're using npm / bower so first you have to install them. Ofc python is also necessary(3.6 for best).</p>
<p>Try <a href="https://nodejs.org/en/">this</a> to install node.js</p>
<p>Then run console and type:</p>
<blockquote>npm install bower -g</blockquote>
<h3>Change path to your repository and type:</h3>
<blockquote>bower install</blockquote>
<blockquote>pip install -r requirements.txt</blockquote>
<blockquote>export FLASK_APP=run.py</blockquote>
<blockquote>export FLASK_DEBUG=true</blockquote>
<blockquote>flask run</blockquote>
