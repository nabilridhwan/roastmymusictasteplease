import {RingLoader} from "react-spinners";

export default function CustomLoader({text}: { text: string }) {
    return (
        <div className={'container my-8 mx-auto'}>
            <div className={'text-white flex flex-col items-center text-center my-40 gap-8'}>
                <RingLoader size={80} color={'white'}/>
                <p className={'text-white'}>
                    {text}
                </p>
            </div>
        </div>
    )
}
