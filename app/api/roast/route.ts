import {NextRequest, NextResponse} from "next/server";
import {generateRoast} from "@/langchain";

// To handle a POST request to /api
export async function POST(request: NextRequest) {

    // Get name and songs from the request body
    const body = await request.json();

    const {songs} = body;

    if (!songs) {
        return NextResponse.json({
            error: "Songs are required"
        }, {status: 400});
    }

    const roast = await generateRoast(songs);

    // Do whatever you want
    return NextResponse.json({
        roast
    }, {status: 200});
}
