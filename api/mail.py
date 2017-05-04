from flask import Flask, render_template
from api import app
from api.models import User, Invite, Reset, ComponentUser
from flask_mail import Mail
from flask_mail import Message



app.config.update(
    MAIL_SERVER = os.environ['MAIL_SERVER'],
    MAIL_PORT = os.environ['MAIL_PORT'],
    MAIL_USE_SSL = os.environ['MAIL_USE_SSL'] ,   
    MAIL_USERNAME = os.environ['MAIL_USERNAME'],
    MAIL_PASSWORD = os.environ['MAIL_PASSWORD'],
)

mail = Mail(app)

def send_email(subject, sender, recipients, html_body):
    """
    Sends email of given subject, sender, recipients (array) and html template.
    """
    msg = Message(subject=subject, sender=sender, recipients=recipients)
    msg.html = html_body
    mail.send(msg)


def send_email_register(sender,email):
    """
    User invitation email.
    """
    recipient = email[0]
    username = recipient.split('@')[0]
    admin = sender.split('@')[0]
    new = Invite.query.filter_by(email = recipient).order_by('-id').first()
    url = 'https://cross-app-links.herokuapp.com/api/auth/setpassword?token=' + str(new.token)
    subject = "Cross-apps registration"
    headerText = "You've received an invitation!"
    freeText = "Administrator has invited you to join Cross-apps shortcuts!"
    userTextBold = "You can complete your registartion by clicking the button or entering the link. \n Set up your unique password and make yourself home!"
    userText = ""
    send_email(subject,
        'cross-apps@yandex.com',
        email,
        render_template("email-template.html",
            user=username,
            sender=admin,
            url=url,
            subject=subject,
            buttonText="Register",
            headerText=headerText,
            freeText=freeText,
            userTextBold=userTextBold,
            userText=userText))


def send_email_reset(email):
    """
    User password reset email.
    """
    recipient = email[0]
    username = recipient.split('@')[0]
    new = Reset.query.filter_by(email = recipient).order_by('-id').first()
    url = 'https://cross-app-links.herokuapp.com/api/auth/setnewpassword?token=' + str(new.token)
    subject = "Cross-apps password reset"
    headerText = "Looks like you want to reset your password!"
    freeText = "Here we send you instructions to set up a new password for your account!"
    userTextBold = "Please proceed by clicking the button. \n You will be displayed a page that will allow you to set a new password."
    userText = "If you forget your password again, please consider drinking green tea. Green tea contains polyphenols, powerful antioxidants that protect against free radicals that can damage brain cells. Among many other benefits, regular consumption of green tea may enhance memory and mental alertness and slow brain aging."
    send_email(subject,
        'cross-apps@yandex.com',
        email,
        render_template("email-template.html",
            user=username,
            sender="system",
            url=url,
            subject=subject,
            buttonText="RESET",
            headerText=headerText,
            freeText=freeText,
            userTextBold=userTextBold,
            userText=userText))


def send_email_token(email):
    """
    Sending requested token.
    """
    recipient = email[0]
    username = recipient.split('@')[0]
    new = ComponentUser.query.filter_by(email = recipient).order_by('-id').first()
    url = 'https://cross-app-links.herokuapp.com'
    subject = "Cross-apps token delivery!"
    headerText = "You've received a Cross-apps token!"
    freeText = ""
    userTextBold = "Here is your unique token for Cross-app links. \n Token allows you to set your own view order \n and pin your favourite apps to the navbad."
    userText = str(new.token)
    send_email(subject,
        'cross-apps@yandex.com',
        email,
        render_template("email-template.html",
            user=username,
            sender="system",
            url=url,
            subject=subject,
            buttonText="Visit our website",
            headerText=headerText,
            freeText=freeText,
            userTextBold=userTextBold,
            userText=userText))