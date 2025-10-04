import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { url } from '../App'

const ListSong = () => {
    const [data, setData] = useState([])

    const fetchSong = async () => {
        try {
            const response = await axios.get(`${url}/api/song/list`)
            if (response.data.success) {
                setData(response.data.songs)
            }
        } catch (error) {
            toast.error('Failed to load songs', error)
        }
    }

    const removeSong = async (id) => {
        try {
            const response = await axios.post(`${url}/api/song/remove`, { id })
            if (response.data.success) {
                toast.success('Song removed successfully')
                await fetchSong()
            }
        } catch (error) {
            toast.error('Failed to remove song', error)
        }
    }

    useEffect(() => {
        fetchSong()
    }, [])

    return (
        <div>
            <p>All songs list</p>
            <br />
            <div className='overflow-x-auto'>
                <div className='grid grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mt-5 bg-gray-100'>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Album</b>
                    <b>Duration</b>
                    <b>Action</b>
                </div>
                {data.map((item, index) => {
                    return (
                        <div key={index} className='grid grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm'>
                            <img src={item.image} alt="" className='w-12' />
                            <p>{item.name}</p>
                            <p>{item.album}</p>
                            <p className='px-4'>{item.duration}</p>
                            <p onClick={() => removeSong(item._id)} className='cursor-pointer text-red-500 hover:text-red-600 px-4'>x</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ListSong