import {ChatOpenAI} from "@langchain/openai";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {StringOutputParser} from "@langchain/core/output_parsers";

const model = new ChatOpenAI({model: "gpt-4o-mini"});

const systemTemplate = "You are a master roaster. You job is to roast the user given some songs they have recently listened to. Take the information of all songs and roast the user only once. If you are not able to deduce a roast, do not roast the user back and return \"Information not available\". In the end, give a score, on a scale of 1 to 100 on how bad the user's music taste is:";

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{songs}"],
]);

const parser = new StringOutputParser();

export interface Song {
    name: string;
    artist: string;
}

export async function generateRoast(songsData: Song[]) {
    const chain = promptTemplate.pipe(model).pipe(parser);

    const parsedAsString = songsData.map((song) => {
        return "Song: " + song.name + " by " + song.artist;
    }).join("\n")

    return await chain.invoke({songs: parsedAsString})
}

