const searchfield = document.getElementById('izo');
const searchbtn = document.getElementById('jozu');
const loadingbox = document.getElementById('namur');
const errorbox = document.getElementById('ace');
const resultsbox = document.getElementById('zoro');
const dropdown = document.getElementById('atmos');

function showloading(){
    loadingbox.style.display='block';
    errorbox.style.display='none';
    resultsbox.innerHTML='';
    dropdown.style.display='none';
}

function showerror(msg){
    loadingbox.style.display='none';
    errorbox.style.display='block';
    document.getElementById('luffy').textContent=msg;
}

function hideloading(){
    loadingbox.style.display='none';
}

function buildcard(a){
    const id = a.mal_id;
    const img = a.images?.jpg?.image_url || '';
    const title = a.title || 'Unknown';
    const score = a.score ? a.score : '-';
    const eps = a.episodes ? a.episodes + ' eps' : '?? eps';
    const status = a.status || '';
    return `
        <a class="animecard" href="animedetail.html?id=${id}">
            <img src="${img}" class="animeposter" alt="${title}" onerror="this.src='https://via.placeholder.com/200x300/0d1a4a/fff?text=No+Image'">
            <div class="animecardinfo">
                <div class="animecardtitle">${title}</div>
                <div class="animecardmeta">
                    <span class="scorestar">&#9733; ${score}</span>
                    <span class="animecardtag">${eps}</span>
                </div>
            </div>
        </a>
    `;
}

async function searchAnime(name){
    if(!name) name = searchfield.value.trim();
    if(!name) return;
    searchfield.value = name;
    showloading();
    try{
        const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(name)}&limit=20`);
        const data = await res.json();
        hideloading();
        if(data.data && data.data.length > 0){
            resultsbox.innerHTML = `
                <div class="resultstitle">Results for "${name}" &mdash; ${data.data.length} found</div>
                <div class="resultsgrid">
                    ${data.data.map(buildcard).join('')}
                </div>
            `;
        } else {
            showerror(`No anime found for "${name}". Try another name!`);
        }
    } catch(e){
        showerror('Something went wrong. Check your connection!');
    }
}

let searchtimer;
searchfield.addEventListener('input', ()=>{
    clearTimeout(searchtimer);
    const val = searchfield.value.trim();
    if(val.length < 2){ dropdown.style.display='none'; return; }
    searchtimer = setTimeout(async ()=>{
        try{
            const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(val)}&limit=5`);
            const data = await res.json();
            if(data.data && data.data.length > 0){
                dropdown.innerHTML = data.data.map(a=>`
                    <a class="dropitem" href="animedetail.html?id=${a.mal_id}">
                        <img src="${a.images?.jpg?.image_url||''}" alt="${a.title}" onerror="this.style.display='none'">
                        <div class="dropinfo">
                            <span class="droptitle">${a.title}</span>
                            <span class="dropsub">${a.episodes ? a.episodes+' eps' : '??'} &middot; ${a.score||'-'} &#9733;</span>
                        </div>
                    </a>
                `).join('');
                dropdown.style.display='block';
            } else {
                dropdown.style.display='none';
            }
        } catch(e){
            dropdown.style.display='none';
        }
    }, 400);
});

searchbtn.addEventListener('click', ()=> searchAnime(searchfield.value.trim()));
searchfield.addEventListener('keydown', e=>{ if(e.key==='Enter') searchAnime(searchfield.value.trim()); });
document.addEventListener('click', e=>{ if(!e.target.closest('.vista')) dropdown.style.display='none'; });
