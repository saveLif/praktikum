import unittest
from validatorEmail import isValidEmail


class ValidationTestCase(unittest.TestCase):
  def test_email_is_valid(self):
    self.assertTrue(isValidEmail('student@fa.de'))
  
  def test_email_is_invalid(self):
    self.assertFalse(isValidEmail('email.com'))
  
if __name__ == '__main__':
  unittest.main()