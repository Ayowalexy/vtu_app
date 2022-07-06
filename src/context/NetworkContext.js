import React, { createContext, useState } from 'react'

export const NetworkContext = createContext({
    isConnected: false,
    setIsConnected: () => null,
    startFetch: false,
    setStartFetch: () => null
})

export const NetworkProvider =({ children }) => {
    const [isConnected, setIsConnected] = useState(false)
    const [startFetch, setStartFetch] = useState(false)
    const value = { isConnected, setIsConnected, startFetch, setStartFetch}

    return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
}
