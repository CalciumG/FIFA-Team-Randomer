import React from "react";
import styled from "styled-components";
import fetchTeams from "./logic/fetchTeams";
import getCountry from "./logic/getCountry";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

const TeamsContainer = styled.main`
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #f9f9f9;
  color: ${props => props.color};
`;

const Team = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 10px;
  background-color: #eee;
  border-radius: 5%
  margin: 20px;
  text-align: center;
  color: black;

  > div:first-child {
    padding-top: 100%;
    background-image: url(${props => props.logoSrc});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }

  > div:not(:first-child) {
    height: 2em;
    line-height: 2em;
  }
`;

const ButtonContainer = styled.div`
  text-align: center;
  position: relative;
  margin: 10px;
`;

function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [teams, setTeams] = React.useState();
  const [rating, setRating] = React.useState(5);

  const getNewTeams = async () => {
    setIsLoading(true);
    const teams = await fetchTeams({ rating });
    setIsLoading(false);
    setTeams(teams);
  };

  const handleRating = event => {
    setRating(event.target.value);
  };

  React.useEffect(() => {
    getNewTeams();
  }, []);

  return (
    <>
      {teams && !isLoading ? (
        <TeamsContainer color="blue">
          {teams.map(team => {
            const { name, league, countryCode, rating, logoSrc } = team;
            return (
              <Team logoSrc={logoSrc}>
                <div></div>
                <div>{name}</div>
                <div>{getCountry(countryCode)}</div>
                <div>{league}</div>
                <div style={{ color: "orange" }}>{rating}*</div>
              </Team>
            );
          })}
        </TeamsContainer>
      ) : null}
      <ButtonContainer>
        <input
          type="number"
          id="userInput"
          min={0}
          max={5}
          onChange={handleRating}
          value={rating}
        ></input>
        <Button variant="danger " onClick={getNewTeams}>
          Generate
        </Button>
      </ButtonContainer>
    </>
  );
}

export default App;
