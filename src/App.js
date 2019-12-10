import React from "react";
import styled from "styled-components";
import fetchTeams from "./logic/fetchTeams";
import getCountry from "./logic/getCountry";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

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

  const getNewTeams = async data => {
    setIsLoading(true);
    const teams = await fetchTeams(data);
    setIsLoading(false);
    setTeams(teams);
  };

  const handleRating = event => {
    setRating(event.target.value);
  };

  React.useEffect(() => {
    getNewTeams({ rating });
  }, []);

  const handleSubmit = event => {
    event.preventDefault();

    const data = {};

    const formData = new FormData(event.target);

    for (let entry of formData.entries()) {
      const [name, value] = entry;
      data[name] = value;
    }

    console.log({ data });

    getNewTeams(data);
  };

  return (
    <>
      {teams && !isLoading ? (
        <TeamsContainer color="blue">
          {teams.map(team => {
            const { name, league, countryCode, rating, logoSrc } = team || {};
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
      <Form onSubmit={handleSubmit}>
        <ButtonContainer>
          <select
            type="number"
            onChange={handleRating}
            value={rating}
            name="rating"
          >
            <option value="0.5">0.5</option>
            <option value="1">1*</option>
            <option value="1.5">1.5*</option>
            <option value="2">2*</option>
            <option value="2.5">2.5*</option>
            <option value="3">3*</option>
            <option value="3.5">3.5*</option>
            <option value="4">4*</option>
            <option value="4.5">4.5*</option>
            <option value="5">5*</option>
          </select>
          <Form.Check name="international" label="International" />
          <Form.Check name="derby" label="Derby" />
          <Button variant="primary " type="submit">
            Generate
          </Button>
        </ButtonContainer>
      </Form>
    </>
  );
}

export default App;
