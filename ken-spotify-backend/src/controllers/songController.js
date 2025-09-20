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
        console.log('=== REMOVE SONG DEBUG ===')
        console.log('Request method:', req.method)
        console.log('Request headers:', req.headers)
        console.log('Request body:', req.body)
        console.log('Raw body:', req.rawBody)

        // Handle case where req.body is undefined
        let id;
        if (req.body && typeof req.body === 'object') {
            id = req.body.id || req.body._id;
        }

        // Try to extract from raw body if JSON parsing failed
        if (!id && req.rawBody) {
            try {
                // Try JSON first
                const rawData = JSON.parse(req.rawBody);
                id = rawData.id || rawData._id;
            } catch (e) {
                // If JSON parsing fails, try to extract from form-data
                console.log('JSON parsing failed, trying form-data extraction');
                const formDataMatch = req.rawBody.match(/name="id"\r\n\r\n([^]+?)\r\n/);
                if (formDataMatch) {
                    id = formDataMatch[1].replace(/\r\n.*$/, ''); // Remove trailing boundary
                }
            }
        }

        // Fallback to params or query
        if (!id) {
            id = req.params.id || req.query.id;
        }

        console.log('Extracted ID:', id)

        if (!id) {
            console.log('No ID found in request')
            return res.json({
                success: false,
                message: 'Song ID is required',
                debug: {
                    body: req.body,
                    params: req.params,
                    query: req.query,
                    rawBody: req.rawBody
                }
            })
        }

        // Check if song exists first
        const existingSong = await songModel.findById(id)
        console.log('Existing song:', existingSong)

        if (!existingSong) {
            console.log('Song not found in database')
            return res.json({ success: false, message: 'Song not found' })
        }

        const deletedSong = await songModel.findByIdAndDelete(id)
        console.log('Deleted song result:', deletedSong)

        if (!deletedSong) {
            console.log('Failed to delete song')
            return res.json({ success: false, message: 'Failed to delete song' })
        }

        console.log('Song removed successfully')
        res.json({ success: true, message: 'Song removed successfully' })
    } catch (error) {
        console.log('Error in removeSong:', error)
        res.json({ success: false, message: 'Something went wrong', error: error.message })
    }
}
