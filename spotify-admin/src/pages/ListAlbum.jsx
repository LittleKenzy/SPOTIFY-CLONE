import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { url } from '../App'
import { toast } from 'react-toastify'

const ListAlbum = () => {
    const [data, setData] = useState([])

    const fetchAlbums = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`)

            if (response.data.success) {
                setData(response.data.albums)
            }
        } catch (error) {
            toast.error('Failed to load albums', error)
        }
    }

    useEffect(() => {
        fetchAlbums()
    }, [])

    const removeAlbum = async (id) => {
        try {
            const response = await axios.post(`${url}/api/album/remove`, { id })

            if (response.data.success) {
                toast.success('Album removed successfully')
                await fetchAlbums()
            }
        } catch (error) {
            toast.error('Failed to remove album', error)
        }
    }

    return (
        <div>
            <p>All album lists</p>
            <br />
            <div>
                <div className='sm:grid hidden grid-cols-[0.5fr_1fr_1fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-300'>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Description</b>
                    <b>Album colour</b>
                    <b>Action</b>
                </div>
                {data.map((item, index) => {
                    return (
                        <div className='grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_1fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5' key={index}>
                            <img className='w-12' src={item.image} alt="" />
                            <p>{item.name}</p>
                            <p>{item.desc}</p>
                            <input type="color" name="" id="" value={item.bgColour} className='mx-5' />
                            <p className='cursor-pointer text-red-500 px-5' onClick={() => removeAlbum(item._id)}   >x</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ListAlbum