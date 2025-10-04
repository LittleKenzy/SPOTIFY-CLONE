import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { url } from '../App'
import { toast } from 'react-toastify'

const AddAlbum = () => {
  const [image, setImage] = useState(false)
  const [colour, setColour] = useState('#121212')
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('desc', desc)
      formData.append('image', image)
      formData.append('bgColour', colour)

      const response = await axios.post(`${url}/api/album/add`, formData)

      if (response.data.success) {
        toast.success('Album added successfully')
        setDesc('')
        setName('')
        setImage(false)
        setLoading(false)
      } else {
        toast.error(response.data.message || 'Something went wrong')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error adding album:', error)
      toast.error('Failed to add album')
    }
    setLoading(false)
  }

  return loading ? (
    <div className='grid place-items-center min-h-[80vh]'>
      <div className='w-16 h-16 place-self-center animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'></div>
    </div>
  ) : (
    <form onSubmit={onSubmitHandler} action="" className='flex flex-col items-start gap-8 text-gray-600'>
      <div className='flex flex-col gap-4'>
        <p>Upload Image</p>
        <input onChange={(e) => setImage(e.target.files[0])} type="file" name="" id="image" accept='image/*' hidden />
        <label htmlFor="image">
          <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" className='w-24 cursor-pointer' />
        </label>
      </div>
      <div className='flex flex-col gap-2.5'>
        <p>Album Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} type="text" name="" id="" placeholder='Album Name' className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[50vw]' />
      </div>

      <div className='flex flex-col gap-2.5'>
        <p>Album Description</p>
        <input onChange={(e) => setDesc(e.target.value)} value={desc} type="text" name="" id="" placeholder='Album Description' className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[50vw]' />
      </div>

      <div className='flex flex-col gap-3'>
        <p>Background Color</p>
        <input onChange={(e) => setColour(e.target.value)} value={colour} type="color" name="" id="" />
      </div>

      <button className='text-base bg-black text-white py-2.5 px-14 cursor-pointer' type='submit'>ADD</button>
    </form>
  )
}

export default AddAlbum