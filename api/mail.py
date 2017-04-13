from flask import Flask, render_template
from api import app
from api.models import User, Invites
from flask_mail import Mail
from flask_mail import Message



app.config.update(
    MAIL_SERVER = 'smtp.yandex.com',
    MAIL_PORT = 465,
    MAIL_USE_SSL = True ,   
    MAIL_USERNAME = 'cross-apps@yandex.com',
    MAIL_PASSWORD = 'innovativeproject',
)

mail = Mail(app)

def send_email(subject, sender, recipients, html_body):
    msg = Message(subject=subject, sender=sender, recipients=recipients)
    msg.html = html_body
    mail.send(msg)


def send_email_register(sender,recip):
    email = recip[0]
    username = email.split('@')[0]
    admin = sender.split('@')[0]
    new = Invites.query.filter_by(email = email).first()
    url = 'http://127.0.0.1:5000/api/auth/setpassword?token=' + str(new.token)
    send_email("Cross-apps registration",'cross-apps@yandex.com', recip, render_template("email_template.html", user=username,sender=admin, url=url))


