import React from 'react'
import Navbar from './Navbar'
import { albumsData } from '../assets/assets'
import AlbumItem from './AlbumItem'
import { songsData } from '../assets/assets'
import SongItem from './SongItem'

const DisplayHome = () => {
    return (
        <>
            <Navbar />
            <div className='mb-4'>
                <h1 className='my-5 font-bold text-2xl'>Featured Charts</h1>
                <div className='flex overflow-x-auto whitespace-nowrap' onWheel={(e) => { e.preventDefault(); e.currentTarget.scrollLeft += e.deltaY; }}>
                    {albumsData.map((item, index) => (
                        <div key={index} className='inline-block align-top'>
                            <AlbumItem name={item.name} desc={item.desc} id={item.id} image={item.image} />
                        </div>
                    ))}
                </div>
            </div>
            <div className='mb-4'>
                <h1 className='my-5 font-bold text-2xl'>Today's biggest hits</h1>
                <div className='flex overflow-x-auto whitespace-nowrap' onWheel={(e) => { e.preventDefault(); e.currentTarget.scrollLeft += e.deltaY; }}>
                    {songsData.map((item, index) => (
                        <div key={index} className='inline-block align-top'>
                            <SongItem name={item.name} desc={item.desc} id={item.id} image={item.image} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default DisplayHome
