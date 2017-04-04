from flask import Flask
from api import app
from api.models import User, Invites
from flask_mail import Mail
from flask_mail import Message



app.config.update(
    MAIL_SERVER = 'admin.example.com',
    MAIL_PORT = 587,    
    MAIL_USERNAME = 'admin@example.com',
    MAIL_PASSWORD = 'password',
)

mail = Mail(app)

def sendmail(recip,email):
    with mail.connect() as connection:
      username = email.split('@')[0]
      new = Invites.query.filter_by(email = email).first()
      message = 'Helllo %s!\n You have been invited to Cross-application shortcuts! \n Please activate your account by visiting this link 127.0.0.1:5000/api/auth/setpassword?token=%s \n  After registrarion is complete you can make yourself at home at https://cross-app-links.herokuapp.com/' % (username,new.token)
      subject = "Cross-apps registration"
      msg = Message(recipients=recip,
                    body=message,
                    subject=subject,
                    sender='219258@student.pwr.edu.pl')
      connection.send(msg)


