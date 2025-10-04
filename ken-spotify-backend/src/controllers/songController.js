import { v2 as cloudinary } from 'cloudinary'
import songModel from '../models/songModel.js'

export const addSong = async (req, res) => {
    try {
        const name = req.body.name
        const desc = req.body.desc
        const album = req.body.album
        const audioFile = req.files.audio[0]
        const image = req.files.image[0]
        const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
            resource_type: 'video'
        })
        const imageUpload = await cloudinary.uploader.upload(image.path, {
            resource_type: 'image'
        })
        const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`

        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration
        }

        const song = songModel(songData)
        await song.save()

        res.json({ success: true, message: 'Song added successfully' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Something went wrong' })
    }
}

export const listSong = async (req, res) => {
    try {
        const allSongs = await songModel.find({})
        res.json({ success: true, songs: allSongs })
    } catch (error) {
        res.json({ success: false, message: 'Something went wrong' })
    }
}

export const removeSong = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.json({ success: false, message: 'Song ID is required' })
        }

        const deletedSong = await songModel.findByIdAndDelete(id)
        if (!deletedSong) {
            return res.json({ success: false, message: 'Song not found' })
        }

        res.json({ success: true, message: 'Song removed successfully' })
    } catch (error) {
        res.json({ success: false, message: 'Something went wrong' })
    }
}
