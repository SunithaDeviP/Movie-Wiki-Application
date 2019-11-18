//RETRIEVE TEXT BOX VALUE
const searchInput = window.localStorage.getItem('value');

const INITIAL_SEARCH_VALUE = 'spiderman';
const log = console.log;

//GET THE FIRST ELEMENT ELEMENT THAT MATCHES THE SELECTORS
const moviesContainer = document.querySelector('#movies-container');
const moviesSearchable = document.querySelector('#movies-searchable');

//DYNAMICALLY CREATING AN IMAGE CONTAINER TO DISPLAY THE SEARCH MOVIE POST
function createImageContainer(imageUrl, id) {
    const tempDiv = document.createElement('div');
    tempDiv.setAttribute('class', 'imageContainer');
    tempDiv.setAttribute('data-id', id);

    //MOVIE POSTER URL
    const movieElement = `
        <img src="${imageUrl}" alt="" data-movie-id="${id}">
    `;
    tempDiv.innerHTML = movieElement;
    return tempDiv;
}

//RESET THE INITIAL TEXTBOX VALUE
function resetInput() {
    searchInput.value = '';
}

//HANDLING THE ERROR AND POPUP ALERT MESSAGE IF ERROR OCCURS
function handleGeneralError(error) {
    log('Error: ', error.message);
    alert(error.message || 'Internal Server');
}

//CREATING A VIDEO FRAME TO DISPLAY THE MOVIE TRAILER VIDEOS
function createIframe(video) {
    const videoKey = (video && video.key) || 'No key found!!!';
    const iframe = document.createElement('iframe');
    iframe.src = `http://www.youtube.com/embed/${videoKey}`;
    iframe.width = 360;
    iframe.height = 315;
    iframe.allowFullscreen = true;
    return iframe;
}


function insertIframeIntoContent(video, content) {
    const videoContent = document.createElement('div');
    const iframe = createIframe(video);
    videoContent.appendChild(iframe);
    content.appendChild(videoContent);
}

//CREATING THE OUTER LAYOUT TO DISPLAY THE VIDEO
function createVideoTemplate(data) {

    //CREATING A CROSS BUTTON TO CLOSE THE TRAILER
    const content = this.content;
    content.innerHTML = '<p id="content-close">X</p>';
    const videos = data.results || [];

    //IF NO VIDEOS FOUND DISPLAY THE MESSAGE
    if (videos.length === 0) {
        content.innerHTML = `
            <p id="content-close">X</p>
            <p>No Trailer found for this video id of ${data.id}</p>
        `;
        return;
    }

    //IF VIDEOS FOUND DISPLAY THE FIRST 3 VIDEOS
    for (let i = 0; i < 3; i++) {
        const video = videos[i];
        insertIframeIntoContent(video, content);
    }
}

function createSectionHeader(title) {
    const header = document.createElement('h2');
    header.innerHTML = title;
    return header;
}


function renderMovies(data) {
    const moviesBlock = generateMoviesBlock(data);
    const header = createSectionHeader(this.title);
    moviesBlock.insertBefore(header, moviesBlock.firstChild);
    moviesContainer.appendChild(moviesBlock);
}



function renderSearchMovies(data) {
    moviesSearchable.innerHTML = '';
    const moviesBlock = generateMoviesBlock(data);
    moviesSearchable.appendChild(moviesBlock);
}


//CREATE A MOVIE BLOCK TO DISPLAY THE SEARCH RESULT OF THE MOVIES
function generateMoviesBlock(data) {
    const movies = data.results;

    //DYNAMICALLY CREATING A TAG WITH ID
    const section = document.createElement('section');
    section.setAttribute('class', 'section');

    //DISPLAY ALL THE MOVIES THAT SATISFY THE INPUT
    for (let i = 0; i < movies.length; i++) {
        const { poster_path, id } = movies[i];

        if (poster_path) {
            const imageUrl = MOVIE_DB_IMAGE_ENDPOINT + poster_path;

            const imageContainer = createImageContainer(imageUrl, id);
            section.appendChild(imageContainer);
        }
    }

    const movieSectionAndContent = createMovieContainer(section);
    return movieSectionAndContent;
}



//MOVIE CONTAINER THAT CONATINS THE MOVIES POSTER
function createMovieContainer(section) {
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class', 'movie');

    const template = `
        <div class="content">
            <p id="content-close">X</p>
        </div>
    `;

    movieElement.innerHTML = template;
    movieElement.insertBefore(section, movieElement.firstChild);
    return movieElement;
}

//CLICK ON ANY MOVIE TO DISPLAY THE MOVIE TRAILER
document.onclick = function(event) {
    log('Event: ', event);
    const { tagName, id } = event.target;
    if (tagName.toLowerCase() === 'img') {
        const movieId = event.target.dataset.movieId;
        const section = event.target.parentElement.parentElement;
        const content = section.nextElementSibling;
        content.classList.add('content-display');
        getVideosByMovieId(movieId, content);
    }

    if (id === 'content-close') {
        const content = event.target.parentElement;
        content.classList.remove('content-display');
    }
}


searchMovie(searchInput);
searchUpcomingMovies();
getTopRatedMovies();
searchPopularMovie();
getTrendingMovies();