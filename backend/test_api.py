import unittest
import requests

class TestAPI(unittest.TestCase):
    BASE_URL = 'http://localhost:5000'
    
    def test_get_results(self):
        response = requests.get(f'{self.BASE_URL}/api/results')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertGreater(len(response.json()), 0)
        print(response.json())

if __name__ == '__main__':
    unittest.main()
