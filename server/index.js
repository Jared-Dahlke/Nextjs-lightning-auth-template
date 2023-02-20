import express, { Request, Response } from 'express'
import next from 'next'
const LnurlAuth = require('passport-lnurl-auth')
const passport = require('passport')
const session = require('express-session')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

//const baseUrl = process.env.BASE_URL // || 'http://localhost:3000'

;(async () => {
	try {
		await app.prepare()
		const server = express()
		server.get('/test', (req, res) => {
			return res.send('test')
		})

		server.use(
			session({
				secret: '12345',
				resave: true,
				saveUninitialized: true
			})
		)
		server.use(passport.initialize())
		server.use(passport.session())
		const map = {
			user: new Map()
		}
		passport.serializeUser(function (user, done) {
			done(null, user.id)
		})
		passport.deserializeUser(function (id, done) {
			done(null, map.user.get(id) || null)
		})
		passport.use(
			new LnurlAuth.Strategy(function (linkingPublicKey, done) {
				let user = map.user.get(linkingPublicKey)
				if (!user) {
					user = { id: linkingPublicKey }
					map.user.set(linkingPublicKey, user)
				}
				done(null, user)
			})
		)
		server.use(passport.authenticate('lnurl-auth'))
		server.get('/', function (req, res) {
			if (!req.user) {
				console.log('not authenticated')
				return res.send(
					'You are not authenticated. To login go <a href="/login">here</a>.'
				)

				// return res.redirect('/login');
			}
			console.log('0authenticated')
			res.send('Logged-in')
		})
		server.get(
			'/login',
			function (req, res, next) {
				if (req.user) {
					console.log('already authenticated')
					// Already authenticated.
					//return res.redirect(process.env.FRONT_END_URL)
					return res.redirect('/home')
				}
				console.log('next')
				next()
			},
			new LnurlAuth.Middleware({
				callbackUrl: '/login',
				cancelUrl: '/' // process.env.FRONT_END_URL,
				//loginTemplateFilePath: path.join(__dirname, 'login.html')
			})
		)
		server.get('/user', (req, res) => {
			res.send(req.user)
		})
		server.get('/logout', function (req, res, next) {
			if (req.user) {
				req.session.destroy()
				res.json({ message: 'user logged out' })
				// Already authenticated.
				return res.redirect('/')
			}
			next()
		})

		server.all('*', (req, res) => {
			return handle(req, res)
		})

		server.listen(port, (err) => {
			if (err) throw err
			console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`)
		})
	} catch (e) {
		console.error(e)
		process.exit(1)
	}
})()
