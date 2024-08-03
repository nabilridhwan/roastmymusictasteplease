'use client';


import {useEffect, useState} from "react";
import axios from "axios";
import {generateRoast, Song} from "@/langchain";
import {RingLoader} from "react-spinners";
import {Text, Box, Card, Container, Stack} from "@chakra-ui/react";

const STATE_KEY = 'spotify_auth_state';

/**
 * Converts the hash into an object
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

async function fetchSpotifyTopSongs(accessToken: string): Promise<Song[]> {
    const res = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
        params: {
            limit: 10,
            time_range: 'short_term'
        },
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    console.log()

    if (!res.data.items) {
        return []
    }

    return res.data.items.map((item: any) => {
        return {
            name: item.name,
            artist: item.artists.map((artist: any) => artist.name).join(", ")
        }
    })
}

export default function Roast() {

    const [roast, setRoast] = useState("")
    const [isRoasting, setIsRoasting] = useState(true)
    const [hash, setHash] = useState("")
    const [hashObject, setHashObject] = useState({})
    const [accessToken, setAccessToken] = useState("")
    const [state, setState] = useState("")
    const [hasSpotifyAuthError, setHasSpotifyAuthError] = useState(false)
    const [songs, setSongs] = useState<Song[]>([])

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
        setHash(hash)
        setHashObject(hashObject)
        setState(state)
    }, []);

    // Fetch songs
    useEffect(() => {

        if (!accessToken) return

        fetchSpotifyTopSongs(accessToken)
            .then((songs) => {
                setSongs(songs)
            }).catch((err) => {
            console.error(err)
            setHasSpotifyAuthError(true)
        })

    }, [accessToken]);

    useEffect(() => {
        if (songs.length === 0) return
        setIsRoasting(true)

        // Call the API
        axios.post('/api/roast', {
            songs
        })
            .then(res => {
                const {roast} = res.data

                if (!roast) {
                    setRoast("Information not available")
                    return
                }

                setRoast(roast)
            })
            .finally(() => {
                setIsRoasting(false)
            })
    }, [songs])

    const result = "Oh Nabil, you're like a human mood swing - one minute you're bopping to Coldplay's mainstream pop, next thing you're sulking in the corner with \"The Interlude\" by Tanhai Collective. Your playlist is more indecisive than a squirrel crossing the street. With songs ranging from the sappy \"true love will find you in the end - Adam's Version\" to the obscure \"The Champion Spy's Happy Ransom Day\" by Stuart Newman, it's clear that your musical taste has the consistency of a broken blender. By the way, \"Do You Wanna Do Nothing with Me? by Lawrence\" - is that a personal anthem or just a sad reflection of your Saturday nights? Also, who hurt you enough to listen to \"Extinction\" by Thomas Barrandon? I hope you're not planning a world takeover anytime soon. Your musical taste score is a solid 90 out of 100. Because the higher the score, the worse the taste, right?"

    if (hasSpotifyAuthError) {
        return (
            <Container>
                <div>
                    <p>
                        There was an error with the Spotify authentication. Please try again.
                    </p>
                </div>
            </Container>
        )
    }

    if (isRoasting) {
        return (
            <Container>
                <Stack alignItems={'center'} textAlign={'center'} my={40} spacing={8}>
                    <RingLoader color={'white'} size={80}/>
                    <p>
                        Hold on, we&apos;re roasting your music taste... We&apos;re trying hard to make this one hurt.
                    </p>
                </Stack>
            </Container>
        )
    }

    return (
        <Container textAlign={'center'} my={8}>

            {/*Debug Window*/}
            {/*<div>*/}
            {/*    <p>Hash: {JSON.stringify(hash)}</p>*/}
            {/*    <p>Hash Object: {JSON.stringify(hashObject)}</p>*/}
            {/*    <p>Access Token: {accessToken}</p>*/}
            {/*    <p>State: {state}</p>*/}
            {/*    <p>Is Error: {hasSpotifyAuthError ? "true" : "false"}</p>*/}
            {/*</div>*/}

            <Stack spacing={4}>


                <Text>
                    The gods of music have spoken. Here&apos;s what they have to say about your taste:
                </Text>


                <Box
                    bg={'whiteAlpha.100'}
                    lineHeight={1.6}
                    p={4} rounded={'xl'}>
                    {roast}
                </Box>
            </Stack>
        </Container>

    );
}
