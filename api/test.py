from api import app
import unittest

class FlaskTestCase(unittest.TestCase):
    def test_index(self):
        tester = app.test_client(self)
        response = tester.get('/', content_type='html/text')
        self.assertEqual(response.status_code, 200)

    def test_login(self):
        tester = app.test_client(self)
        response = tester.get('/login', content_type='html/text')
        self.assertEqual(response.status_code, 200)

    def test_logout(self):
       tester = app.test_client(self)
       response = tester.get('/logout', content_type='html/text')
       self.assertEqual(response.status_code, 200)

    def test_link_app(self):
        tester = app.test_client(self)
        response = tester.get('/links', content_type='html/text')
        self.assertEqual(response.status_code, 200)

    def test_404(self):
        tester = app.test_client(self)
        response = tester.get('/some-random-url', content_type='html/text')
        self.assertEqual(response.status_code,200)

    def test_dashboard(self):
        tester = app.test_client(self)
        response = tester.get('/dashboard', content_type='html/text')
        self.assertTrue(b'Action log' in response.data)
        #self.assertTrue(b'Notes' in response.data)
        #self.assertTrue(b"Who's online" in response.data)
        #self.assertTrue(b'cross app links' in response.data)

    def test_add_link(self):
        tester = app.test_client(self)
        response = tester.get('/add-link', content_type='html/text')
        self.assertFalse(b'New link' in response.data)

    def test_log_out(self):
        tester=app.test_client(self)
        tester.post('login',
                           data=dict(username='admin', password='admin'),
                           follow_redirects=True
                           )
        response=tester.get('/logout',follow_redirects=True)
        self.assertEqual(response.status_code,200)



#def test_apps(self):
#        tester = app.test_client(self)
#        response = tester.get('/links', content_type='html/text')
#        self.assertTrue(b'Dropbox is a file hosting service.' in response.data)
#        self.assertIn(b'Fusce in urna sem.', response.data)
#        self.assertIn(b'Lorem ipsum dolor sit amet.', response.data)
#        self.assertIn(b'YouTube is a free video sharing website.', response.data)







if __name__ == '__main__':
    unittest.main()



