import create from 'zustand';

interface SettingState {
    mode: 'retriever_only' | 'retriever+reader',
    top_k: number,
    setMode: (mode : 'retriever_only' | 'retriever+reader') => void,
    setTopK: (top_k: number) => void,
}

// Create store to store settings
const useStore = create<SettingState>()(set => ({
    mode: 'retriever_only',
    top_k: 3,
    setMode: (mode : 'retriever_only' | 'retriever+reader') => {
        return set(
            state => ({
                ...state,
                mode: mode,
            })
         )},
    setTopK: (top_k) => {
        return set(state => ({
            ...state,
            top_k: top_k,
        }))
    }
}))

export default useStore;