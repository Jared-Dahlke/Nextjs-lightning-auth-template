import { useUser } from '../useUser'

function Home() {
	const user = useUser()
	return <div>Home: {user}</div>
}

export default Home
