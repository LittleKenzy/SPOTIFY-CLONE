import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { url } from '../App'
import { toast } from 'react-toastify'

const AddSong = () => {
    const [image, setImage] = useState(false)
    const [song, setSong] = useState(false)
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [album, setAlbum] = useState('none')
    const [loading, setLoading] = useState(false)
    const [albumData, setAlbumData] = useState([])

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await axios.get(`${url}/api/album/list`)
                setAlbumData(response.data.albums || [])
            } catch (error) {
                console.error('Failed to fetch albums:', error)
                toast.error('Failed to load albums')
            }
        }
        fetchAlbums()
    }, [])

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('desc', desc)
            formData.append('image', image)
            formData.append('audio', song)
            formData.append('album', album)

            const response = await axios.post(`${url}/api/song/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.data.success) {
                toast.success('Song added successfully')
                setName('')
                setDesc('')
                setAlbum('none')
                setImage(false)
                setSong(false)
            } else {
                toast.error(response.data.message || 'Something went wrong')
            }

        } catch (error) {
            console.error('Error adding song:', error)
            toast.error(error.response?.data?.message || 'Failed to add song')
        }
        setLoading(false)
    }

    const loadAlbumData = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`)

            if (response.data.success) {
                setAlbumData(response.data.albums)
            } else {
                toast.error('Failed to load albums')
            }
        } catch (error) {
            console.error('Failed to fetch albums:', error)
            toast.error('Failed to load albums')
        }
    }

    useEffect(() => {
        loadAlbumData()
    }, [])

    return loading ? (
        <div className='grid place-items-center min-h-[80vh]'>
            <div className='w-16 h-16 place-self-center animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'></div>
        </div>
    ) : (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-8 text-gray-600'>
            <div className='flex gap-8'>
                <div className='flex flex-col gap-4'>
                    <p>Upload Song</p>
                    <input onChange={(e) => setSong(e.target.files[0])} type="file" id='song' accept='audio/*' hidden />
                    <label htmlFor="song">
                        <img src={song ? assets.upload_added : assets.upload_song} alt="" className='w-24 cursor-pointer' />
                    </label>
                </div>
                <div className='flex flex-col gap-4'>
                    <p>Upload Image</p>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' accept='image/*' hidden />
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" className='w-24 cursor-pointer' />
                    </label>
                </div>
            </div>

            <div className='flex flex-col gap-2.5'>
                <p>Song Name</p>
                <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[50vw]' placeholder='Type Here' required />
            </div>

            <div className='flex flex-col gap-2.5'>
                <p>Song Description</p>
                <input onChange={(e) => setDesc(e.target.value)} value={desc} type="text" className='bg-transparent outline-green-600 border-2 border-gray-400 w-100 p-2.5 w-[50vw]' placeholder='Type Here' required />
            </div>

            <div className='flex flex-col gap-2.5'>
                <p>Album</p>
                <select onChange={(e) => setAlbum(e.target.value)} value={album} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[150px] cursor-pointer'>
                    <option value="none">None</option>
                    {albumData.map((item, index) => (
                        <option key={index} value={item.name}>{item.name}</option>
                    ))}
                </select>
            </div>
            <button type='submit' disabled={loading} className='text-base bg-black text-white py-2.5 px-14 cursor-pointer disabled:opacity-50'>ADD</button>
        </form>
    )
}

export default AddSong