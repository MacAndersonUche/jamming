
import React from 'react';
import Spotify from '../../util/Spotify';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import './App.css';

class App extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistTracks: [],
      playlistName: 'New PlayList'
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

  }

  addTrack(track) {
    let tracks = this.state.playlistTracks
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({ playlistTracks: tracks })
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      tracks.pop(track);
      this.setState({ playlistTracks: tracks })
    }
    return;
  }

  updatePlaylistName(playName) {
    this.setState({ playlistName: playName })
  }

  savePlaylist() {

    const trackUris = this.state.playlistTracks.map(track => track.uri)
    console.log(trackUris)

    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })

    document.querySelectorAll('input')[1].value = 'New Playlist';
  }

  search(term) {

    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults })
    })

  }

  render() {
    return (
      <div>
        <h1>MacAnderson's <span className="highlight">Jammming</span> Project</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />

          </div>
        </div>
      </div>
    )
  }

}

export default App;
