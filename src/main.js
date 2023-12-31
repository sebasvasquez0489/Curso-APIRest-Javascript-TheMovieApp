
//Utilizamos axios para las consultas.
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    'Content-Type': 'appication/json;charset=utf-8',
  },
  params: {
    'api_key': API_KEY,
  },
});

/** UTILS - FUNCIONES REUTILIZABLES */
function createMovies(movies, container) {
  container.innerHTML = '';

//Recorremos la información obtenida. 
//Creamos y agregamos los elementos(IMAGENES) con sus clases y atributos dinamicamente.
movies.forEach(movie => {
  const movieContainer = document.createElement('div');
  movieContainer.classList.add('movie-container');
  movieContainer.addEventListener('click', () => {
    location.hash = '#movie=' + movie.id;
  })

  const movieImg = document.createElement('img');
  movieImg.classList.add('movie-img');
  movieImg.setAttribute('alt', movie.title);
  movieImg.setAttribute(
    'src', 
    'https://image.tmdb.org/t/p/w300' + movie.poster_path,
    );
    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
});
}

function createCategories(categories, container) {
  container.innerHTML = "";

//Recorremos la información obtenida. 
//Creamos y agregamos los elementos(IMAGENES) con sus clases y atributos dinamicamente.
  categories.forEach(category => {    
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');

    const categoryTitle = document.createElement('h3');
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id', 'id' + category.id);
    categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

//Llamados ala API
//**** SECCIÓN DE FAVORITOS ****/
/// Creamos la función asincrona y consumimos la información de la API ////
//Utilizamos destructuración para la variable "data" y utilizamos la variable "api" creada con AXIOS.
async function getTrendingMoviesPreview() {
  const { data } = await api('trending/movie/day');
  const movies = data.results;
  console.log(movies);
  createMovies(movies, trendingMoviesPreviewList);
}

//**** SECCIÓN DE CATEGORIAS/GENERO ****/
async function getCategegoriesPreview() {
  const { data } = await api('genre/movie/list?');
  const categories = data.genres;
  
  createCategories(categories, categoriesPreviewList);
}

//**** INGRESAMOS LAS PELICULAS DE CADA CATEGORIA ****/
async function getMoviesByCategory(id) {
  const { data } = await api('discover/movie', {
    params: {
      with_genres: id,
    }
  });
  const movies = data.results;

  createMovies(movies, genericSection);
}

//**** FUNCION PARA BUSQUEDAS ****/
async function getMoviesBySearch(query) {
  const { data } = await api('search/movie', {
    params: {
      query,
    }
  });
  const movies = data.results;

  createMovies(movies, genericSection);
}

//**** SECCION DE TENDENCIAS ****/
async function getTrendingMovies() {
  const { data } = await api('trending/movie/day');
  const movies = data.results;

  createMovies(movies, genericSection);
}

//**** SECCION VISTA DE DETALLES ****/
async function getMovieById(id) {
  const { data: movie } = await api('movie/' + id);

  const movieImgUrl = 'https://image.tmdb.org/t/p/w300' + movie.poster_path;
  console.log(movieImgUrl);
  headerSection.style.background = `
  linear-gradient(
    180deg, 
    rgba(0, 0, 0, 0.35) 19.27%, 
    rgba(0, 0, 0, 0) 29.17%
    ),
  url(${movieImgUrl})`;

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);
  
  getRelatedMoviesId(id);
}

//*** AECCION PARA PELICULAS SUEGERIDAS ****/
async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/recommendations`);
  const getRelatedMovies = data.results;
  
  createMovies(getRelatedMovies, relatedMoviesContainer)
};