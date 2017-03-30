<h2>Innovative cross-app-links</h2>
<h3>It's online! <a href="https://cross-app-links.herokuapp.com">https://cross-app-links.herokuapp.com</a></h3>
<p>You don't need any password or email. Just click the 'Sign in' button with empty fields. It's temporary solution! Just to see if it works :)</p>
<h2>User verification, session handling.</h2>
<p>
<blockquote>On root we check if there is open session. If yes - response with index. If no - login page is displayed.</blockquote>
<blockquote>Visitor is asked for credentials. We look for a databse entry by email and then validate password with hash. </blockquote>
<blockquote>If both email and password are correct, user will be logged in and session will be opened.</blockquote>
<blockquote>In case password or email is incorrect, page will simply reload. Visitor won't be granted any rights.</blockquote>
</p>
<h2>User registration.</h2>
<p>
<blockquote>Admin is allowed to access /register path, which loads register form.</blockquote>
<blockquote>Username, email and password hash will be added to the database after submit.</blockquote>
<blockquote>Admin will be notified if username/email is already taken.</blockquote>
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
