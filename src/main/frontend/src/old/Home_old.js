import {useEffect, useState} from "react";
import Movie from "./Movie";

function Home_old(){
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);

    const getMovies = async() => {
        return await (
            await fetch(
                `https://yts.mx/api/v2/list_movies.json?minimum_rating=8.5&sort_by=year`
            )
        ).json();
    }

    useEffect(() => {
        getMovies().then((json) => {
            setMovies(json.data.movies);
            setLoading(false);
        });
    }, []);

    return (
        <div>
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                movies.map((movie) => (
                    <Movie
                        key={movie.id}
                        id={movie.id}
                        coverImg={movie.medium_cover_image}
                        title={movie.title}
                        summary={movie.summary}
                        genres={movie.genres}
                    />
                ))
            )}
        </div>
    )
}

export default Home_old;