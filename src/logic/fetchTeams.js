const fetchTeams = async settings => {
  console.log({ settings });
  const { rating } = settings || {};
  const response = await fetch("https://api.random.game/public/fifa/get-game", {
    headers: {
      "content-type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify({
      david_vs_goliath: false,
      hash: "1cc25e4efdf8aa4a5b96f757d6d329a5",
      is_champions_league: false,
      is_international: Boolean(settings.international),
      is_women: false,
      rating_lower: rating,
      rating_upper: rating,
      rivales: Boolean(settings.derby),
      same_country: false,
      same_league: false,
      version_id: 7
    }),

    method: "POST"
  });
  const data = await response.text();
  const parsed = JSON.parse(data.slice(data.indexOf("{")));

  if (!parsed.pick1 && !parsed.pick2) {
    return [null, null];
  }

  if (!parsed.pick1 || !parsed.pick2) {
    return fetchTeams(settings);
  }

  const transform = input => {
    const { data, leagues, rating } = input || {};
    // console.log({ data, leagues, rating });
    const { name, logo } = data || {};
    const { path: logoPath } = logo || {};
    const [{ name: league, country_code: countryCode } = {}] = leagues || [];
    const logoSrc = `https://api.random.game/images/logo/${logoPath}`;
    const transformed = { name, logoSrc, league, rating, countryCode };
    // console.log({ data, logoPath, logoSrc });
    return transformed;
  };

  const teams = [transform(parsed.pick1), transform(parsed.pick2)];
  return teams;
};

export default fetchTeams;
