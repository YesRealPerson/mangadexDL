import os
import mangadex
import re
import urllib.request

api = mangadex.Api

def dl_img(url, file_path, file_name):
    full_path = file_path+file_name + '.png'
    print("saving "+full_path)
    urllib.request.urlretrieve(url, full_path)

while(True):
    search = input("What is the name of the manga you are looking for?  ")
    manga_list = api.get_manga_list(self=api,title=search)
# manga = api.view_manga_by_id(self=mangadex.Api,id="c086153a-0162-412a-9914-a7b2633d0cd3")
# volumes = api.get_manga_volumes_and_chapters(self=api, id="c086153a-0162-412a-9914-a7b2633d0cd3")
# returns dictionary usage: volumes["*VOLUME NUMBER*"]
    for x in manga_list:
        print(x.title)
        found = input("Is this the manga you're looking for? (y/n)  ")
        if(found == "y"):
            id = x.id
            manga = api.view_manga_by_id(self=api, id=x.id)
            break
    if(found!="y"):
        pass
    mangadesc = ''.join(i for i in manga.description if not i.isdigit())
    print(manga.title["en"])
    print(manga.description["en"])
    volumes = api.get_manga_volumes_and_chapters(self=api, id=manga.id)
    chapterDict = {str(int(0)):"test"}
    for x in range(1, len(volumes)+1):
        chapters = api.chapter_list(self=api, manga=manga.id, volume=str(x))
        print("Volume: "+str(x))
        for y in chapters:
            #print("NOT EN - Chapter:"+str(int(y.chapter))+" "+y.title)
            if(y.translatedLanguage=="en"):
                print("Chapter: "+str(int(y.chapter))+" "+y.title)
                chapterDict.update({str(int(y.chapter)):y.id})
    downloading = True
    while(downloading):
        chapterNumber = input("What chapter do you want to download?   ")
        pages = api.get_chapter(self=api, id=str(chapterDict[chapterNumber])).fetch_chapter_images()
        x=0
        title = re.sub(r'\W+', '', str(manga.title))+str(chapterNumber)
        os.makedirs(title)
        for src in pages:
            name = title+" "+str(x)
            dl_img(src, title+"/", name)
            x+=1
        yesno = input("stop? (type y for yes anything else for no)")
        if(yesno=="y"):
            downloading = False