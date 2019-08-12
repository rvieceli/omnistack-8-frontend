import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import '../../services/api';

import './styles.css';

import logo from '../../assets/logo.svg';
import like from '../../assets/like.svg';
import dislike from '../../assets/dislike.svg';
import itsamatch from '../../assets/itsamatch.png';
import api from '../../services/api';

export default function Main({ match }) {
  const { id } = match.params;
  const [devs, setDevs] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadDevs() {
      const apiResponse = await api.get(`/devs/`, {
        headers: {
          user: id,
        }
      })

      setDevs(apiResponse.data);
    }
    loadDevs();
  }, [id])

  useEffect(() => {
    const socket = io('http://localhost:3333', {
      query: { dev: id }
    })

    socket.on('match', dev => {
      setMatchDev(dev);
    })
  }, [id]);

  async function handleLike(liked) {
    await api.post(`/devs/${liked}/likes`, null, {
      headers: {
        user: id,
      }
    })
    setDevs(devs.filter(user => user._id !== liked))
  }

  async function handleDislike(disliked) {
    await api.post(`/devs/${disliked}/dislikes`, null,  {
      headers: {
        user: id,
      }
    })
    setDevs(devs.filter(user => user._id !== dislike))
  }

  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Tindev"/>
      </Link>
      { devs.length > 0 ? (
        <ul>
          {devs.map(dev => (
            <li key={dev._id}>
              <img src={dev.avatar} alt={dev.name}/>
              <footer>
                <strong>{dev.name}</strong>
                <p>{dev.bio}</p>
              </footer>

              <div className="buttons">
                <button type="button" onClick={() => handleDislike(dev._id)}>
                  <img src={dislike} alt="Dislike"/>
                </button>
                <button type="button" onClick={() => handleLike(dev._id)}>
                  <img src={like} alt="Like"/>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ): (
        <div className="empty">
          Acabou :(
        </div>
      )}

      { matchDev && (
        <div className="match-container">
          <img src={itsamatch} alt="It's a match"/>
          <img
            className="avatar"
            src={matchDev.avatar}
            alt={matchDev.name}
          />
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>
          <button type="button" onClick={() => setMatchDev(null)}>FECHAR</button>
        </div>
      )}
    </div>
  );
}
