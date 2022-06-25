const axios = require("axios")


async function getAllMovies(){
    data = null
    await axios.get("https://ghibliapi.herokuapp.com/films").then((movies) => {
        data = movies.data
    }).catch((err) => {
        console.log(err)
    })
    return data
}

async function getPeopleFromMovie(movie){
    await getAllMovies().then((movies) => {
        for(var i = 0; i < movies.length; i++){
            if(movies[i].title.toLowerCase() == movie.toLowerCase()){
                console.log(movies[i].people)
                return movies[i].people
            }
        }
    }).catch((err) => {
        console.log(err)
    })
}

async function getAllPeople(){
    await axios.get("https://ghibliapi.herokuapp.com/people").then((res) => {
        console.log(res)
    }).catch((err) => {
        console.log(err)
    })
}

async function getPerson(){

}

module.exports = {
    getAllMovies,
    getAllPeople,
    getPeopleFromMovie
}