import React, { useContext, useState, useEffect} from 'react';
import { Container } from 'react-bootstrap';
import Fade from 'react-reveal/Fade';
import axios from 'axios';
import PortfolioContext from '../../context/context';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const Header = () => {
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [locations, setLocations] = useState([]);
  const [cities, setCities] = useState([]);

  const [zoom, setZoom] = React.useState(11); // initial zoom

  const { hero } = useContext(PortfolioContext);
  const { title, name } = hero;

  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const doSomething = async (e) => {
    e.preventDefault()
    const auth = await axios.get("https://react-spotify--app.herokuapp.com/token", {
    })
    const token = auth.data.accessToken
    const data = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: searchKey,
            type: "track"
        }
    })
    const id = data.data.tracks.items[0].artists[0].id

    const artist_data = await axios.get("https://api.spotify.com/v1/artists/" + id, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
    setArtists([artist_data.data])
    const artist_location = await axios.get("https://react-spotify--app.herokuapp.com/location", {
      params: {
        artist: artist_data.data.name
    }
    }).then(artist_location =>{
      setLocations(artist_location.data.location)
      setCities(artist_location.data.city)
    })
    .catch(err => {
      setLocations({lat: 1, lng: 1})
      setCities('Unknown')
    })
  }
  
  const renderArtists = () => {
    return artists.map(artist => (
        <div key={artist.id} className='hero-row'>
            {artist.images.length ? <img width={"400px"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
        </div>
    ))
  }

  const renderArtistsName = () => {
    return artists.map(artist => (
        <div key={artist.id+'name'} className='hero-row' style={{width: '400px'}}>
            <h1 className="hero-title" style={{textAlign: "center"}}>
              <span className="text-color-main">{name || artist.name}</span>
            </h1>        
        </div>
    ))
  }

  const renderMap = () => {
    return Array(locations).map(location => (
      <div key='map' className='hero-row'>
        {location.lat ? (
        <LoadScript googleMapsApiKey='AIzaSyDG5tHtU1r_kJk-mLDO_AkPpJhfivUq2_c'>
          <GoogleMap id='map' 
            mapContainerStyle={containerStyle}
            center={{lat: location.lat, lng: location.lng}}
            zoom={zoom}
          >
            {/* Child components, such as markers, info windows, etc. */}
            <></>
          </GoogleMap>
        </LoadScript>
        ) : <div></div>}
      </div>
    ))
  }
  const renderCityName = () => {
    return Array(cities).map(city => (
        <div key={city} className='hero-row' style={{width: '400px'}}>
            <h1 className="hero-title" style={{textAlign: "center"}}>
              <span className="text-color-main">{name || city}</span>
            </h1>        
        </div>
    ))
  }

  useEffect(() => {
    if (window.innerWidth > 769) {
      setIsDesktop(true);
      setIsMobile(false);
    } else {
      setIsMobile(true);
      setIsDesktop(false);
    }
  }, []);

  return (
    <section id="hero" className="jumbotron">
      <Container>
        <Fade left={isDesktop} bottom={isMobile} duration={1000} delay={500} distance="30px">
          <h1 className="hero-title">
            {title || 'Hi, search for a'}{' '}
            <span className="text-color-main">{name || 'song'}</span>
            {title || ", and we'll show you the main artist and their birthplace"}{' '}
          </h1>
        </Fade>
        <Fade left={isDesktop} bottom={isMobile} duration={1000} delay={500} distance="30px">
          <h2 className="hero-title">
            <input type="text" onChange={e => setSearchKey(e.target.value)}/>
            <button className="cta-btn cta-btn--hero" onClick={doSomething}>
              Search
            </button>
          </h2>
        </Fade>
        <Fade left={isDesktop} bottom={isMobile} duration={1000} delay={500} distance="30px">
          <div className="hero-container" style={{width: '100%'}}>
            {renderArtists()}
            {renderMap()}
            {renderArtistsName()}
            {renderCityName()}
          </div>
        </Fade>
      </Container>
    </section>
  );
};

export default Header;