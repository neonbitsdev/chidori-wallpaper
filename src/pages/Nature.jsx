import Header from "../components/Header";
import Card from "../components/Card";
import UpBtn from "../components/UpBtn";
import { useState } from "react";

export default function Nature() {
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState(null);

  return (
    <>
      <Header setSearchText={setSearchText} setUser={setUser} />
      <div className="section">
        <h1 className="section__title">Nature Wallpaper</h1>
      </div>
      <div className="card-bar">
        <Card tag="nature" searchText={searchText} user={user} />
      </div>
      <UpBtn />
    </>
  );
}
