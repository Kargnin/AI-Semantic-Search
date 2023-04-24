import { FC } from 'react'
import { result } from '../types/result'
import {motion} from 'framer-motion'

const Result : FC<result> = ({answer,context,start,end}) => {    
    // Display the context and highlight text from start to end
    return (
        <motion.div 
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.99 }}
        className='px-12 py-10 my-10 rounded-xl shadow-lg flex-col'>
            <div className='text-xl font-bold py-3'>
                {answer}
            </div>
            <div className=''>
                <span className=''>{context.slice(0,start)}</span>
                <span className='bg-yellow-200'>{context.slice(start,end)}</span>
                <span className=''>{context.slice(end)}</span>
            </div>
        </motion.div>
    )
}

export default Result