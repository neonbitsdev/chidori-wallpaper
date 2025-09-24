import { useState } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import UpBtn from '../components/UpBtn';

export default function Home() {
  const [searchText, setSearchText] = useState('');
  const [user, setUser] = useState(null);

  return (
    <>
      <Header setSearchText={setSearchText} setUser={setUser} />
      <div className="section">
        <h1 className="section__title">Wallpaper World</h1>
      </div>
      <div className="card-bar">
        <Card
          searchText={searchText}
          user={user}
          shuffle={true}      
        />
      </div>

      <UpBtn />
    </>
  );
}
