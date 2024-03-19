import { useMutation, useQueryClient  } from '@tanstack/react-query'
import { useContext } from 'react'
import PropTypes from 'prop-types';

import { createAnecdote } from '../requests'
import NotificationContext from '../NotificationContext'

const AnecdoteForm = ({ type }) => {
  const [message, messageDispatch] = useContext(NotificationContext)

  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    if(content.length > 5) {
      event.target.anecdote.value = ''
      newAnecdoteMutation.mutate({ content, votes: 0 })
      messageDispatch({ type })
      setTimeout(() => {
        messageDispatch({ type: "CLEAR_MESSAGE" });
     }, 5000);
      console.log('New anecdote')
    } else {
      console.error('Error 400: content too short')
    }
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

AnecdoteForm.propTypes = {
 type: PropTypes.string.isRequired,

}
export default AnecdoteForm
