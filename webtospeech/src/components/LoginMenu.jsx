import { supabase } from '../supabaseClient'

export default function LoginMenu() {

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })

    if (error) console.error(error.message)
  }

  return (
    <div>
      <button onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  )
}