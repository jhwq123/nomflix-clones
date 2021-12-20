import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import {
  IGetLatestTvResult,
  IGetOnAirTvResult,
  IGetPopRatedTvResult,
  IGetTopRatedTvResult,
  latestTvshows,
  onAirTvShows,
  popTvshows,
  topTvshows,
} from "../api";

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
  justify-content: flex-end;
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

const BigTv = styled(motion.div)`
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

function Tv() {
  const history = useHistory();
  const { scrollY } = useViewportScroll();

  // On Air Tv Shows
  const { data: onData, isLoading: onLoading } = useQuery<IGetOnAirTvResult>(
    ["tvShows", "onPlaying"],
    onAirTvShows
  );
  const [onIndex, setOnIndex] = useState(0);
  const [onLeaving, setOnLeaving] = useState(false);
  const [onBack, setOnBack] = useState(false);
  const toggleOnLeaving = () => setOnLeaving((prev) => !prev);
  const increaseOnIndex = () => {
    if (onData) {
      if (onLeaving) return;
      toggleOnLeaving();
      const totalTvs = onData.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setOnIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setOnBack(false);
    }
  };
  const decreaseOnIndex = () => {
    if (onData) {
      if (onLeaving) return;
      toggleOnLeaving();
      const totalTvs = onData.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setOnIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setOnBack(true);
    }
  };

  // Top Rate Tv Shows
  const { data: topData, isLoading: topLoading } =
    useQuery<IGetTopRatedTvResult>(["tvShows", "topPlaying"], topTvshows);
  const [topIndex, setTopIndex] = useState(0);
  const [topLeaving, setTopLeaving] = useState(false);
  const [topBack, setTopBack] = useState(false);
  const toggleTopLeaving = () => setTopLeaving((prev) => !prev);
  const increaseTopIndex = () => {
    if (topData) {
      if (topLeaving) return;
      toggleTopLeaving();
      const totalTvs = topData.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setTopBack(false);
    }
  };
  const decreaseTopIndex = () => {
    if (topData) {
      if (topLeaving) return;
      toggleTopLeaving();
      const totalTvs = topData.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setTopIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setTopBack(true);
    }
  };

  // Popular Tv Shows
  const { data: popData, isLoading: popLoading } =
    useQuery<IGetPopRatedTvResult>(["tvShows", "PopPlaying"], popTvshows);
  const [popIndex, setPopIndex] = useState(0);
  const [popLeaving, setPopLeaving] = useState(false);
  const [popBack, setPopBack] = useState(false);
  const togglePopLeaving = () => setPopLeaving((prev) => !prev);
  const increasePopIndex = () => {
    if (popData) {
      if (popLeaving) return;
      togglePopLeaving();
      const totalTvs = popData.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setPopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setPopBack(false);
    }
  };
  const decreasePopIndex = () => {
    if (popData) {
      if (popLeaving) return;
      togglePopLeaving();
      const totalTvs = popData.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setPopIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setPopBack(true);
    }
  };

  // Latest Tv shows
  const { data: latestData, isLoading: latestLoading } =
    useQuery<IGetLatestTvResult>(["tvShows", "LatestPlaying"], latestTvshows);

  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };
  const onOverlayClick = () => history.push("/tv");
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const clickedOnTv =
    bigTvMatch?.params.tvId &&
    onData?.results.find((tv) => tv.id + "" === bigTvMatch?.params.tvId);
  const clickedTopTv =
    bigTvMatch?.params.tvId &&
    topData?.results.find((tv) => tv.id + "" === bigTvMatch?.params.tvId);
  const clickedPopTv =
    bigTvMatch?.params.tvId &&
    popData?.results.find((tv) => tv.id + "" === bigTvMatch?.params.tvId);

  return (
    <Wrapper>
      {onLoading && topLoading && popLoading && latestLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(latestData?.poster_path || "")}>
            <Title>{latestData?.name}</Title>
            <Overview>{latestData?.overview}</Overview>
            <BigVote>Current Air : {latestData?.last_air_date}</BigVote>
          </Banner>
          <SlideTitle>On Air Tv Shows</SlideTitle>
          <Slider>
            <BtnPrev onClick={decreaseOnIndex} whileHover={{ scale: 1.1 }}>
              PREV
            </BtnPrev>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleOnLeaving}
              custom={onBack}
            >
              <Row
                custom={onBack}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={onIndex}
              >
                {onData?.results
                  .slice(1)
                  .slice(offset * onIndex, offset * onIndex + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id)}
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
            <BtnNext onClick={increaseOnIndex} whileHover={{ scale: 1.1 }}>
              NEXT
            </BtnNext>
          </Slider>
          <SlideTitle>Top Rated Tv Shows</SlideTitle>
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
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id)}
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
            <BtnNext onClick={increaseTopIndex} whileHover={{ scale: 1.1 }}>
              NEXT
            </BtnNext>
          </Slider>
          <SlideTitle>Popular Tv Shows</SlideTitle>
          <Slider>
            <BtnPrev onClick={decreasePopIndex} whileHover={{ scale: 1.1 }}>
              PREV
            </BtnPrev>
            <AnimatePresence
              initial={false}
              onExitComplete={togglePopLeaving}
              custom={popBack}
            >
              <Row
                custom={popBack}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={popIndex}
              >
                {popData?.results
                  .slice(1)
                  .slice(offset * popIndex, offset * popIndex + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id)}
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
            <BtnNext onClick={increasePopIndex} whileHover={{ scale: 1.1 }}>
              NEXT
            </BtnNext>
          </Slider>
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigTv
                  style={{
                    top: scrollY.get() + 100,
                  }}
                  layoutId={bigTvMatch.params.tvId}
                >
                  {clickedOnTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedOnTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedOnTv.name}</BigTitle>
                      <BigOverview>{clickedOnTv.overview}</BigOverview>
                    </>
                  )}
                  {clickedTopTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTopTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTopTv.name}</BigTitle>
                      <BigOverview>{clickedTopTv.overview}</BigOverview>
                      <BigVote>
                        Average : {clickedTopTv.vote_average} Score
                      </BigVote>
                      <BigVote>Count : {clickedTopTv.vote_count} Votes</BigVote>
                    </>
                  )}
                  {clickedPopTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedPopTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedPopTv.name}</BigTitle>
                      <BigOverview>{clickedPopTv.overview}</BigOverview>
                      <BigVote>
                        Average : {clickedPopTv.vote_average} Score
                      </BigVote>
                      <BigVote>Count : {clickedPopTv.vote_count} Votes</BigVote>
                    </>
                  )}
                </BigTv>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
