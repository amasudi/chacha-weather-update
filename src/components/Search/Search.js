import { useState, useEffect } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_API_URL, geoApiOptions } from "../../api";
export const Search = ({ onSearchChange }) => {
  const [search, setSearch] = useState(null);
  useEffect(() => {
    if (search == null) {
      const fetchData = async () => {
        let response = await fetch("https://geolocation-db.com/json/");
        let data = await response.json();
        console.log(data);
        setSearch(data.city + ", " + data.country_code);
        handleOnChange({
          value: `${data.latitude} ${data.longitude}`,
          label: `${data.city}, ${data.country_code}`,
        });
      };
      fetchData();
    }
  }, [search, setSearch]);
  const handleOnChange = (searchData) => {
    setSearch(searchData);
    onSearchChange(searchData);
  };
  const loadOptions = (inputVlue) => {
    return fetch(
      `${GEO_API_URL}/cities?minPopulation=100000&namePrefix=${inputVlue}`,
      geoApiOptions
    )
      .then((response) => response.json())
      .then((response) => {
        return {
          options: response.data.map((city) => {
            return {
              value: `${city.latitude} ${city.longitude}`,
              label: `${city.name}, ${city.countryCode}`,
            };
          }),
        };
      })
      .catch((err) => console.error(err));
  };
  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600}
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
    />
  );
};
