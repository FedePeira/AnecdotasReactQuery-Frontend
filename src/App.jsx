import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useReducer } from 'react'

import { getAnecdotes, updateAnecdote } from './requests'

import NotificationContext from './NotificationContext'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "NEW_ANECDOTE":
      return 'You have created a new anecdote!!!'
    case "VOTE_ANECDOTE":
      return 'You have voted!!!'
    case "ERROR_LENGTH":
      return 'too short anecdote, must have length 5 or move'
    case "CLEAR_MESSAGE":
      return ''
    default:
      return state
  }
}

const App = () => {
  const [message, messageDispatch] = useReducer(notificationReducer, '')
  const queryClient = useQueryClient()
  const updateAnecdoteMutation = useMutation({ 
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    }
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false
  })

  if(result.isLoading) {
    return <div><h2>anecdote service not available due to problems in server</h2></div>
  }

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    messageDispatch({type: "VOTE_ANECDOTE"})
    console.log('Voted')
    setTimeout(() => {
      messageDispatch({type: "CLEAR_MESSAGE"});
   }, 5000);
  }

  const anecdotes = result.data

  return (
    <NotificationContext.Provider value={[message, messageDispatch]}>
      <h3>Anecdote app</h3>
    
      <Notification/>
      <AnecdoteForm type={"NEW_ANECDOTE"}/>
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  )
}

export default App
