const loadingbox = document.getElementById('namur');
const errorbox = document.getElementById('ace');
const topgrid = document.getElementById('topgrid');

function showloading() {
    loadingbox.style.display = 'block';
    errorbox.style.display = 'none';
    topgrid.innerHTML = '';
}

function showerror(msg) {
    loadingbox.style.display = 'none';
    errorbox.style.display = 'block';
    document.getElementById('luffy').textContent = msg;
}

function hideloading() {
    loadingbox.style.display = 'none';
}

function buildcard(a) {
    const id = a.mal_id;
    const img = a.images?.jpg?.image_url || '';
    const title = a.title || 'Unknown';
    const score = a.score ? a.score : '-';
    const eps = a.episodes ? a.episodes + ' eps' : '?? eps';
    return `
        <a class="animecard" href="animedetail.html?id=${id}">
            <img src="${img}" class="animeposter" alt="${title}" onerror="this.src='https://via.placeholder.com/200x300/0d1a4a/fff?text=No+Image'">
            <div class="animecardinfo">
                <div class="animecardtitle">${title}</div>
                <div class="animecardmeta">
                    <span class="scorestar">${score}</span>
                    <span class="animecardtag">${eps}</span>
                </div>
            </div>
        </a>
    `;
}

async function loadTop(type, btn) {
    showloading();
    document.querySelectorAll('.haruta').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    try {
        const res = await fetch(`https://api.jikan.moe/v4/top/anime?type=${type}&limit=24`);
        const data = await res.json();
        hideloading();
        if (data.data && data.data.length > 0) {
            topgrid.innerHTML = data.data.map(buildcard).join('');
        } else {
            showerror('Failed to load top anime.');
        }
    } catch (e) {
        showerror('Something went wrong. Check your connection!');
    }
}

loadTop('bypopularity', document.querySelector('.haruta.active'));