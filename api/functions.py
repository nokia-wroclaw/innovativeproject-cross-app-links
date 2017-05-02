from api import app
from flask import Flask, session, g
from api.models import User, Group, App, Log, Invite, Reset
from api.database import db
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from api.mail import send_email, send_email_register, send_email_reset
from passlib.hash import sha256_crypt


class Mailing():
	def commituser(self,token,userpassword):
	    """
	    Creates user with given password. Email and group are taken from Invite table.
	    Removes invite entry.
	    """
	    new = Invite.query.filter_by(token = token).first()
	    if new:
	        useremail = new.email
	        group = new.group
	        new = User(useremail,sha256_crypt.encrypt(userpassword),group)
	        db.session.add(new)
	        db.session.commit()
	        self.removeinvite(useremail)
	        if not User.query.filter_by(email = useremail).first():
	            return "Error while creating user."
	    else:
	        return "Error. Invite not found."

	def commitinvite(self,email,maker,group):
		"""
		Creates invite entry with given email, group and id of user who send invite
		(maker is user object).
		"""
		new = Invite(email,maker.id,group)
		db.session.add(new)
		db.session.commit()
		receiver = [email]
		send_email_register(maker.email,receiver)

	def askforreset(self,email):
	    """
	    Creates reset entry and sends email with password reset link.
	    """
	    new = Reset(email)
	    db.session.add(new)
	    db.session.commit()
	    receiver = [email]
	    send_email_reset(receiver)

	def updatepassword(self,token,userpassword):
	    """
	    Retrieves user email from reset entry and set new passowrd for the user
	    """
	    new = Reset.query.filter_by(token = token).first()
	    useremail = new.email
	    user = User.query.filter_by(email=useremail).first()
	    user.password_hash = sha256_crypt.encrypt(userpassword)
	    db.session.commit()
	    self.removereset(useremail)

	def removeuser(self,email, current):
		"""
		Removes user from database. If user removes himself, session is terminated.
		"""
		sadman = User.query.filter_by(email = email).first()
		if current.email == email:
		    logout_user()
		    session.pop('user', None)
		db.session.delete(sadman)
		db.session.commit()

	def removeinvite(self,email):
		"""
		Removes invite entry.
		"""
		sadman = Invite.query.filter_by(email = email).first()
		db.session.delete(sadman)
		db.session.commit()

	def removereset(self,email):
		"""
		Removes reset entry.
		"""
		sadman = Reset.query.filter_by(email = email).first()
		db.session.delete(sadman)
		db.session.commit()