const loadingbox = document.getElementById('namur');
const errorbox = document.getElementById('ace');
const detailwrap = document.getElementById('detailwrap');

function showloading() {
    loadingbox.style.display = 'block';
    errorbox.style.display = 'none';
    detailwrap.style.display = 'none';
}

function showerror(msg) {
    loadingbox.style.display = 'none';
    errorbox.style.display = 'block';
    document.getElementById('luffy').textContent = msg;
}

function hideloading() {
    loadingbox.style.display = 'none';
}

function getParam(key) {
    return new URLSearchParams(window.location.search).get(key);
}

async function loadDetail() {
    const id = getParam('id');
    if (!id) {
        showerror('No anime ID provided.');
        return;
    }

    showloading();

    try {
        const [animeRes, charsRes] = await Promise.all([
            fetch(`https://api.jikan.moe/v4/anime/${id}/full`),
            fetch(`https://api.jikan.moe/v4/anime/${id}/characters`)
        ]);

        const animeData = await animeRes.json();
        const charsData = await charsRes.json();

        hideloading();

        if (!animeData.data) {
            showerror('Anime not found.');
            return;
        }

        const a = animeData.data;
        const chars = (charsData.data || []).slice(0, 12);

        const trailer = a.trailer?.embed_url
            ? `<div class="detailblock">
                <div class="detailblocktitle">Trailer</div>
                <iframe class="trailerframe" src="${a.trailer.embed_url}" allowfullscreen loading="lazy"></iframe>
               </div>`
            : '';

        const charsHtml = chars.length > 0
            ? `<div class="detailblock">
                <div class="detailblocktitle">Characters</div>
                <div class="charsgrid">
                    ${chars.map(c => `
                        <div class="charcard">
                            <img class="charimg"
                                src="${c.character?.images?.jpg?.image_url || ''}"
                                alt="${c.character?.name || ''}"
                                onerror="this.src='https://via.placeholder.com/80x80/0d1a4a/fff?text=?'">
                            <div class="charname">${c.character?.name || 'Unknown'}</div>
                        </div>
                    `).join('')}
                </div>
               </div>`
            : '';

        const genres = (a.genres || []).map(g => `<span class="detailgenretag">${g.name}</span>`).join('');
        const studios = (a.studios || []).map(s => s.name).join(', ') || '—';
        const aired = a.aired?.string || '—';
        const score = a.score || '—';
        const rank = a.rank ? '#' + a.rank : '—';
        const episodes = a.episodes || '??';
        const status = a.status || '—';
        const rating = a.rating || '—';
        const synopsis = a.synopsis || 'No synopsis available.';
        const title = a.title || 'Unknown';
        const titleEn = a.title_english && a.title_english !== a.title ? a.title_english : '';
        const poster = a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || '';

        detailwrap.innerHTML = `
            <a href="javascript:history.back()" class="backhome">← Back</a>
            <div class="detailtop">
                <img class="detailposter"
                    src="${poster}"
                    alt="${title}"
                    onerror="this.src='https://via.placeholder.com/280x400/0d1a4a/fff?text=No+Image'">
                <div class="detailinfo">
                    <div>
                        <div class="detailtitle">${title}</div>
                        ${titleEn ? `<div class="detailsub">${titleEn}</div>` : ''}
                    </div>
                    <div class="detailstats">
                        <div class="detailstat">
                            <span class="detailstatval">${score}</span>
                            <span class="detailstatlabel">Score</span>
                        </div>
                        <div class="detailstat">
                            <span class="detailstatval">${rank}</span>
                            <span class="detailstatlabel">Rank</span>
                        </div>
                        <div class="detailstat">
                            <span class="detailstatval">${episodes}</span>
                            <span class="detailstatlabel">Episodes</span>
                        </div>
                        <div class="detailstat">
                            <span class="detailstatval" style="font-size:13px;padding-top:4px;">${status}</span>
                            <span class="detailstatlabel">Status</span>
                        </div>
                    </div>
                    ${genres ? `<div class="detailgenres">${genres}</div>` : ''}
                    <div class="detailsub">Studio: ${studios}</div>
                    <div class="detailsub">Aired: ${aired}</div>
                    <div class="detailsub">Rating: ${rating}</div>
                </div>
            </div>

            <div class="detailblock">
                <div class="detailblocktitle">Synopsis</div>
                <p class="synopsis">${synopsis}</p>
            </div>

            ${charsHtml}
            ${trailer}
        `;

        detailwrap.style.display = 'block';
        document.title = title + ' — Anime Search';

    } catch (e) {
        showerror('Something went wrong. Check your connection!');
    }
}

loadDetail();