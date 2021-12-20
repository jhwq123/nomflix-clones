import styled from "styled-components";
import { useQuery } from "react-query";
import {
  nowMovies,
  topRatedMovies,
  upcomingMovies,
  IGetNowMoviesResult,
  IGetTopRatedMoviesResult,
  IGetUpcomingMoviesResult,
} from "../api";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  height: 200vh;
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  aligh-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: red;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 36px;
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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -100px;
`;

const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 15px;
  position: relative;
  top: -80px;
`;

const BigVote = styled.div`
  width: 400px;
  height: 70px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  top: -100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin-bottom: 30px;
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

function Home() {
  const history = useHistory();
  const { scrollY } = useViewportScroll();

  // Now playing Movies
  const { data: nowData, isLoading: nowLoading } =
    useQuery<IGetNowMoviesResult>(["movies", "nowPlaying"], nowMovies);
  const [nowIndex, setNowIndex] = useState(0);
  const [nowLeaving, setNowLeaving] = useState(false);
  const [nowBack, setNowBack] = useState(false);
  const increaseNowIndex = () => {
    if (nowData) {
      if (nowLeaving) return;
      toggleNowLeaving();
      const totalMovies = nowData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setNowIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setNowBack(false);
    }
  };
  const decreaseNowIndex = () => {
    if (nowData) {
      if (nowLeaving) return;
      toggleNowLeaving();
      const totalMovies = nowData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setNowIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setNowBack(true);
    }
  };
  const toggleNowLeaving = () => setNowLeaving((prev) => !prev);

  // top rated movies
  const { data: topData, isLoading: topLoading } =
    useQuery<IGetTopRatedMoviesResult>(["movies", "top"], topRatedMovies);
  const [topIndex, setTopIndex] = useState(0);
  const [topLeaving, setTopLeaving] = useState(false);
  const [topBack, setTopBack] = useState(false);
  const increaseTopIndex = () => {
    if (topData) {
      if (topLeaving) return;
      toggleTopLeaving();
      const totalMovies = topData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setTopBack(false);
    }
  };
  const decreaseTopIndex = () => {
    if (topData) {
      if (topLeaving) return;
      toggleTopLeaving();
      const totalMovies = topData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTopIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setTopBack(true);
    }
  };
  const toggleTopLeaving = () => setTopLeaving((prev) => !prev);

  // Upcoming movies
  const { data: upData, isLoading: upComing } =
    useQuery<IGetUpcomingMoviesResult>(["movies", "up"], upcomingMovies);
  const [upIndex, setUpIndex] = useState(0);
  const [upLeaving, setUpLeaving] = useState(false);
  const [upBack, setUpBack] = useState(false);
  const toggleUpLeaving = () => setUpLeaving((prev) => !prev);
  const increaseUpIndex = () => {
    if (upData) {
      if (upLeaving) return;
      toggleUpLeaving();
      const totalMovies = upData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setUpIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setUpBack(false);
    }
  };
  const decreaseUpIndex = () => {
    if (upData) {
      if (upLeaving) return;
      toggleUpLeaving();
      const totalMovies = upData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setUpIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setUpBack(true);
    }
  };

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const onOverlayClick = () => history.push("/");
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const clickedNowMovie =
    bigMovieMatch?.params.movieId &&
    nowData?.results.find(
      (movie) => movie.id + "" === bigMovieMatch?.params.movieId
    );
  const clickedTopMovie =
    bigMovieMatch?.params.movieId &&
    topData?.results.find(
      (movie) => movie.id + "" === bigMovieMatch?.params.movieId
    );
  const clickedUpMovie =
    bigMovieMatch?.params.movieId &&
    upData?.results.find(
      (movie) => movie.id + "" === bigMovieMatch?.params.movieId
    );
  return (
    <Wrapper>
      {nowLoading && topLoading && upComing ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(nowData?.results[0].backdrop_path || "")}
          >
            <Title>{nowData?.results[0].title}</Title>
            <Overview>{nowData?.results[1].overview}</Overview>
          </Banner>
          <SlideTitle>Now Playing Movies</SlideTitle>
          <Slider>
            <BtnPrev onClick={decreaseNowIndex} whileHover={{ scale: 1.1 }}>
              PREV
            </BtnPrev>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleNowLeaving}
              custom={nowBack}
            >
              <Row
                custom={nowBack}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={nowIndex}
              >
                {nowData?.results
                  .slice(1)
                  .slice(offset * nowIndex, offset * nowIndex + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      variants={boxVariants}
                      onClick={() => onBoxClicked(movie.id)}
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
            <BtnNext onClick={increaseNowIndex} whileHover={{ scale: 1.1 }}>
              NEXT
            </BtnNext>
          </Slider>
          <SlideTitle>Top Rated Movies</SlideTitle>
          <Slider>
            <BtnPrev onClick={decreaseTopIndex} whileHover={{ scale: 1.1 }}>
              PREV
            </BtnPrev>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleTopLeaving}
              custom={topBack}
            >
              <Row
                custom={topBack}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={topIndex}
              >
                {topData?.results
                  .slice(1)
                  .slice(offset * topIndex, offset * topIndex + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      variants={boxVariants}
                      onClick={() => onBoxClicked(movie.id)}
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
            <BtnNext onClick={increaseTopIndex} whileHover={{ scale: 1.1 }}>
              NEXT
            </BtnNext>
          </Slider>
          <SlideTitle>Upcomming Movies</SlideTitle>
          <Slider>
            <BtnPrev onClick={decreaseUpIndex} whileHover={{ scale: 1.1 }}>
              PREV
            </BtnPrev>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleUpLeaving}
              custom={upBack}
            >
              <Row
                custom={upBack}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={upIndex}
              >
                {upData?.results
                  .slice(1)
                  .slice(offset * upIndex, offset * upIndex + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      variants={boxVariants}
                      onClick={() => onBoxClicked(movie.id)}
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
            <BtnNext onClick={increaseUpIndex} whileHover={{ scale: 1.1 }}>
              NEXT
            </BtnNext>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{
                    top: scrollY.get() + 100,
                  }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedNowMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedNowMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedNowMovie.title}</BigTitle>
                      <BigOverview>{clickedNowMovie.overview}</BigOverview>
                    </>
                  )}
                  {clickedTopMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTopMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTopMovie.title}</BigTitle>
                      <BigVote>
                        Average : {clickedTopMovie.vote_average} Score
                      </BigVote>
                      <BigVote>
                        Count : {clickedTopMovie.vote_count} Votes
                      </BigVote>
                    </>
                  )}
                  {clickedUpMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedUpMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedUpMovie.title}</BigTitle>
                      <BigOverview>{clickedUpMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
