import express from 'express'
import next from 'next'
const LnurlAuth = require('passport-lnurl-auth')
const passport = require('passport')
const session = require('express-session')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = 3000

const baseUrl = process.env.BASE_URL

;(async () => {
	try {
		await app.prepare()
		const server = express()

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
				return res.send(
					'You are not authenticated. To login go <a href="/login">here</a>.'
				)
			}
			res.send('Logged-in')
		})
		server.get(
			'/login',
			function (req, res, next) {
				if (req.user) {
					// Already authenticated.
					return res.redirect(baseUrl + '/home')
				}
				next()
			},
			new LnurlAuth.Middleware({
				callbackUrl: baseUrl + '/login',
				cancelUrl: baseUrl,
				loginTemplateFilePath: 'server/login.html'
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
				return res.redirect(baseUrl)
			}
			next()
		})

		server.all('*', (req, res) => {
			return handle(req, res)
		})

		server.listen(port, (err) => {
			if (err) throw err
			console.log(`Ready on ${baseUrl}`)
		})
	} catch (e) {
		console.error(e)
		process.exit(1)
	}
})()
