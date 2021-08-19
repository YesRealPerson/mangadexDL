import MangaDexPy
import re
import urllib.request
import os

api = MangaDexPy.MangaDex()

def dl_img(url, file_path, file_name):
    full_path = file_path+file_name + '.png'
    #print("saving "+full_path)
    urllib.request.urlretrieve(url, full_path)


while(True):
    search = input("What manga are you looking for?    ")
    sResults = api.search(obj='manga',params={"title":search}, limit=100)
    for manga in sResults:
        print(manga.title)
        yes = input("Is this the correct title? (y for yes)   ")
        if(yes=="y"):
            ID = manga.id
            break
    chapters = api.get_manga_chapters(manga)
    chapDict = {}
    chapNums = []
    chapDictTitles = {}
    for chapter in chapters:
        if(chapter.language=="en"):
            if(chapter.chapter in chapNums):
                net = chapter.get_md_network()
                page = net.pages[0]
                if(("mangaplus" not in page)):
                    chapDict.update({str(chapter.chapter):chapter})
                    chapDictTitles.update({str(chapter.chapter): str(chapter.title)})
            else:
                chapDict.update({str(chapter.chapter): chapter})
                chapDictTitles.update({str(chapter.chapter): str(chapter.title)})
                chapNums.append(chapter.chapter)
    chapNums.sort(key=int)
    chapNums = list(dict.fromkeys(chapNums))
    for i in chapNums:
        print("Chapter: "+i+" "+chapDictTitles[str(i)])
    toDL = input("type all for all chapters or a number for a specific chapter.    ")
    if(toDL=="all"):
        for chap in chapDict:
            chap = chapDict[str(chap)]
            title = re.sub(r'\W+', '', str(manga.title)) + str(chap.chapter)
            net = chap.get_md_network()
            pages = net.pages
            os.makedirs(title)
            x=0
            for page in pages:
                try:
                    name = title + " " + str(x)
                    dl_img(page, title + "/", name)
                    x += 1
                except:
                    print("uh oh problem with chapter "+chap.chapter)
    else:
        chap = chapDict[toDL]
        title = re.sub(r'\W+', '', str(manga.title)) + str(chap.chapter)
        net = chap.get_md_network()
        pages = net.pages
        os.makedirs(title)
        x = 0
        for page in pages:
            try:
                name = title + " " + str(x)
                dl_img(page, title + "/", name)
                x += 1
            except:
                print("uh oh problem with chapter " + chap.chapter)

