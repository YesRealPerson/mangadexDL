import MangaDexPy
import re
import urllib.request
import os

api = MangaDexPy.MangaDex()
while(True):
    search = input("What manga are you looking for?    ")
    sResults = api.search(obj='manga',params={"title":search}, limit=100)
    for manga in sResults:
        print(manga.title)
        yes = input("Is this the correct title? (y for yes)   ")
        if(yes=="y"):
            ID = manga.id
            break
