
<h1>Innovative cross-app-links</h1>
<h3>It's online! <a href="https://cross-app-links.herokuapp.com">https://cross-app-links.herokuapp.com</a></h3>
<p>Email: admin@example.com</p>
<p>Password: admin123</p>
<h2>JSON component</h2>
<p>It's available on your computer here(probably): <a href="http://127.0.0.1:5000/component/json">http://127.0.0.1:5000/component/json</a></p>
<h2>Iframe component</h2>
<p>It's available on your computer here(probably): <a href="http://127.0.0.1:5000/component/iframe">http://127.0.0.1:5000/component/iframe</a></p>
<h2>User verification, session handling.</h2>
<p>
<blockquote>On root we check if there is open session. If yes - response with index. If no - login page is displayed.</blockquote>
<blockquote>Visitor is asked for credentials. We look for a databse entry by email and then validate password with hash. </blockquote>
<blockquote>If both email and password are correct, user will be logged in and session will be opened.</blockquote>
<blockquote>In case password or email is incorrect, page will simply reload. Visitor won't be granted any rights.</blockquote>
</p>
<h2>User registration.</h2>
<p>
<blockquote>Administrator sends email invitation to join Cross-apps.</blockquote>
<blockquote>Invited person receives an email with account activation link.</blockquote>
<blockquote>After opening the link page prompts for password new user wants to be set.</blockquote>
<blockquote>Once button is hit new user is created.</blockquote>
<blockquote>@login_required prevents from unauthorised access.</blockquote>
</p>
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

