import {Container, Stack} from "@chakra-ui/react";
import {RingLoader} from "react-spinners";

export default function CustomLoader({text}: { text: string }) {
    return (
        <Container>
            <Stack alignItems={'center'} textAlign={'center'} my={40} spacing={8}>
                <RingLoader size={80}/>
                <p>
                    {text}
                </p>
            </Stack>
        </Container>
    )
}
