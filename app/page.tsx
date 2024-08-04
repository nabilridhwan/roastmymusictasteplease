'use client';
import {Libre_Barcode_39} from "next/font/google";
import {Receipt} from "@/components/Receipt";
import {format} from "date-fns";

const STATE_KEY = 'spotify_auth_state';

const generateRandomString = (length: number) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;

}

const handleLoginWithSpotify = () => {
    const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
    const redirect_uri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL!;

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


export default function Home() {
    return (
        <div className={'my-14'}>
            <Receipt.Scaffold>
                <p className={'mt-4'}>
                    Think you got superior musical taste? Let AI be the judge of it.
                </p>

                <Receipt.Spacer/>

                <Receipt.LeftItems items={[
                    {label: 'CUSTOMER', value: 'PATHETIC HUMAN (YOU)'},
                    {label: 'DATE', value: format(new Date(), 'yyyy-MM-dd')},
                    {label: 'SERVICE', value: 'THE GODS OF MUSIC'}
                ]}/>

                <Receipt.Spacer/>

                <Receipt.Divider text={'WARNING'}/>

                <p className={'mt-3'}>
                    The Gods of Music have no mercy for you. Your music taste is tragic, your love life a
                    cringe-worthy
                    ballad, and your personality is that one track everyone skips. When they break the 4th wall,
                    they
                    see your deepest flaws. Take this roast with full conscience—you’ll need it.
                </p>


                <Receipt.Spacer/>

                <button
                    className={'mt-1 text-lg'}
                    onClick={handleLoginWithSpotify}
                >
                    &gt; Continue with Spotify
                </button>


                <p className={'text-xs mt-4'}>
                    Are you using the inferior platform, Apple Music or YouTube Music? Let me know if you want it
                    too!
                </p>


                <Receipt.Divider/>

                <Receipt.Barcode text={'MADEBYNABIL'}/>

                <p className={'text-sm px-8'}>
                    Made with full hatred (jk, I love you guys) by <a className={'underline'}
                                                                      href={'https://nabilridhwan.com'}
                                                                      target={'_blank'}>Nabil</a>
                </p>


            </Receipt.Scaffold>

        </div>

    );
}
