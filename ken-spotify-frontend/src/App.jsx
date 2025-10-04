import React, { useContext } from 'react'
import Sidebar from './components/Sidebar'
import Player from './components/Player'
import Display from './components/Display'
import { PlayerContext } from './context/PlayerContext'
import { songsData, albumsData } from './assets/assets'
import { useLocation } from 'react-router-dom'

const App = () => {
  const { audioRef, track } = useContext(PlayerContext);

  return (
    <div className='h-screen bg-black'>
      {
        songsData.length !== 0 ?
          <>
            <div className='h-[90%] flex'>
              <Sidebar />
              <Display />
            </div>
            <Player />
          </> : null
      }
      <audio ref={audioRef} src={track ? track.file : null} preload='auto'></audio>
    </div>
  )
}

export default App