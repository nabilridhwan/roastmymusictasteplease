'use client';
import {FaSpotify} from "react-icons/fa";
import {redirect, RedirectType} from "next/navigation";
import {Button, Container, Stack, Text} from "@chakra-ui/react";

const STATE_KEY = 'spotify_auth_state';

const generateRandomString = (length: number) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;

}

export default function Home() {

    const handleLoginWithSpotify = () => {
        const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
        const redirect_uri = `${window.location.origin}/roast`;

        const state = generateRandomString(16);

        localStorage.setItem(STATE_KEY, state);
        const scope = 'user-top-read';

        let url = new URL('https://accounts.spotify.com/authorize');
        url.searchParams.set('response_type', 'token');
        url.searchParams.set('client_id', encodeURIComponent(client_id));
        url.searchParams.set('scope', encodeURIComponent(scope));
        url.searchParams.set('redirect_uri', redirect_uri);
        url.searchParams.set('state', encodeURIComponent(state));

        console.log(client_id)
        console.log(url.toString())

        //     Push the URL
        window.location.replace(url)


    }

    return (
        <Container>
            <Stack textAlign={'center'} alignItems={'center'} my={48} spacing={4}>
                <Text fontSize={'4xl'} fontWeight={'bold'}>
                    Roast my music taste, please!
                </Text>

                <Text>
                    Think you got superior musical taste? Let AI be the judge of it.
                </Text>

                <Button
                    mt={8}
                    colorScheme={'green'}
                    onClick={handleLoginWithSpotify}
                    leftIcon={<FaSpotify/>}
                >
                    Log in with Spotify
                </Button>


                <Text fontSize={'sm'} opacity={0.7} mt={20}>
                    Made with love by <a href={'https://nabilridhwan.com'} target={'_blank'}>Nabil</a>
                </Text>

            </Stack>

        </Container>

    );
}
