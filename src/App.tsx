import { useState } from 'react'
import { images } from './images'
import './index.css'

function App() {
    return (
        <div className="w-full h-full text-4xl">
            <img src={images.crab} alt="" />
        </div>
    )
}

export default App
