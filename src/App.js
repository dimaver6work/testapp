import "./App.scss";
import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = useState([]);
  const [selectedCountryHolidays, setselectedCountryHolidays] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [toggle, setToggle] = useState(true);

  const ListItems = ({ items }) => {
    let list = items
      .filter((obj) =>
        obj.name.toLowerCase().includes(searchValue.toLowerCase())
      )
      .sort((a, b) => a.name - b.name)
      .map((i, index) => (
        <li key={index} onClick={() => onCountyClick(i.countryCode)}>
          {i.name}
        </li>
      ));
    return <ul>{toggle ? list : list.reverse()}</ul>;
  };

  const ListHolidays = ({ items }) => {
    return (
      <ul>
        {items.map((i) => (
          <li>
            {i.date}- {i.name}
          </li>
        ))}
      </ul>
    );
  };

  const onReset = () => {
    setselectedCountryHolidays([]);
    setSearchValue("");
    setToggle(true);
  };

  useEffect(() => {
    axios
      .get("https://date.nager.at/api/v3/AvailableCountries")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.log("Axios error: ", error));
  }, []);

  const onCountyClick = (countryCode) => {
    setselectedCountryHolidays([]);
    axios
      .get(`https://date.nager.at/api/v3/NextPublicHolidays/${countryCode}`)
      .then((response) => {
        setselectedCountryHolidays(response.data);
        console.log("Data Items: ", response.data);
      })
      .catch((error) => console.log("Axios error: ", error));
  };
  return (
    <div className="container">
      <h1>React Test</h1>
      <div className="body">
        <div className="search-area">
          <section className="search-field">
            <label htmlFor="search">Search text</label>
            <input
              id="search"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            <button onClick={() => setToggle(!toggle)}>
              {toggle ? "Coртировать Z-A" : "Coртировать A-Z"}
            </button>
            <button onClick={() => onReset()}>Reset</button>
          </section>
          <ListItems items={data}></ListItems>
        </div>
        <div className="info-area">
          <ListHolidays items={selectedCountryHolidays}></ListHolidays>
        </div>
      </div>
    </div>
  );
};

export default App;
