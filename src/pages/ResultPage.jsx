import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import Header from "../components/Header";
import UpBtn from "../components/UpBtn";
import { useState, useEffect } from "react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery().get("q") || "";
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState(query);

  useEffect(() => {
    setSearchText(query);
  }, [query]);

  return (
    <>
      <Header setSearchText={() => {}} setUser={setUser} />
      <div className="section">
        <h1 className="section__title">Result for {query}</h1>
      </div>
      <div className="card-bar">
        <Card searchText={searchText} user={user} />
      </div>
      <UpBtn />
    </>
  );
}
