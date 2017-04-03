from flask import Flask
from api import app
from flask_mail import Mail
from flask_mail import Message


app.config.update(
    MAIL_SERVER = '',
    MAIL_PORT = 587,    
    MAIL_USERNAME = '',
    MAIL_PASSWORD = '',
)

mail = Mail(app)

def sendmail(recip,email):
    with mail.connect() as connection:
    	username = email.split('@')[0]
        message = 'Helllo %s!\n Welcome to Cross-application shortcuts! \n Make yourself at home at https://cross-app-links.herokuapp.com/' % username
        subject = "Cross-apps registration"
        msg = Message(recipients=recip,
                      body=message,
                      subject=subject,
                      sender='')

        connection.send(msg)