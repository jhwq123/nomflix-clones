import styled from "styled-components";
import { useState } from "react";
import { useLocation } from "react-router";
import { useQuery } from "react-query";
import {
  IGetSearchMovieResult,
  IGetSearchTvResult,
  searchMovies,
  searchTvShows,
} from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  height: 200vh;
  background-color: black;
`;

const Header = styled.div`
  height: 100px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  aligh-items: center;
`;

const SlideTitle = styled.h3`
  font-size: 32px;
  margin: 20px;
`;

const Slider = styled.div`
  background-color: white;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-itmes: center;
  margin-bottom: 230px;
`;

const BtnPrev = styled(motion.div)`
  width: 50px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  z-index: 1;
  cursor: pointer;
`;

const BtnNext = styled(motion.div)`
  width: 50px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0;
  z-index: 1;
  cursor: pointer;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 90%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center ccenter;
  height: 200px;
  font-size: 23px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  cursor: pointer;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: (nowBack: boolean) => ({
    x: nowBack ? -window.outerWidth - 10 : window.outerWidth + 10,
  }),
  visible: {
    x: 0,
  },
  exit: (nowBack: boolean) => ({
    x: nowBack ? window.outerWidth + 10 : -window.outerWidth - 10,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.2,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const offset = 6;

function Search() {
  const location = useLocation();
  const keyword = String(new URLSearchParams(location.search).get("keyword"));

  // Movies
  const { data: movieData, isLoading: movieLoading } =
    useQuery<IGetSearchMovieResult>(["movies", keyword], () =>
      searchMovies(keyword)
    );
  const [movieIndex, setMovieIndex] = useState(0);
  const [movieLeaving, setMovieLeaving] = useState(false);
  const [movieBack, setMovieBack] = useState(false);
  const toggleMovieLeaving = () => setMovieLeaving((prev) => !prev);
  const increaseMovieIndex = () => {
    if (movieData) {
      if (movieLeaving) return;
      toggleMovieLeaving();
      const totalMovies = movieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setMovieIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setMovieBack(false);
    }
  };
  const decreaseMovieIndex = () => {
    if (movieData) {
      if (movieLeaving) return;
      toggleMovieLeaving();
      const totalMovies = movieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setMovieIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setMovieBack(true);
    }
  };

  // Tvs
  const { data: tvData, isLoading: tvLoading } = useQuery<IGetSearchTvResult>(
    ["tvs", keyword],
    () => searchTvShows(keyword)
  );
  const [tvIndex, setTvIndex] = useState(0);
  const [tvLeaving, setTvLeaving] = useState(false);
  const [tvBack, setTvBack] = useState(false);
  const toggleTvLeaving = () => setTvLeaving((prev) => !prev);
  const increaseTvIndex = () => {
    if (tvData) {
      if (tvLeaving) return;
      toggleTvLeaving();
      const totalTvs = tvData.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setTvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setTvBack(false);
    }
  };
  const decreaseTvIndex = () => {
    if (tvData) {
      if (tvLeaving) return;
      toggleTvLeaving();
      const totalTvs = tvData.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setTvIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setTvBack(true);
    }
  };

  return (
    <Wrapper>
      {movieLoading && tvLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Header />
          <SlideTitle>Movies</SlideTitle>
          <Slider>
            <BtnPrev onClick={decreaseMovieIndex} whileHover={{ scale: 1.1 }}>
              PREV
            </BtnPrev>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleMovieLeaving}
              custom={movieBack}
            >
              <Row
                custom={movieBack}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={movieIndex}
              >
                {movieData?.results
                  .slice(1)
                  .slice(offset * movieIndex, offset * movieIndex + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <BtnNext onClick={increaseMovieIndex} whileHover={{ scale: 1.1 }}>
              NEXT
            </BtnNext>
          </Slider>
          <SlideTitle>Tvs</SlideTitle>
          <Slider>
            <BtnPrev onClick={decreaseTvIndex} whileHover={{ scale: 1.1 }}>
              PREV
            </BtnPrev>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleTvLeaving}
              custom={tvBack}
            >
              <Row
                custom={tvBack}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={tvIndex}
              >
                {tvData?.results
                  .slice(1)
                  .slice(offset * tvIndex, offset * tvIndex + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <BtnNext onClick={increaseTvIndex} whileHover={{ scale: 1.1 }}>
              NEXT
            </BtnNext>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
