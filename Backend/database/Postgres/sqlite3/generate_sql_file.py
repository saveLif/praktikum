with open("C:\\Telegraf\\output.sql", "r") as sql_file:
    sql_content = sql_file.read()

# Enregistrez le script SQL complet dans un nouveau fichier
with open("C:\\Telegraf\\complete_script.sql", "w") as complete_script:
    complete_script.write(sql_content)