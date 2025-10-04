import React, { useContext, useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import DisplayHome from './DisplayHome'
import DisplayAlbum from './DisplayAlbum'
import { albumsData } from '../assets/assets'
import { PlayerContext } from '../context/PlayerContext'

const Display = () => {

    const { albumData } = useContext(PlayerContext)

    const displayRef = useRef();
    const location = useLocation();
    const isAlbum = location.pathname.includes('album');
    const albumId = isAlbum ? location.pathname.split('/').pop() : '';
    const bgColor = isAlbum ? albumsData.find((x) => (x.id == albumId))?.bgColor : '#121212';

    useEffect(() => {
        if (isAlbum) {
            displayRef.current.style.background = `linear-gradient(to bottom, ${bgColor} 0%, ${bgColor} 70%, #000000 100%)`;
        } else {
            displayRef.current.style.background = '#121212';
        }
    });

    return (
        <div ref={displayRef} className={isAlbum ? 'w-full h-screen text-white overflow-hidden lg:w-[75%]' : 'w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-hidden lg:w-[75%] lg:m-0'}>
            <Routes>
                <Route path='/' element={<DisplayHome />} />
                <Route path='/album/:id' element={<DisplayAlbum album={albumData.find((x) => (x._id == albumId))} />} />
            </Routes>
        </div>
    )
}

export default Display