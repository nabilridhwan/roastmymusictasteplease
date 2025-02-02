'use client';
import {Libre_Barcode_39} from "next/font/google";
import {Receipt} from "@/components/Receipt";
import {format} from "date-fns";
import {ChangeEvent, ChangeEventHandler, FormEventHandler, useState} from "react";
import {handleLoginWithSpotify} from "@/lib/spotify";


export default function Home() {
    const [type, setType] = useState<'recent' | 'top'>('top');
    const [isEnabled, setIsEnabled] = useState(false);

    const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setType(e.target.value as 'recent' | 'top');
    }

    return (
        <div className={'my-14 mx-4'}>
            <Receipt.Scaffold>
                <p className={'mt-4'}>
                    Think you got superior musical taste? Let the gods of music be the judge of it.
                </p>

                <Receipt.Spacer/>

                <Receipt.LeftItems items={[
                    {label: 'CUSTOMER', value: 'PATHETIC HUMAN (YOU)'},
                    {label: 'DATE', value: format(new Date(), 'yyyy-MM-dd')},
                    {label: 'SERVICE', value: 'THE GODS OF MUSIC'}
                ]}/>

                <Receipt.Spacer/>

                <Receipt.Divider text={'WARNING'}/>

                <p className={'mt-3 uppercase'}>
                    The Gods of Music have no mercy for you. Your music taste is tragic, your love life a
                    cringe-worthy
                    ballad, and your personality is that one track everyone skips. When they break the 4th wall,
                    they
                    see your deepest flaws. Take this roast with full conscience—you’ll need it.
                </p>


                <Receipt.Spacer/>

                <Receipt.Divider text={'OPTIONS'}/>

                <p className={'text-sm'}>
                    DEAR GODS OF MUSIC, I WOULD LIKE TO SUBMIT MY:
                </p>

                <div className={'flex justify-center gap-2 my-2 uppercase'}>
                    <div className={'space-x-2'}>
                        <input type={'radio'} name={'type'} value={"top"} checked={type === "top"}
                               onChange={handleTypeChange}/>
                        <label>Top Songs</label>
                    </div>

                    <div className={'space-x-2'}>
                        <input type={'radio'} name={"type"} value={"recent"} checked={type === "recent"}
                               onChange={handleTypeChange}/>
                        <label>Recently Played Songs</label>
                    </div>
                </div>

                <p className={'text-sm'}>
                    FOR JUDGEMENT
                </p>


                <Receipt.Spacer/>

                <Receipt.Divider text={'PLEDGE'}/>

                <div className={'space-x-2 uppercase'}>
                    <input type={'checkbox'} onChange={(e) => {
                        setIsEnabled(e.target.checked)
                    }}/>
                    <label>I promise to fully embrace the gifts from the god of music, trusting their truth, and
                        recognizing any disagreement as my own fear of facing reality.</label>
                </div>

                <button
                    disabled={!isEnabled}
                    className={'disabled:opacity-40 my-4 font-semibold text-lg enabled:animate-pulse'}
                    onClick={() => handleLoginWithSpotify(type)}
                >
                    &gt; Continue with Spotify
                </button>


                {/*<p className={'text-xs mt-4'}>*/}
                {/*    Are you using the inferior platform, Apple Music or YouTube Music? Let me know if you want it*/}
                {/*    too!*/}
                {/*</p>*/}


                <Receipt.Divider/>

                <Receipt.Barcode text={'MADEBYNABIL'}/>

                <p className={'text-sm px-8'}>
                    Made with full hatred by <a className={'underline'}
                                                href={'https://nabilridhwan.com'}
                                                target={'_blank'}>Nabil</a>
                </p>


            </Receipt.Scaffold>

        </div>

    );
}
