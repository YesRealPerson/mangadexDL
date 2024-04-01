let files = {};
let webtoon = false;
let urls = [];
let index = -1;
document.getElementById("webtoonMode").checked = false;
const changeEvent = new Event('change');
const main = async () => {
    files = await (await fetch("./files")).json();
    const manga = Object.keys(files);
    let mangaSelector = document.getElementById("mangaSelect");
    for (let i = 0; i < manga.length; i++) {
        let temp = document.createElement("option");
        temp.value = manga[i];
        temp.innerText = manga[i];
        mangaSelector.appendChild(temp);
    }
    mangaSelector.addEventListener("change", e => {
        let value = mangaSelector.value;
        if (value != "None") {
            try {
                document.getElementById("NoneManga").remove();
            } catch { }
            const chapters = Object.keys(files[value]);
            let chapterSelector = document.getElementById("chapterSelect");
            chapterSelector.innerHTML = "<option id=\"NoneChapter\">None</option>";
            for (let j = 0; j < chapters.length; j++) {
                let temp = document.createElement("option");
                temp.value = chapters[j];
                temp.innerText = chapters[j];
                chapterSelector.appendChild(temp);
            }
            chapterSelector.addEventListener("change", e => {
                let chapter = files[value][chapterSelector.value];
                if (chapter != undefined) {
                    let images = document.getElementById("images");
                    images.innerHTML = "";
                    let pages = chapter.pages;
                    pages.sort((a, b) => {
                        a = a.split(".")[0];
                        b = b.split(".")[0];
                        if (+a < +b) return -1;
                        if (+a > +b) return 1;
                        return 0;
                    })
                    document.getElementById("scanlator").innerText = "Scanlated by: " + chapter.scanlator;
                    document.getElementById("chapterName").innerText = chapter.title;
                    if (!webtoon) urls = [];
                    for (let k = 0; k < pages.length; k++) {
                        if (webtoon) {
                            let temp = document.createElement("img");
                            temp.src = chapter.baseurl + pages[k];
                            temp.style.maxWidth = "75%";
                            temp.style.height = "auto";
                            images.appendChild(temp);
                        } else {
                            urls.push(chapter.baseurl + pages[k])
                        }
                    }
                    if (!webtoon) {
                        index = 0;
                        let temp = document.createElement("img");
                        temp.src = urls[index];
                        temp.style.width = "auto";
                        temp.style.height = "100%";
                        images.appendChild(temp);
                    }

                }
            })
        }
    })
}
main();
window.addEventListener("keydown", e => {
    e.preventDefault();
    if (webtoon) {
        if (e.key == "ArrowRight") {
            let chapterSelect = document.getElementById("chapterSelect");
            let chapters = chapterSelect.childNodes;
            let current = -1;
            for (let i = 0; i < chapters.length; i++) {
                if (chapters[i].value == chapterSelect.value) {
                    current = i + 1;
                    break;
                }
            }
            if (current < chapters.length) {
                chapterSelect.value = chapters[current].value;
                chapterSelect.dispatchEvent(changeEvent);
                document.getElementById("images").scrollTo(0, 0);
            }
        } else if (e.key == "ArrowLeft") {
            let chapterSelect = document.getElementById("chapterSelect");
            let chapters = chapterSelect.childNodes;
            let current = -1;
            for (let i = 0; i < chapters.length; i++) {
                if (chapters[i].value == chapterSelect.value) {
                    current = i - 1;
                    break;
                }
            }
            if (current >= 0) {
                chapterSelect.value = chapters[current].value;
                chapterSelect.dispatchEvent(changeEvent);
                document.getElementById("images").scrollTo(0, 0);
            }
        }
        else if(e.key == "ArrowDown"){
            let images = document.getElementById("images");
            images.scrollBy({
                top: 300,
                left: 0,
                behavior: "smooth",
              });
        }
        else if(e.key == "ArrowUp"){
            let images = document.getElementById("images");
            images.scrollBy({
                top: -300,
                left: 0,
                behavior: "smooth",
              });
        }
    } else {
        let image = document.getElementById("images").firstElementChild;
        if (e.key == "ArrowLeft" && index > 0) {
            image.src = urls[--index];
        } else if (e.key == "ArrowRight" && index < urls.length - 1) {
            image.src = urls[++index];
        } else if (e.key == "ArrowUp") {
            let chapterSelect = document.getElementById("chapterSelect");
            let chapters = chapterSelect.childNodes;
            let current = -1;
            for (let i = 0; i < chapters.length; i++) {
                if (chapters[i].value == chapterSelect.value) {
                    current = i + 1;
                    break;
                }
            }
            if (current < chapters.length) {
                chapterSelect.value = chapters[current].value;
                chapterSelect.dispatchEvent(changeEvent);
                document.getElementById("images").scrollTo(0, 0);
            }
        } else if (e.key == "ArrowDown") {
            let chapterSelect = document.getElementById("chapterSelect");
            let chapters = chapterSelect.childNodes;
            let current = -1;
            for (let i = 0; i < chapters.length; i++) {
                if (chapters[i].value == chapterSelect.value) {
                    current = i - 1;
                    break;
                }
            }
            if (current >= 0) {
                chapterSelect.value = chapters[current].value;
                chapterSelect.dispatchEvent(changeEvent);
                document.getElementById("images").scrollTo(0, 0);
            }
        }
    }
})
document.getElementById("webtoonMode").addEventListener("change", e => {
    webtoon = !webtoon;
    document.getElementById("chapterSelect").dispatchEvent(changeEvent);
})