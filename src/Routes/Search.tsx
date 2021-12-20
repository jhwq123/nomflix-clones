import styled from "styled-components";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useQuery } from "react-query";
import {
  nowMovies,
  IGetNowMoviesResult,
  IGetOnAirTvResult,
  onAirTvShows,
} from "../api";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";

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

function Search() {
  const { data: nowData, isLoading: nowLoading } =
    useQuery<IGetNowMoviesResult>(["movies", "nowPlaying"], nowMovies);
  const history = useHistory();
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

  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  searchMovieTv({ keyword });
  console.log(keyword);
  return (
    <Wrapper>
      {false ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <div></div>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
