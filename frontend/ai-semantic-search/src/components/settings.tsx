import { FC,useState } from 'react'
import { createPortal } from 'react-dom' 
import {motion,AnimatePresence} from 'framer-motion'

import useStore from '../store'


const Settings : FC = () => {

    const [showModal, setShowModal] = useState<boolean>(false)

    
    const mode = useStore(state => state.mode) as 'retriever_only' | 'retriever+reader'
    const setMode = useStore(state => state.setMode)
    const top_k = useStore(state => state.top_k) as number
    const setTop_k = useStore(state => state.setTopK)
    
    const toggleSwitch = () => setMode(mode === 'retriever_only' ? 'retriever+reader' : 'retriever_only')
    return (
        <>
            <motion.button className='border-2 px-2 py-1 rounded-lg bg-gray-50'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setShowModal((curr) => !curr)
                }}
                >
                Settings
            </motion.button>
            {/* // Transport to #root div */}
            {showModal && createPortal(
            <div className='fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center'>
                <AnimatePresence>
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    // Exit animation
                    exit={{opacity: 0, y: 100}}
                    className='bg-white rounded-xl shadow-lg p-10 flex flex-col gap-5'>
                    <div className='flex justify-between gap-5'>
                        <h1 className='text-2xl font-bold'>Settings</h1>
                        <button className='text-2xl font-bold' onClick={() => setShowModal((curr) => !curr)}>X</button>
                    </div>
                    <div className='py-5 flex flex-col gap-5'>
                        {/* Mode */}
                        <div className='flex gap-3 justify-center items-center'>
                            <span>Retriever + Reader</span>
                            <div className="bg-gray-300 rounded-3xl w-16 flex px-px py-px"
                                style={{
                                    justifyContent: mode === 'retriever_only' ? 'flex-start' : 'flex-end',
                                    backgroundColor: mode === 'retriever_only' ? 'gray' : 'rgba(0, 0, 255, 0.6)'
                                }}
                            onClick={toggleSwitch}>
                                
                                <motion.button className="bg-white rounded-full w-8 h-8 shadow-md transform" 
                                layout transition={{
                                    type: "spring",
                                    stiffness: 700,
                                    damping: 30
                                    }} />
                            </div>
                        </div>

                        {/* Number of results */}
                        <div className='flex gap-4 justify-center items-center'>
                            <span>Number of results</span>
                            <input type="number" aria-label='numResults'
                                min={1}
                                max={10}
                                step={1}
                                value={top_k}
                                onChange={(e) => setTop_k(parseInt(e.target.value))}
                            className='border-2 w-16 border-gray-300 rounded-md pl-1 py-1'/>
                        </div>
                        
                        <motion.button className='mx-auto my-3 border-2 w-2/3 px-2 py-1 rounded-lg bg-gray-50'
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                // Save settings
                                setShowModal((curr) => !curr)
                            }}
                            >
                            Save
                        </motion.button>
                    </div>
                </motion.div>
                </AnimatePresence>
            </div>,
                document.getElementById('root') as HTMLElement
            )}
        </>
    )
}

export default Settings