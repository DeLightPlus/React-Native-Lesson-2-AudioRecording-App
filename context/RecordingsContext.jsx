import React, { createContext, useState } from "react"

export const RecordingsContext = createContext();
export default function RecordingProvider( { children })
{
    const [recordings, setRecordings] = useState([]);
    const [currentRecording, setCurrentRecording] = useState("");

    return (
        <RecordingsContext.Provider value={{ currentRecording, setCurrentRecording, recordings, setRecordings }}>
            {children}
        </RecordingsContext.Provider>
    )

}