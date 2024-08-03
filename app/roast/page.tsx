'use client';
import {Suspense, useEffect, useState} from "react";
import {Box, Container} from "@chakra-ui/react";
import Roast from "@/components/Roast";
import CustomLoader from "@/components/CustomLoader";

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


export default function RoastPage() {

    const [accessToken, setAccessToken] = useState("")
    const [hasSpotifyAuthError, setHasSpotifyAuthError] = useState(false)

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

    return (
        <Container textAlign={'center'} my={8}>
            <Suspense fallback={<CustomLoader
                text={"Hold on, we're roasting your music taste... We're trying hard to make this one hurt."}/>}>

                <p>The gods of music have spoken:</p>

                <Box bg={'primary.500'}>
                    <Roast spotifyAccessToken={accessToken}/>
                </Box>
            </Suspense>
        </Container>

    );
}
