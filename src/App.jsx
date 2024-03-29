import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery } from '@tanstack/react-query'
import { getAnecdotes } from './requests'

const App = () => {

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })
  console.log(result.data)

  if(result.isLoading) {
    return <div><h2>anecdote service not available due to problems in server</h2></div>
  }

  const handleVote = (anecdote) => {
    console.log('vote')
  }

  const anecdotes = result.data
  console.log(anecdotes)

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
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
    </div>
  )
}

export default App
