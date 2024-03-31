// Variables

const url = "http://localhost:8080";
let selection = undefined;
let selectTitle = undefined;
let scanlations = {};

// Function

const HtmlEncode = (s) => {
  return s.replaceAll(" ", "+").replaceAll("&", "and").replaceAll("=", "equals");
}

const overlay = (onoff) => {
    let ele = document.getElementById("overlay");
    if(onoff){
        ele.style.visibility = "visible";
        ele.style.pointerEvents = "all";
    }else{
        ele.style.visibility = "hidden";
        ele.style.pointerEvents = "none";
    }
}

const select = (id, funny) => {
    selection = id;
    selectTitle = funny;
    document.getElementById("current").innerText ="Current Selection: "+funny;
}

const submit = async () => {
    let query = document.getElementById("searchBox").value;
    let results = await fetch(url + "/search?title=" + query);
    results = await results.json();
    results = results.data;
    console.log(results);
    let keys = Object.keys(results);
    let output = document.getElementById("output");
    selection = undefined;
    output.innerHTML = "";
    for (let i = 0; i < keys.length; i++) {
        let item = results[keys[i]];
        let attributes = item.attributes;

        // get stuff

        //get id
        let id = item.id;

        // get title
        let title = "Unknown";
        try {
            // get official title
            title = attributes.title.en;
        } catch {
            // official title unavailable
            altTitles = attributes.altTitles;
            for (let j = 0; j < altTitles.length; j++) {
                // get and check langauge
                let lang = Object.keys(altTitles[j])
                if (lang = "en") {
                    title = altTitles[j].en;
                    break;
                }
                // use Romanized Japanese
                else if (title == "Unknown" && lang == "ja-ro") {
                    title = altTitles[j]["ja-ro"];
                    break;
                }
            }
        }

        // get description
        let description = "Empty"
        try {
            description = attributes.description.en;
        } catch {
            if (Object.keys(attributes.description).length > 0) {
                attributes.description[Object.keys(attributes.description)[0]];
            }
        }

        // get cover art
        let coverData = undefined;
        let relationships = item.relationships;
        for (let j = 0; j < relationships.length; j++) {
            relationship = relationships[j];
            if (relationship.type == "cover_art") {
                coverData = "https://uploads.mangadex.org/covers/" + id + "/" + relationship.attributes.fileName;
                break;
            }
        }

        /*
        Item example
        <img class="icon" src="./testingstuff/cb980d1e-4d2a-492e-9ca5-399bd21c02b3.jpg">
        <div class="bookTitle">Chainsaw Man</div>
        <div class="bookDescription">Broke young man + chainsaw dog demon = Chainsaw Man! The name says it all! Denji's life of poverty is changed forever when he merges with his pet chainsaw dog, Pochita! Now he's living in the big city and an official Devil Hunter. But he's got a lot to learn about his new job and chainsaw powers!</div>
        <button class="select" on>Select</button>
        */

        // Create item in results

        let iconElement = document.createElement("img");
        iconElement.className = "icon";
        if (coverData != undefined) {
            iconElement.src = coverData;
        } else {
            iconElement.src = "./cover-placeholder.jpg";
        }

        let titleElement = document.createElement("div");
        titleElement.className = "bookTitle";
        titleElement.innerText = title;

        let descriptionElement = document.createElement("div");
        descriptionElement.className = "bookDescription";
        descriptionElement.innerText = description;

        let selectButton = document.createElement("button");
        selectButton.className = "select";
        selectButton.setAttribute("onclick", 'select("' + id + '", "'+ title +'")');
        selectButton.innerText = "Select";

        let itemElement = document.createElement("div");
        itemElement.className = "item";
        itemElement.appendChild(iconElement);
        itemElement.appendChild(titleElement);
        itemElement.appendChild(descriptionElement);
        itemElement.appendChild(selectButton);

        output.appendChild(itemElement);
    }
}

const download = async () => {
    if (selection != undefined) {
        let chapters = await fetch(url + "/manga?id=" + selection);
        chapters = await chapters.json();
        chapters = chapters.data;
        overlay(true);
        let status = document.getElementById("status");
        for (let i = 0; i < chapters.length; i++) {
            chapter = chapters[i];
            let id = chapter.id;
            let num = chapter.attributes.chapter;
            let chapterTitle = chapter.attributes.title;
            let group = undefined;
            let relationships = chapter.relationships;
            for (let j = 0; j < relationships.length; j++) {
                relationship = relationships[j];
                if (relationship.type == "scanlation_group") {
                    group = relationship.id;
                    break;
                }
            }

            if(scanlations[group] != undefined){
                group = scanlations[group];
            }
            else if (group != undefined ) {
                let temp = group;
                group = await fetch(url + "/group?id=" + group);
                group = await group.json();
                group = group.data.attributes.name;
                scanlations[temp] = group;
            }
            else {
                group = "UNKNOWN"
            }

            group = group.replaceAll("&", "");

            status.innerText = "Currently Downloading: Chapter "+num;
            let r = await fetch(url+`/download?id=${id}&num=${num}&title="${HtmlEncode(selectTitle)}"&group="${HtmlEncode(group)}"&chapterTitle="${HtmlEncode(chapterTitle)}"`);
            console.log(r.status);  
            if(r.status!=400){         
                for(let k = 3; k > 0; k--){
                    status.innerText = "Done, waiting "+k+" seconds to avoid rate limit";
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
            if(r.status==500){
                status.innerText = await r.text();
                break;
            }
        }
        status.innerText = "";
        overlay(false);
    }
}

// Keylisteners

document.addEventListener('keydown', (e) => {
    if (e.code === "Enter") {
        submit();
    }
})