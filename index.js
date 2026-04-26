/* film item structure 
<div class="film">
                <img class="poster-img" src="images/poster.png" alt="">
                <div class="film-info">

                    <div class="film-title">
                        <h3>Blade Runner</h3>
                        <img src="images/rate-ico.png" alt="">
                        8.1
                    </div>
                    <div class="film-details">
                        <p>160 min</p>
                        <p>action drama</p>
                        <button><img class="add-icon" src="images/add.png" alt="">
                            <p>Watchlist</p>
                        </button>
                    </div>

                    <p class="film-desc">A blade runner must pursue and terminate four replicants who stole a ship in
                        space, and have returned to Earth to find their creator.</p>

                </div>

            </div>

*/

// title , poster , rate , length, genre, desc

const searchInpt = document.getElementById('search')
const searchBtn = document.getElementById('search-btn')
const filmContainer = document.getElementById('film-list')
const watchlistBtn = document.getElementById('watchlist-btn')
const watchlistContainer = document.getElementById('watch-list')
let filmList = []
let watchList

async function fetchResults(searchQuery) {

    filmList = []

    // its a free apikey - create your own key here : www.omdbapi.com
    const response = await fetch(`https://www.omdbapi.com/?s=${searchQuery}&type=movie&apikey=4fd5fb45`)
    const data = await response.json()
    if (data.Response == "True") {
        for (const film of data.Search) {
            const detailsResponse = await fetch(`https://www.omdbapi.com/?i=${film.imdbID}&apikey=4fd5fb45`)
            const details = await detailsResponse.json()

            filmList.push({
                title: film.Title,
                poster: film.Poster,
                rate: details.imdbRating,
                length: details.Runtime,
                genre: details.Genre,
                desc: details.Plot,
                id: film.imdbID,

            })
        }
        return filmList
    }
    return null

}

function isWatchlist(filmId) {
    if (!localStorage.getItem('watchList')) {
       localStorage.setItem('watchList','[]')
    }
    const watchList = JSON.parse(localStorage.getItem('watchList') || '[]');
    return watchList.some(film => film.id === filmId);
}

function renderFilms(filmList) {
    let html = ''
    for (let film of filmList) {
        html +=
            `
         <div class="film">
                <img class="poster-img" src="${film.poster}" alt="">
                <div class="film-info">

                    <div class="film-title">
                        <h3>${film.title}</h3>
                        <img src="images/rate-ico.png" alt="">
                        ${film.rate}
                    </div>
                    <div class="film-details">
                        <p>${film.length}</p>
                        <p>${film.genre}</p>
                        ${!isWatchlist(film.id) ? ` <button id='watchlist-btn' data-film-id="${film.id}" ><img class="add-icon" src="images/add.png" alt="">
                            <p>Watchlist</p>
                        </button>
                    </div>` : `
                    <button id='remove-btn' data-film-id="${film.id}" >
                    <img class="remove-icon" src="images/remove.png" alt="">
                            <p>Remove</p>
                            </button>
                            </div>
                            `}
                       
                    <p class="film-desc">${film.desc}</p>

                </div>

            </div>

        `

    }
    filmContainer.innerHTML = html
}

function renderWatchlist() {
    const watchList = JSON.parse(localStorage.getItem('watchList') || '[]');
    if (watchList.length>0){
        watchlistContainer.style.justifyContent = 'start'
        let html = '';
    for (const film of watchList) {
        html +=
            `
         <div class="film">
                <img class="poster-img" src="${film.poster}" alt="">
                <div class="film-info">

                    <div class="film-title">
                        <h3>${film.title}</h3>
                        <img src="images/rate-ico.png" alt="">
                        ${film.rate}
                    </div>
                    <div class="film-details">
                        <p>${film.length}</p>
                        <p>${film.genre}</p>
                        ${!isWatchlist(film.id) ? ` <button id='watchlist-btn' data-film-id="${film.id}" ><img class="add-icon" src="images/add.png" alt="">
                            <p>Watchlist</p>
                        </button>
                    </div>` : `
                    <button id='remove-btn' data-film-id="${film.id}" >
                    <img class="remove-icon" src="images/remove.png" alt="">
                            <p>Remove</p>
                            </button>
                            </div>
                            `}
                       
                    <p class="film-desc">${film.desc}</p>

                </div>

            </div>

        `
        watchlistContainer.innerHTML = html;

    }

    }else{
        watchlistContainer.style.justifyContent = 'center'
        watchlistContainer.innerHTML= `
          <h2>Your watchlist is looking a little empty...</h2>
            <div class="empty">
                <a href="/index.html">
                    <img width="30" src="images/add.png" alt="">
                    <h3>Let’s add some movies!</h3>
                </a>
        `
    }
   
}

async function searchFilm(event) {
    const searchQuery = searchInpt.value
    const list = await fetchResults(searchQuery)
    if (list) {
        await renderFilms(list)
    } else {
        filmContainer.innerHTML = `<h2 style="color:white  width:80%">Unable to find what you’re looking for.<br> Please try another search.</h2>`
    }

}

function addToWatchlist(event) {

    const watchList = localStorage.getItem('watchList') || '[]';
    const btn = event.target.closest('#watchlist-btn')
    let newWatchlist = JSON.parse(watchList)
    const selectedFilm = filmList.find(
        film => film.id === btn.dataset.filmId);
    newWatchlist.push(selectedFilm);
    localStorage.setItem('watchList', JSON.stringify(newWatchlist))
    btn.innerHTML = `
    <img class="remove-icon" src="images/remove.png" alt="">
                            <p>Remove</p>
    `
    btn.id = 'remove-btn'
    renderWatchlist()

}

function removeFilm(event) {

    const watchList = localStorage.getItem('watchList') || '[]';
    let newWatchlist = JSON.parse(watchList);
    const btn = event.target.closest('#remove-btn')
    newWatchlist = newWatchlist.filter((film => {
      
        return film.id != btn.dataset.filmId
    }))
    localStorage.setItem('watchList', JSON.stringify(newWatchlist))
    btn.innerHTML = `
        <img class="add-icon" src="images/add.png" alt="">
                                <p>Watchlist</p>
        `
    btn.id = 'watchlist-btn'
    renderWatchlist()

}


document.addEventListener('click', (e) => {

    if (e.target.closest('#watchlist-btn')) {
        console.log('event listiner', e)
        addToWatchlist(e)
    }
    if (e.target.closest('#search-btn')) {
        searchFilm(e)
    }
    if (e.target.closest('#remove-btn')) {
        removeFilm(e)
    }

})

if (window.location.pathname === '/watchlist.html') {
    document.addEventListener('DOMContentLoaded', () => {
        renderWatchlist()
        
    });
}