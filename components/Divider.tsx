const LENGTH = 38;

export const Divider = ({text = ""}: { text?: string }) => {

    const NEW_LENGTH = (LENGTH - text.length) / 2;

    if (text) {
        return (
            <div className={'my-5'}>
                <p>
                    {"-".repeat(NEW_LENGTH)}{text}{"-".repeat(NEW_LENGTH)}
                </p>
            </div>
        )
    }

    return (
        <div className={'my-5'}>
            <p>
                {"-".repeat(LENGTH)}
            </p>
        </div>
    )
}
