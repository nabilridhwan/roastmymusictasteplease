import {Libre_Barcode_39} from "next/font/google";


const DEFAULT_DIVIDER_LENGTH = 38;

const barcodeFont = Libre_Barcode_39({
    subsets: ['latin'],
    weight: "400"
});

const Scaffold = ({children}: { children: React.ReactNode }) => {
    return <div id={"print"}
                className={'bg-paper max-w-[400px] p-8 text-center mx-auto py-[60px] drop-shadow-2xl bg-opacity-90'}>
        <div className={'flex justify-center'}>
            <img className={'w-[220px]'} src={"/logo.png"} alt={"Roast my music taste, please! Logo"}/>
        </div>

        {children}
    </div>
}

const Spacer = () => {
    return (
        <div className={'my-5'}/>
    )
}

const Divider = ({text = ""}: { text?: string }) => {
    const NEW_LENGTH = (DEFAULT_DIVIDER_LENGTH - text.length) / 2;

    if (text) {
        return (
            <div className={'my-2'}>
                <p>
                    {"-".repeat(NEW_LENGTH)}{text}{"-".repeat(NEW_LENGTH)}
                </p>
            </div>
        )
    }

    return (
        <div className={'my-2'}>
            <p>
                {"-".repeat(DEFAULT_DIVIDER_LENGTH)}
            </p>
        </div>
    )
}

const Barcode = ({text}: { text: string }) => {
    return <p style={barcodeFont.style} className={'text-6xl'}>
        {text}
    </p>
}

const LeftItems = ({items}: { items: { label: string, value: any }[] }) => {
    return <p className={'text-left'}>
        {items.map((item, index) => {
            return <span key={index}>
                {item.label}: {item.value}
                <br/>
            </span>
        })}
    </p>

}

export const Receipt = {
    LeftItems,
    Scaffold,
    Barcode,
    Divider,
    Spacer
}
