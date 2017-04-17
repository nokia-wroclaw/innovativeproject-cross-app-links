from api import app
from flask import request
from flask_uploads import UploadSet, configure_uploads, IMAGES

link_images = UploadSet('photos', IMAGES)
app.config['UPLOADED_PHOTOS_DEST'] = 'api/static/img'
configure_uploads(app, link_images)

@app.route('/api/upload', methods=['GET','POST'])
def upload():
    if request.method == 'POST' and 'file' in request.files:
        filename = link_images.save(request.files['file'], folder='app-img', name=request.form['filename'] + '.png')
        return str(True)
    return str(False)