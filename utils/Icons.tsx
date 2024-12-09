
import React from "react";
import type { PropsWithChildren } from "react";

import Icon from 'react-native-vector-icons/FontAwesome';

type IconProps = PropsWithChildren<{name : string}>


const Icons = ({name} : IconProps) => {
    // return (
    //     <Icon name="rocket" size={30} color="#900" />
    // );

    switch (name) {
        case "microphone":
            return <Icon name="microphone" size={30} color="white" />
            break;

        case "play":
            return <Icon name="play" size={30} color="white" />
            break;

        case "stop":
            return <Icon name="stop" size={30} color="white" />
            break;

        default:
            return <Icon name="pageline" size={30} color="white" />
            break;
    }
}

export default Icons;

