'use server';
import {generateRoast, type Song} from "@/lib/roast";

export default async function Roast({songs}: { songs: Song[] }) {
    const roast = await generateRoast(songs)

    if (!songs) {
        return <p>
            We really can&apos;t roast you if you don&apos;t have any songs... Are you stupid?
        </p>
    }

    return <p>
        {roast}
    </p>
}
