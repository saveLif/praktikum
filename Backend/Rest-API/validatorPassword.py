"""import string
def golf(password):

    input("Gebe ein Passwort mit mindestens 6 Charakter und 1 Zahl")
    if len(password) >= 6 and any(char.isdigit() for char in password):
        return True

    else:
        print("Ungültiges Passwort")"""

import re

while True:
    password = input("Gebe ein Passwort mit mindestens 6 Charakter und 1 Zahl")
    if re.search(r"^(?=.*\d)(?=.*[a-zA-Z]).{6,}$", password):
        print("Mot de passe valide")
        break
    else:
        print("Ungültiges Passwort: Es muss mindestens sechs Zeichen und eine Zahl enthalten.")




    
   
