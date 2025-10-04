import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const url = 'http://localhost:4000';

    const [songsData, setSongsData] = useState([]);
    const [albumData, setAlbumData] = useState([]);

    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime: {
            second: 0,
            minute: 0
        }
    });

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true);
    }

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    }

    const playWithId = async (id) => {
        const selectedTrack = songsData.find((item) => item._id == id || item.id == id);
        if (selectedTrack) {
            setTrack(selectedTrack);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                const onCanPlay = () => {
                    audioRef.current.play();
                    setPlayStatus(true);
                    audioRef.current.removeEventListener('canplay', onCanPlay);
                };
                audioRef.current.addEventListener('canplay', onCanPlay);
            }
        }
    }

    const previous = async () => {
    if (track.id > 0) {
        await setTrack(songsData[track.id - 1]);
        await audioRef.current.play();
        setPlayStatus(true);
    }
}

const next = async () => {
    if (track.id < songsData.length - 1) {
        await setTrack(songsData[track.id + 1]);
        await audioRef.current.play();
        setPlayStatus(true);
    }
}

const seekSong = async (e) => {
    audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration);
}

const getSongsData = async () => {
    try {
        const response = await axios.get(`${url}/api/song/list`);
        setSongsData(response.data.songs)
        setTrack(response.data.songs[0])
    } catch (error) {
        setSongsData(songsData)
        setTrack(songsData[0])
    }
}

const getAlbumsData = async () => {
    try {
        const response = await axios.get(`${url}/api/album/list`)
        setAlbumData(response.data.albums)
    } catch (error) {

    }
}

useEffect(() => {
    const updateTime = () => {
        if (audioRef.current) {
            const currentTime = audioRef.current.currentTime;
            const duration = audioRef.current.duration;
            seekBar.current.style.width = (Math.floor(currentTime / duration * 100)) + '%';
            setTime({
                currentTime: {
                    second: Math.floor(currentTime % 60),
                    minute: Math.floor(currentTime / 60)
                },
                totalTime: isNaN(duration) ? { second: 0, minute: 0 } : {
                    second: Math.floor(duration % 60),
                    minute: Math.floor(duration / 60)
                }
            });
        }
    };

    if (audioRef.current) {
        audioRef.current.ontimeupdate = updateTime;
        audioRef.current.onloadedmetadata = updateTime; // Update when metadata loads
    }
}, [audioRef, seekBar])

useEffect(() => {
    getSongsData(),
        getAlbumsData()
}, [])

useEffect(() => {
    if (audioRef.current && track) {
        audioRef.current.src = track.file;
        audioRef.current.load();
    }
}, [track])

const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
    songsData,
    albumData
}

return (
    <PlayerContext.Provider value={contextValue}>
        {props.children}
    </PlayerContext.Provider>
)
}

export default PlayerContextProvider