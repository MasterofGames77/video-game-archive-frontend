import React, { useEffect, useState } from 'react';
import './game_index.css';

const GameList = () => {
  const [videoGamesData, setVideoGamesData] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    title: '',
    developer: '',
    publisher: '',
    genre: '',
    platform: ''
  });
  const [selectedGameArtwork, setSelectedGameArtwork] = useState(null);
  const [noResultsMessage, setNoResultsMessage] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/videogames`)
      .then(response => response.json())
      .then(data => {
        setVideoGamesData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSearch = () => {
    if (!searchCriteria.title && !searchCriteria.developer && !searchCriteria.publisher && !searchCriteria.genre && !searchCriteria.platform) {
      setFilteredGames([]);
      setNoResultsMessage('Please enter search criteria');
      return;
    }

    const filtered = videoGamesData.filter(game => {
      return (
        (!searchCriteria.title || game.title.toLowerCase().includes(searchCriteria.title.toLowerCase())) &&
        (!searchCriteria.developer || game.developer.toLowerCase().includes(searchCriteria.developer.toLowerCase())) &&
        (!searchCriteria.publisher || game.publisher.toLowerCase().includes(searchCriteria.publisher.toLowerCase())) &&
        (!searchCriteria.genre || game.genre.toLowerCase().includes(searchCriteria.genre.toLowerCase())) &&
        (!searchCriteria.platform || game.platform.toLowerCase().includes(searchCriteria.platform.toLowerCase()))
      );
    });

    setFilteredGames(filtered);
    setNoResultsMessage(filtered.length === 0 ? 'No results found that met search criteria' : '');
  };

  const handleSortByTitle = () => {
    const sorted = [...filteredGames].sort((a, b) => a.title.localeCompare(b.title));
    setFilteredGames(sorted);
  };

  const handleSortByReleaseDate = () => {
    const sorted = [...filteredGames].sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
    setFilteredGames(sorted);
  };

  const handleTitleClick = artwork_url => {
    setSelectedGameArtwork(`${process.env.REACT_APP_API_URL}/${artwork_url}`);
  };

  const handleCloseArtwork = () => {
    setSelectedGameArtwork(null);
  };

  const handleClear = () => {
    setSearchCriteria({
      title: '',
      developer: '',
      publisher: '',
      genre: '',
      platform: ''
    });
    setFilteredGames([]);
    setNoResultsMessage('');
  };

  return (
    <div className="container">
      <h1>Video Games Archive</h1>
      <div className="search-container">
        <input type="text" id="title" value={searchCriteria.title} placeholder="Search by title" onChange={e => setSearchCriteria({ ...searchCriteria, title: e.target.value })} />
        <input type="text" id="developer" value={searchCriteria.developer} placeholder="Search by developer" onChange={e => setSearchCriteria({ ...searchCriteria, developer: e.target.value })} />
        <input type="text" id="publisher" value={searchCriteria.publisher} placeholder="Search by publisher" onChange={e => setSearchCriteria({ ...searchCriteria, publisher: e.target.value })} />
        <input type="text" id="genre" value={searchCriteria.genre} placeholder="Search by genre" onChange={e => setSearchCriteria({ ...searchCriteria, genre: e.target.value })} />
        <input type="text" id="platform" value={searchCriteria.platform} placeholder="Search by platform" onChange={e => setSearchCriteria({ ...searchCriteria, platform: e.target.value })} />
        <div className="button-container">
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>
      <div id="sort-buttons" style={{ display: filteredGames.length ? 'block' : 'none' }}>
        <button onClick={handleSortByTitle}>Sort by Title (A-Z)</button>
        <button onClick={handleSortByReleaseDate}>Sort by Release Date</button>
      </div>
      {noResultsMessage && !filteredGames.length && (
        <div className="no-results-message">
          {noResultsMessage}
        </div>
      )}
      {filteredGames.length > 0 && (
        <table id="videogames-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Developer</th>
              <th>Publisher</th>
              <th>Genre</th>
              <th>Release Date</th>
              <th>Platform</th>
            </tr>
          </thead>
          <tbody>
            {filteredGames.map(game => (
              <tr key={game.id}>
                <td onClick={() => handleTitleClick(game.artwork_url)} className="clickable-title">{game.title}</td>
                <td>{game.developer}</td>
                <td>{game.publisher}</td>
                <td>{game.genre}</td>
                <td>{new Date(game.release_date).toISOString().split('T')[0]}</td>
                <td>{game.platform}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedGameArtwork && (
        <div className="artwork-modal" onClick={handleCloseArtwork}>
          <span className="close-button" onClick={handleCloseArtwork}>&times;</span>
          <img src={selectedGameArtwork} alt="Game Artwork" className="artwork-image" />
        </div>
      )}
    </div>
  );
};

export default GameList;