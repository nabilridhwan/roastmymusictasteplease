'use server';
import {ChatOpenAI} from "@langchain/openai";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {StringOutputParser} from "@langchain/core/output_parsers";

interface Song {
    name: string;
    artist: string;
    duration_ms: number;
}

const model = new ChatOpenAI({model: "gpt-4o-mini"});
const systemTemplate = "You are a master roaster. Your job is to roast the user given some songs they have recently listened to. Take the information of all songs and roast the user only once. You won’t be helpful if you can’t deduce a roast or make a roast that isn’t personal. To make the roast more personal, you must use the title of the songs and the artist to your advantage. Try to keep your roast as concise as below 150 words.";
const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{songs}"],
]);
const parser = new StringOutputParser();

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

export async function generateRoast(songsData: Song[]) {
    const chain = promptTemplate.pipe(model).pipe(parser);

    const parsedAsString = songsData.map((song) => {
        return "Song: " + song.name + " by " + song.artist;
    }).join("\n")

    return await chain.invoke({songs: parsedAsString})
}


export default async function Roast({spotifyAccessToken}: { spotifyAccessToken: string }) {
    const songs = await fetchSpotifyTopSongs(spotifyAccessToken)
    const roast = await generateRoast(songs)

    console.log(JSON.stringify(songs))
    console.log(roast)

    if (!songs) {
        return <p>
            We really can&apos;t roast you if you don&apos;t have any songs... Are you stupid?
        </p>
    }

    return <p>
        {roast}
    </p>
}
