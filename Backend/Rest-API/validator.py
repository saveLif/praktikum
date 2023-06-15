import re
import string
 #Email validieren
regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'

def isValidEmail(email):
  """ Validate email"""
  if(re.match(regex, email)):
    return True
  else:
    return False
  
#Passwort validieren
def isValidPasswort(password):

    if len(password) >= 6 and any(char.isdigit() for char in password):
        return True

    else:
        print("Ungültiges Passwort")


#Pseudonym validieren
"""def isValidPseudonym(pseudonym):
    if len(pseudonym) >= 3 :
        print("Gültiges Pseudonym")
    else:
        print("Das Pseudonym muss mindestens zwei Buchstaben enthalten. Bitte versuchen Sie es noch einmal.")"""
