import Axios from 'axios'
import React from 'react'
//import { baseUrl } from '../constants'

export const useUser = () => {
	const [user, setUser] = React.useState<string | null>(null)
	React.useEffect(() => {
		Axios({
			method: 'GET',
			withCredentials: true,
			url: '/user'
		}).then((res) => {
			res.data.id ? setUser(res.data.id) : (window.location.href = '/')
		})
	}, [])
	return user
}
