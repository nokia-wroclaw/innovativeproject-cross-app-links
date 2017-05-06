from api import app
from flask import request
from flask_uploads import UploadSet, configure_uploads, IMAGES
from flask_login import current_user
import os


app.config['UPLOADED_PHOTOS_DEST'] = 'api/static/img'

link_images = UploadSet('photos', IMAGES)
configure_uploads(app, link_images)

user_avatars = UploadSet('photos', IMAGES)
configure_uploads(app, user_avatars)

@app.route('/api/upload/img', endpoint='upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST' and 'file' in request.files:
        if os.path.exists('api/static/img/app-img/'+ request.form['deleteFile'] + '.png'):
            os.remove('api/static/img/app-img/'+ request.form['deleteFile'] + '.png')
        filename = link_images.save(request.files['file'], folder='app-img', name=request.form['filename'] + '.png')
        return str(True)
    return str(False)

@app.route('/api/upload/avatar', endpoint='upload2', methods=['GET', 'POST'])
def upload2():
    if request.method == 'POST' and 'file' in request.files:
        if os.path.exists('api/static/img/avatars/avatar_' + current_user.get_id() + '.png'):
            os.remove('api/static/img/avatars/avatar_' + current_user.get_id() + '.png')
        filename = user_avatars.save(request.files['file'], folder='avatars', name =('avatar_' + current_user.get_id() + '.png'))
        return str(True)
    return str(False)