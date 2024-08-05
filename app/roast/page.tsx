'use client';
import {Suspense, useEffect, useState} from "react";
import {Receipt} from "@/components/Receipt";
import CustomLoader from "@/components/CustomLoader";
import {SAMPLE_DATA} from "@/sample-data";
import html2canvas from "html2canvas";
import Roast from "@/components/Roast";
import {format} from "date-fns";
import {saveAs} from 'file-saver'
import {useSearchParams} from "next/navigation";
import {fetchSpotifyProfile, fetchSpotifyRecentlyPlayedSongs, fetchSpotifyTopSongs} from "@/lib/spotify";
import {getGreeting, millisToMinutesAndSeconds} from "@/lib/datetime";
import {parseHash} from "@/lib/url";
import Constant from "@/constants";
import {Song} from "@/lib/roast";

export default function RoastPage() {

    const searchParams = useSearchParams()

    const [accessToken, setAccessToken] = useState("")
    const [hasSpotifyError, setHasSpotifyError] = useState(false)
    const [songs, setSongs] = useState<Song[]>([])
    const [isLoadingSongs, setIsLoadingSongs] = useState(true)
    const [displayName, setDisplayName] = useState("")
    const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(true)


    const type = searchParams.get('type') || 'top'
    const orderType = type === 'top' ? '0001' : '0002'
    const isLoading = isLoadingSongs || isLoadingUserProfile


    const handleFetchSpotifySongs = async (accessToken: string) => {

        if (type === 'recent') {
            fetchSpotifyRecentlyPlayedSongs(accessToken).then((songs) => {
                setSongs(songs);
            })
                .catch(() => {
                    setHasSpotifyError(true)
                })
                .finally(() => {
                    setIsLoadingSongs(false)
                })
            return;
        }

        fetchSpotifyTopSongs(accessToken).then((songs) => {
            setSongs(songs);
        })
            .catch(() => {
                setHasSpotifyError(true)
            })
            .finally(() => {
                setIsLoadingSongs(false)
            })
    }

    const handleFetchSpotifyProfile = async (accessToken: string) => {
        fetchSpotifyProfile(accessToken)
            .then((user) => {
                if (!user) return;
                setDisplayName(user.name)
            })
            .catch(() => {
                setHasSpotifyError(true)
            })
            .finally(() => {
                setIsLoadingUserProfile(false)
            })
    }

    /**
     * Bind hash from URL into state
     */
    useEffect(() => {
        // Get the access token hash and state from the URL
        const hash = window.location.hash
        const hashObject = parseHash(hash)

        // Get the state from the local storage
        const state = localStorage.getItem(Constant.STATE_KEY)

        // Check if the state matches

        if (hashObject['state'] !== state) {
            setHasSpotifyError(true)
            return
        }

        if (hashObject['error'] !== undefined) {
            setHasSpotifyError(true)
            return
        }

        // Set the access token
        setAccessToken(hashObject['access_token'])
    }, []);


    /**
     * Handle fetching songs and profile when access token is set
     */
    useEffect(() => {

        if (!accessToken) return;

        void handleFetchSpotifySongs(accessToken)
        void handleFetchSpotifyProfile(accessToken)
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
    };

    if (hasSpotifyError) {
        return (
            <div className={'container my-8 mx-auto'}>
                <div className={'px-8 text-white flex flex-col items-center text-center my-40 gap-8'}>
                    <p className={'text-white'}>
                        The gods of music have rejected your offering. <a
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

    if (isLoading) {
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

                    <h1 className={'text-white text-2xl leading-none text-center uppercase'}>
                        {displayName},
                        <br/>
                        YOU HAVE BEEN SERVED BY
                        <br/>
                        THE GODS OF MUSIC
                    </h1>

                    <div className={'text-white flex-col flex items-center gap-4'}>
                        <button
                            onClick={handleDownloadImage}
                            className={'bg-white px-3 py-2 text-black rounded-xl'}
                        >
                            SAVE IMAGE
                        </button>
                        <p className={'text-white text-xs text-center'}>
                            (BECAUSE YOU GOTTA SOMEHOW GET VALIDATION FOR YOUR MUSIC, RIGHT?)
                        </p>
                    </div>

                    <p className={'text-white text-center text-sm text-opacity-60'}>
                        IF YOU LIKE THIS STUPID APP (OR MY AWESOME HUMOR),<br/> CONSIDER <a
                        href={'https://ko-fi.com/nabilridhwan'}
                        className={'underline'}>SUPPORTING ME!</a>
                    </p>
                </div>

                <div className={'mx-3'}>
                    <Receipt.Scaffold>
                        <p className={'my-3 mb-8'}>ROASTMYMUSICTASTEPLEASE.VERCEL.APP</p>

                        <Receipt.Spacer/>

                        <Receipt.LeftItems items={
                            [
                                {label: 'ORDER', value: `#${new Date().getTime()}-${orderType}`},
                                {label: 'CUSTOMER', value: displayName || 'PATHETIC HUMAN'},
                                {label: 'DATE', value: format(new Date(), 'yyyy-MM-dd')},
                                {label: 'SERVED BY', value: 'THE GODS OF MUSIC'},
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
                        <p className={'uppercase'}>
                            HAVE A TERRIBLE {getGreeting()}!
                            – {Constant.PLAYFUL_LINES[Math.floor(Math.random() * Constant.PLAYFUL_LINES.length)]}
                        </p>

                        <p className={'mt-4 text-xs leading-none'}>
                            GET YOUR OWN ROAST BY VISITING ROASTMYMUSICTASTEPLEASE.VERCEL.APP
                        </p>

                    </Receipt.Scaffold>

                    <div className={'mt-8 text-white flex-col flex items-center gap-4'}>
                        <button
                            onClick={handleDownloadImage}
                            className={'bg-white px-3 py-2 text-black rounded-xl'}
                        >
                            SAVE IMAGE
                        </button>
                        <p className={'text-white text-xs text-center'}>
                            (BECAUSE YOU GOTTA SOMEHOW GET VALIDATION FOR YOUR MUSIC, RIGHT?)
                        </p>
                    </div>

                    <p className={'text-white text-center text-sm text-opacity-50 my-8'}>
                        IF YOU LIKE THIS STUPID APP (OR MY AWESOME HUMOR), CONSIDER <a
                        href={'https://ko-fi.com/nabilridhwan'}
                        className={'underline'}>SUPPORTING ME!</a>
                    </p>


                </div>


            </Suspense>
        </div>

    );
}
