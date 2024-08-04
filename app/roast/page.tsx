'use client';
import {Suspense, useEffect, useState} from "react";
import {Receipt} from "@/components/Receipt";
import CustomLoader from "@/components/CustomLoader";
import {SAMPLE_DATA} from "@/sample-data";
import html2canvas from "html2canvas";
import Roast from "@/components/Roast";
import {format} from "date-fns";
import {RingLoader} from "react-spinners";
import domtoimage from 'dom-to-image'
import {saveAs} from 'file-saver'

const STATE_KEY = 'spotify_auth_state';

interface Song {
    name: string;
    artist: string;
    duration_ms: number;
}

/**
 * Converts the hash in the URL into an object
 * Used for decoding the Spotify access token from implicit grant flow
 * @param hash
 */
function parseHash(hash: string) {
    return hash.split("&").map((item) => {
        return {
            [item.split("=")[0].replace("#", "")]: item.split("=")[1]
        }
    }).reduce((acc, item) => {
            return {...acc, ...item}
        }
        , {})
}

/**
 * Convert milliseconds to minutes and seconds
 * https://stackoverflow.com/a/21294619
 * @param millis
 */
function millisToMinutesAndSeconds(millis: number) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseInt(seconds, 10) < 10 ? '0' : '') + seconds;
}


/**
 * Fetch the top songs from Spotify by user's token
 * @param accessToken
 */
async function fetchSpotifyTopSongs(accessToken: string): Promise<Song[]> {
    const res = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    const data = await res.json()

    if (!data.items) {
        return []
    }

    return data.items.map((item: any) => {
        return {
            name: item.name,
            artist: item.artists.map((artist: any) => artist.name).join(", "),
            duration_ms: item.duration_ms
        }
    })
}


export default function RoastPage() {

    const [accessToken, setAccessToken] = useState("")
    const [hasSpotifyAuthError, setHasSpotifyAuthError] = useState(false)
    const [songs, setSongs] = useState<Song[]>([])
    const [isLoadingSongs, setIsLoadingSongs] = useState(true)

    /**
     * Bind hash from URL into state
     */
    useEffect(() => {
        // Get the access token hash and state from the URL
        const hash = window.location.hash
        const hashObject = parseHash(hash)

        // Get the state from the local storage
        const state = localStorage.getItem(STATE_KEY)

        // Check if the state matches

        if (hashObject['state'] !== state) {
            setHasSpotifyAuthError(true)
            return
        }

        if (hashObject['error'] !== undefined) {
            setHasSpotifyAuthError(true)
            return
        }

        // Set the access token
        setAccessToken(hashObject['access_token'])
    }, []);

    useEffect(() => {

        if (!accessToken) return;

        fetchSpotifyTopSongs(accessToken).then((songs) => {
            setSongs(songs);
        }).finally(() => {
            setIsLoadingSongs(false)
        })

    }, [accessToken]);

    const handleDownloadImage = async () => {
        const element = document.getElementById('print')!,
            canvas = await html2canvas(element, {
                scale: 3
            }),
            data = canvas.toDataURL('image/jpg'),
            link = document.createElement('a');

        link.href = data;


        saveAs(data, 'roastmymusictasteplease-result.jpg');
        // link.download = 'roastmymusictasteplease-result.jpg';
        //
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);

        // domtoimage.toBlob(document.getElementById('print')!)
        //     .then(async function (blob) {
        //         saveAs(blob, 'roastmymusictasteplease-result.jpg');
        //     });
    };

    if (hasSpotifyAuthError) {
        return (
            <div className={'container my-8 mx-auto'}>
                <div className={'px-8 text-white flex flex-col items-center text-center my-40 gap-8'}>
                    <p className={'text-white'}>
                        The gods of music have rejected your offering. You have failed to authenticate with Spotify. <a
                        href={"/"} className={'underline'}>Try again</a>
                    </p>
                </div>
            </div>
        )
    }

    if (!accessToken) {
        return (
            <div className={'container my-8 mx-auto'}>
                <div className={'px-8 text-white flex flex-col items-center text-center my-40 gap-8'}>
                    <p className={'text-white'}>
                        The gods of music have rejected your offering. You have failed to authenticate with Spotify. <a
                        href={"/"} className={'underline'}>Try again</a>
                    </p>
                </div>
            </div>
        )
    }

    if (isLoadingSongs) {
        return <CustomLoader text={"Hold on! We're making this worthwhile."}/>
    }

    if (!songs) {
        return (
            <div className={'container my-8 mx-auto'}>
                <div className={'px-8 text-white flex flex-col items-center text-center my-40 gap-8'}>
                    <p className={'text-white'}>
                        The gods of music have rejected your offering. There&apos;s nothing they can roast you about
                        because you don&apos;t listen to any songs. Is your music taste that obscure? Do you hate music
                        that much? <a
                        href={"/"} className={'underline'}>Try again</a>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={'container my-8 mx-auto'}>
            <Suspense fallback={
                <CustomLoader
                    text={"Hold on, the Gods of Music are reviewing other applications by masochistic people like you! They're trying hard to make sure this one hurts."}
                />
            }>

                <div className={'flex flex-col items-center text-white my-8 gap-7 mx-2'}>

                    <h1 className={'text-white text-2xl leading-none text-center'}>
                        YOU HAVE BEEN SERVED BY
                        <br/>
                        THE GODS OF MUSIC
                    </h1>

                    <button
                        onClick={handleDownloadImage}
                        className={'underline'}
                    >
                        &gt; SAVE IMAGE (BECAUSE YOU GOTTA SOMEHOW GET VALIDATION FOR YOUR MUSIC, RIGHT?)
                    </button>

                    <p className={'text-white text-center text-sm text-opacity-80'}>
                        IF YOU LIKE THIS STUPID APP (OR MY AWESOME HUMOR), CONSIDER <a
                        href={'https://ko-fi.com/nabilridhwan'}
                        className={'underline'}>SUPPORTING ME!</a>
                    </p>
                </div>

                <Receipt.Scaffold>
                    <p className={'my-3 mb-8'}>ROASTMYMUSICTASTEPLEASE.VERCEL.APP</p>

                    <Receipt.Spacer/>

                    <Receipt.LeftItems items={
                        [
                            {label: 'CUSTOMER', value: 'PATHETIC HUMAN'},
                            {label: 'DATE', value: format(new Date(), 'yyyy-MM-dd')},
                            {label: 'SERVED BY', value: 'THE GODS OF MUSIC'}
                        ]
                    }/>

                    <Receipt.Divider/>

                    {songs.map((song, idx) => (
                        <div key={idx} className={'flex text-left justify-between my-1'}>
                            <p key={idx} className={'uppercase pr-10'}>
                                {song.name} – {song.artist}
                            </p>

                            <p>
                                {millisToMinutesAndSeconds(song.duration_ms)}
                            </p>
                        </div>
                    ))}


                    <Receipt.Divider/>

                    <p className={'uppercase'}>
                        {/*{SAMPLE_DATA.ROAST}*/}
                        <Roast songs={songs}/>
                    </p>


                    <Receipt.Divider/>

                    <Receipt.Barcode text={'MADEBYNABIL'}/>
                    <p>
                        HAVE A TERRIBLE DAY!
                    </p>

                    <p className={'mt-4 text-xs leading-none'}>
                        GET YOUR OWN ROAST BY VISITING ROASTMYMUSICTASTEPLEASE.VERCEL.APP
                    </p>

                </Receipt.Scaffold>

                <button
                    onClick={handleDownloadImage}
                    className={'underline text-white mt-[36px] my-5'}
                >
                    &gt; SAVE IMAGE (BECAUSE YOU GOTTA SOMEHOW GET VALIDATION FOR YOUR MUSIC, RIGHT?)
                </button>

                <p className={'text-white text-center text-sm text-opacity-80'}>
                    IF YOU LIKE THIS STUPID APP (OR MY AWESOME HUMOR), CONSIDER <a
                    href={'https://ko-fi.com/nabilridhwan'}
                    className={'underline'}>SUPPORTING ME!</a>
                </p>


            </Suspense>
        </div>

    );
}
