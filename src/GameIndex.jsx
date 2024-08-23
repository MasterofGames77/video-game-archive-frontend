import React, { useState, useEffect } from 'react';
import './game_index.css';

const GameIndex = () => {
  const [games, setGames] = useState([]);
  const [searchParams, setSearchParams] = useState({
    title: '',
    developer: '',
    publisher: '',
    genre: '',
    platform: '',
  });
  const [showSortButtons, setShowSortButtons] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGameArtwork, setSelectedGameArtwork] = useState('');

  useEffect(() => {
    // Placeholder for fetching games. Normally fetch data here.
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setSearchParams({ ...searchParams, [id]: value });
  };

  const fetchVideoGames = async (query = '') => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/videogames${query}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGames(data);
        setShowSortButtons(true);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


  const handleSearch = () => {
    const { title, developer, publisher, genre, platform } = searchParams;
    let query = '?';
    if (title) query += `title=${encodeURIComponent(title)}&`;
    if (developer) query += `developer=${encodeURIComponent(developer)}&`;
    if (publisher) query += `publisher=${encodeURIComponent(publisher)}&`;
    if (genre) query += `genre=${encodeURIComponent(genre)}&`;
    if (platform) query += `platform=${encodeURIComponent(platform)}&`;
    query = query.slice(0, -1);

    if (query !== '?') {
      fetchVideoGames(query);
    } else {
      setGames([]);
      setShowSortButtons(false);
    }
  };

  const displayVideoGames = (data) => {
    if (data.length === 0) {
      return (
        <tr>
          <td colSpan="6">No games found</td>
        </tr>
      );
    }
    return data.map(game => {
      const releaseDate = new Date(game.release_date).toISOString().split('T')[0];
      return (
        <tr key={game.id} onClick={() => handleGameClick(game.artwork_url)}>
          <td>{game.title}</td>
          <td>{game.developer}</td>
          <td>{game.publisher}</td>
          <td>{game.genre}</td>
          <td>{releaseDate}</td>
          <td>{game.platform}</td>
        </tr>
      );
    });
  };

  const handleGameClick = (artworkUrl) => {
    setSelectedGameArtwork(`${process.env.REACT_APP_API_URL}/${artworkUrl}`);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedGameArtwork('');
  };

  const sortByTitle = () => {
    const sortedData = [...games].sort((a, b) => a.title.localeCompare(b.title));
    setGames(sortedData);
  };

  const sortByDate = () => {
    const sortedData = [...games].sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
    setGames(sortedData);
  };

  return (
    <div className="container">
      <h1>Video Games Archive</h1>
      <div className="search-container">
        <input type="text" id="title" placeholder="Search by title" onChange={handleInputChange} />
        <input type="text" id="developer" placeholder="Search by developer" onChange={handleInputChange} />
        <input type="text" id="publisher" placeholder="Search by publisher" onChange={handleInputChange} />
        <input type="text" id="genre" placeholder="Search by genre" onChange={handleInputChange} />
        <input type="text" id="platform" placeholder="Search by platform" onChange={handleInputChange} />
        <button onClick={handleSearch}>Search</button>
      </div>
      {showSortButtons && (
        <div id="sort-buttons">
          <button onClick={sortByTitle}>Sort by Title</button>
          <button onClick={sortByDate}>Sort by Release Date</button>
        </div>
      )}
      {games.length > 0 && (
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
            {displayVideoGames(games)}
          </tbody>
        </table>
      )}
      {modalOpen && (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <img id="game-artwork" src={selectedGameArtwork} alt="Game Artwork" style={{ width: '100%' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameIndex;