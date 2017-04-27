from api import app
from flask import request
from flask_uploads import UploadSet, configure_uploads, IMAGES

app.config['UPLOADED_PHOTOS_DEST'] = 'api/static/img'

link_images = UploadSet('photos', IMAGES)
configure_uploads(app, link_images)

user_avatars = UploadSet('photos', IMAGES)
configure_uploads(app, user_avatars)

@app.route('/api/upload/img', endpoint='upload', methods=['GET','POST'])
def upload():
    if request.method == 'POST' and 'file' in request.files:
        filename = link_images.save(request.files['file'], folder='app-img', name=request.form['filename'] + '.png')
        return str(True)
    return str(False)

@app.route('/api/upload/avatar', endpoint='upload2', methods=['GET','POST'])
def upload2():
    if request.method == 'POST' and 'file' in request.files:
        filename = user_avatars.save(request.files['file'], folder='avatars', name=request.form['filename'] + '.png')
        return str(True)
    return str(False)