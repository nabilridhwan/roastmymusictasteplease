import {OpenAI} from "@langchain/openai";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {StringOutputParser} from "@langchain/core/output_parsers";

export interface Song {
    name: string;
    artist: string;
    duration_ms: number;
}

const model = new OpenAI({model: "gpt-4o-mini"});
const systemTemplate = "You are a master roaster. Your job is to roast the user given their top songs. Take the information of all songs and roast the user only once. You won’t be helpful if you can’t deduce a roast or make a roast that isn’t personal. To make the roast more personal, you can use a combination of the title of the songs and the artist to your advantage such as artist’s known history or literal meaning or wordplay of the song’s title. A personal roast consist of touching on love life, relationships, friendships, job, and personal human values. Try to keep your roast concise and below 120 words.";
const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{songs}"],
]);
const parser = new StringOutputParser();

export async function generateRoast(songsData: Song[]) {
    const chain = promptTemplate.pipe(model).pipe(parser);

    const parsedAsString = songsData.map((song) => {
        return "Song: " + song.name + " by " + song.artist;
    }).join("\n")

    return await chain.invoke({songs: parsedAsString})
}
