from flask import Flask, render_template
from api import app
from api.models import User, Invites, Reset
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
    """
    Sends email of given subject, sender, recipents (array) and html template.
    """
    msg = Message(subject=subject, sender=sender, recipients=recipients)
    msg.html = html_body
    mail.send(msg)


def send_email_register(sender,recip):
    """
    User invitation email.
    """
    email = recip[0]
    username = email.split('@')[0]
    admin = sender.split('@')[0]
    new = Invites.query.filter_by(email = email).first()
    url = 'https://cross-app-links.herokuapp.com/api/auth/setpassword?token=' + str(new.token)
    subject = "Cross-apps registration"
    headerText = "You've received an invitation!"
    freeText = "Administrator has invited you to join Cross-apps shortcuts!"
    userTextBold = "You can complete your registartion by clicking the button or entering the link. \n Set up your unique password and make yourself home!"
    userText = ""
    send_email(subject,
        'cross-apps@yandex.com',
        recip,
        render_template("email_reset_template.html",
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
    recipent = email[0]
    username = recipent.split('@')[0]
    new = Reset.query.filter_by(email = recipent).first()
    url = 'https://cross-app-links.herokuapp.com/api/auth/setnewpassword?token=' + str(new.token)
    subject = "Cross-apps password reset"
    headerText = "Looks like you want to reset your password!"
    freeText = "Here we send you instructions to set up a new password for your account!"
    userTextBold = "Please proceed by clicking the button. \n You will be displayed a page that will allow you to set a new password."
    userText = "If you forget your password again, please consider drinking green tea. Green tea contains polyphenols, powerful antioxidants that protect against free radicals that can damage brain cells. Among many other benefits, regular consumption of green tea may enhance memory and mental alertness and slow brain aging."
    send_email(subject,
        'cross-apps@yandex.com',
        email,
        render_template("email_reset_template.html",
            user=username,
            sender="system",
            url=url,
            subject=subject,
            buttonText="RESET",
            headerText=headerText,
            freeText=freeText,
            userTextBold=userTextBold,
            userText=userText))