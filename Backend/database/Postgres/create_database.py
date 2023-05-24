# erstellt Postgres Datenbank
import subprocess

subprocess.run(["sudo", "apt", "update"])

subprocess.run(["sudo", "apt", "install", "postgresql"])

# Erstelle einen neuen Benutzer für PostgreSQL
username = "julian12342"
password = "baum2"
create_user_command = f"sudo -u postgres createuser -P {username}"
subprocess.run(create_user_command.split(), input=password.encode())

# Erstelle eine neue Datenbank
database = "gruen"
create_database_command = f"sudo -u postgres createdb -O {username} {database}"
subprocess.run(create_database_command.split())




subprocess.run(["sudo", "-u", "postgres", "psql", "-d", "gruen"])





