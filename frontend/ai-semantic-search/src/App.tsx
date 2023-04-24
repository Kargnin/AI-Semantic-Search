import { useRef,useState } from 'react'
import { result } from './types/result'
import {motion} from 'framer-motion'

import Result from './components/result'
import Settings from './components/settings'

import useStore from './store'

function App() {

  const ref = useRef<HTMLInputElement>(null)

  const [results, setResults] = useState<result[]>([])

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const mode = useStore(state => state.mode) as 'retriever_only' | 'retriever+reader'
  const top_k = useStore(state => state.top_k) as number

  const getResults = async (query: string) => {
    setLoading(true)
    setError('')
    try {
      if(query === '') {
        throw new Error('Query is empty')
      }
      const url = new URL('http://localhost:8000/')
      url.searchParams.append('query', query)
      url.searchParams.append('mode', mode)
      url.searchParams.append('top_k', top_k.toString())
      // Make a get request
      const response = await fetch(url)
      console.log("🚀 ~ file: App.tsx:26 ~ getResults ~ response:", response)
      const data = await response.json()
      console.log("🚀 ~ file: App.tsx:26 ~ getResults ~ data:", data)
      setResults(data.results)
      setLoading(false)
    }
    catch (err) {
      setError(err.message +'.Try Again!')
      setLoading(false)
    }
  }

  return (
    <>
      <div className='h-screen flex flex-col'>
        <motion.div className='px-10 py-10 flex justify-around'>
          <motion.header 
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
          className='text-4xl font-bold'>AI Semantic Search</motion.header>
          <motion.span
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
          >By: <b>Bhushan Malani</b></motion.span>

        </motion.div>
        <div className='w-5/12 mx-auto my-auto pb-20'>
          <motion.div className='px-10 py-5 flex gap-5 justify-center'>
              {/* SearchBar */}
              <motion.input aria-label='search' type="text" ref={ref} 
                className='border-2 w-2/3 border-gray-300 rounded-md p-2'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    ref.current?.blur()
                    getResults(ref.current?.value || '')
                  }
                }}
              />
              {/* SearchButton */}
              <motion.button className='border-2 px-2 py-1 rounded-lg bg-gray-50'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
               onClick={() => {
                // ref.current?.value
                // ref.current?.focus()
                // ref.current?.blur()
                // Get results from the server
                getResults(ref.current?.value || '')
                ref.current?.focus()
              }}>Search</motion.button>
              <Settings/>
          </motion.div>
          {!error && !loading && results.length > 0 && results.map((result,index) => {
            return (
              <Result key={index} context={result.context} start={result.start} end={result.end} answer={result.answer} />
            )}
          )}
          {!error && !loading && (results.length < 1) &&
            <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className='w-full flex justify-center'>Search something</motion.div>
          }
          {error && <motion.p
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-red-500 flex justify-center'>{error}</motion.p>}
          {loading && <motion.p 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
          className='text-blue-500 flex justify-center'>Loading...</motion.p>}
        </div>
      </div>
    </>
  )
}

export default App
