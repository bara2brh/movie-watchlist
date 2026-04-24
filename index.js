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

// title , poster , rate , length, Genre, desc

const searchInpt = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const filmContainer = document.getElementById('film-list');
let filmList = []

async function fetchResults(searchQuery){
    // its a free apikey 
    const response = await fetch(`https://www.omdbapi.com/?s=${searchQuery}&type=movie&apikey=4fd5fb45#`)
    const data = await response.json();
    console.log(data)
    for (const film of data.Search ){
        let currentFilm = {}    
        currentFilm.title = film.Title 
        currentFilm.poster = film.Poster
        fetch(`https://www.omdbapi.com/?i=${film.imdbID}&type=movie&apikey=4fd5fb45#`)
        .then(response=>response.json())
        .then(data=>{
            currentFilm.rate = data.Ratings[0].Value;
            currentFilm.length = data.Runtime;
            currentFilm.Genre = data.Genre;
            currentFilm.desc = data.Plot;
        })
        filmList.push(currentFilm)
    }
    console.log(filmList)


}