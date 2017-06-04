# Cross app links 
---
## Description: 

**Cross app links** solves problems caused by working with many projects at the same time. 
It can be splitted for two parts. The administration system and the web component. 

Administration system is used to create and manage links by providing their names, addresses and icons. There is also possibility to see registered users, action log, statistics of existed data and much more. It is mainly to watch what is happening in our environment. It's written in Flask(Python) as a backend and Angular.js as front-end.


Web component is written in Polymer 2.0. It presents our links outside the administration part. It can be included at any webiste. There is also possibility to generate token which allows the user to manage the view of the links(pinning, ordering)


## Demos

1. [Main application](http://cross-app-links.herokuapp.com)
2. [Web component](http://cross-app-component.herokuapp.com)

If you can't see the component probably you have to tell your browser to trust unsecured / untrusted content. It's beacuse we don't provide https...

## Base technologies:

**Javascript**
- [Polymer](https://www.polymer-project.org/2.0/docs/about_20)
- [Angular.js](https://docs.angularjs.org/api)

**Python**
- [Flask](http://flask.pocoo.org/docs/0.12/)


## Setting up the environment

### Dependencies

You will need:

- [Python 3.6](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/en/)


**Install python requirements with [pip](https://pypi.python.org/pypi/pip) (make sure you've got it installed):**


```
pip install -r requirements.txt
```

**Then install bower for dependencies management and download them all:**

```
npm install -g bower
```

```
bower install
```

### Global variables

**Create `*.env` file to provide some global variables:**

```
DATABASE_URL = "dialect+driver://username:password@host:port/database"
```

```
FLASK_APP = "run.py"
```

```
FLASK_DEBUG = "true"
```


**Create an e-mail account (wherever):**

```
MAIL_PASSWORD = "yoursecretpassword"
```

```
MAIL_PORT = "465"
```

```
MAIL_SERVER = "mail@server.com"
```

```
MAIL_USERNAME = "mail_username"
```

```
MAIL_USE_SSL = "True"
```


**Use it if you run this app i.e. heroku:**

```
NPM_CONFIG_PRODUCTION = "true"
```


**Fill with your domain name (with http / https):**

```
SERVER_ADDRESS = "https://lorem-ipsum-dolor.com"
```

### Apply them

```
set -a
```
```
. your_env_file_name.env
```
```
set +a
```

## To run locally

Just type:

```
flask run
```

## At the and

Cross app links is a part of innovative projects summer 2017, it's created by students from Wrocław University of Science and Technology with support of employees of Nokia.

## Authors

- [Maciej Bakowicz](https://github.com/bakowroc)
- [Maciej Szwarc](https://github.com/lozohcum)
- [Vladyslav Strinada](https://github.com/vladstrinada)
- [Bartłomiej Wach](https://github.com/Waszislaw)
- [Malwina Żegleń](https://github.com/grihiba)
