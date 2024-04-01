let files = {};
const main = async () => {
    files = await (await fetch("./files")).json();
    const manga = Object.keys(files);
    let mangaSelector = document.getElementById("mangaSelect");
    for(let i = 0; i < manga.length; i++){
        let temp = document.createElement("option");
        temp.value = manga[i];
        temp.innerText = manga[i];
        mangaSelector.appendChild(temp);
    }
    mangaSelector.addEventListener("change", e => {
        let value = mangaSelector.value;
        if(value != "None"){
            try{
            document.getElementById("NoneManga").remove();
            }catch{}
            const chapters = Object.keys(files[value]);
            let chapterSelector = document.getElementById("chapterSelect");
            chapterSelector.innerHTML = "<option id=\"NoneChapter\">None</option>";
            for(let j = 0; j < chapters.length; j++){
                let temp = document.createElement("option");
                temp.value = chapters[j];
                temp.innerText = chapters[j];
                chapterSelector.appendChild(temp);
            }
            chapterSelector.addEventListener("change", e => {
                let chapter = files[value][chapterSelector.value];
                if(chapter != undefined){
                    let images = document.getElementById("images");
                    images.innerHTML = "";
                    let pages = chapter.pages;
                    pages.sort((a,b) => {
                        a = a.split(".")[0];
                        b = b.split(".")[0];
                        if(+a < +b) return -1;
                        if(+a > +b) return 1;
                        return 0;
                    })
                    console.log(pages);
                    document.getElementById("scanlator").innerText = "Scanlated by: " + chapter.scanlator
                    for(let k = 0; k < pages.length; k++){
                        let temp = document.createElement("img");
                        temp.src = chapter.baseurl+pages[k];
                        images.appendChild(temp);
                    }
                    
                }
            })
        }
    })
}
main();