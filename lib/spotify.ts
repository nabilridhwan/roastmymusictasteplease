import {Song} from "@/lib/roast";
import Constant from "@/constants";
import {generateRandomString} from "@/lib/url";


/**
 * Handles login by redirecting to Spotify's authorization page
 * @param type
 */
export const handleLoginWithSpotify = (type: 'recent' | 'top') => {
    const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
    const redirect_uri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL!;

    const state = generateRandomString(16);

    localStorage.setItem(Constant.STATE_KEY, state);
    const scope = 'user-read-private user-read-email user-top-read user-read-recently-played';

    let url = new URL('https://accounts.spotify.com/authorize');
    url.searchParams.set('response_type', 'token');
    url.searchParams.set('client_id', encodeURIComponent(client_id));
    url.searchParams.set('scope', encodeURIComponent(scope));
    url.searchParams.set('redirect_uri', redirect_uri + `?type=${type}`);
    url.searchParams.set('state', encodeURIComponent(state));

    console.log(client_id)
    console.log(url.toString())

    //     Push the URL
    window.location.replace(url)
}

/**
 * Fetch the top songs from Spotify by user's token
 * @param accessToken
 */
export async function fetchSpotifyTopSongs(accessToken: string): Promise<Song[]> {
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

/**
 * Fetch the recently played songs from Spotify by user's token
 * @param accessToken
 */
export async function fetchSpotifyRecentlyPlayedSongs(accessToken: string): Promise<Song[]> {
    const res = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=10', {
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
            name: item.track.name,
            artist: item.track.artists.map((artist: any) => artist.name).join(", "),
            duration_ms: item.track.duration_ms
        }
    })
}

/**
 * Fetch the Spotify profile by user's token
 * @param accessToken
 */
export async function fetchSpotifyProfile(accessToken: string) {
    const res = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    const data = await res.json()

    if (!data) {
        return null
    }

    return {
        name: data.display_name,
    }

}
