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


async function fetchResults(searchQuery){
    let filmList = []
    // its a free apikey 
   const response = await fetch(`https://www.omdbapi.com/?s=${searchQuery}&type=movie&apikey=4fd5fb45`);
    const data = await response.json();
    if(data.Response=="True"){
        for (const film of data.Search) {
                const detailsResponse = await fetch(`https://www.omdbapi.com/?i=${film.imdbID}&apikey=4fd5fb45`);
                const details = await detailsResponse.json();

                filmList.push({
                    title: film.Title,
                    poster: film.Poster,
                    rate: details.imdbRating,
                    length: details.Runtime,
                    Genre: details.Genre,
                    desc: details.Plot
                });
            }
            return filmList;
    }
    return null
    
}

function renderFilms(filmList){
    let html='';
    for(let film of filmList)
    {
        html+=
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
                        <p>${film.Genre}</p>
                        <button><img class="add-icon" src="images/add.png" alt="">
                            <p>Watchlist</p>
                        </button>
                    </div>

                    <p class="film-desc">${film.desc}</p>

                </div>

            </div>

        `
    }
    filmContainer.innerHTML = html;
}

searchBtn.addEventListener('click',async()=>{
    const searchQuery = searchInpt.value;
    const list = await fetchResults(searchQuery);
    if(list){
        await renderFilms(list);
    }else {
        filmContainer.innerHTML = `<h2 style="color:white; width:80%">Unable to find what you’re looking for.<br> Please try another search.</h2>`
    }
})