# Nextjs-lightning-auth-template

A simple Next.js template that comes with Lightning login

## Why did I make this?

I spent about a week trying to figure out how to do Lightning authentication with React. There are a bunch of example repos but most of them did not use React and the ones that did either came with a lot of bloat or I couldn't figure out how to get them to work in prod. (they only worked locally)

This template uses https://github.com/chill117/passport-lnurl-auth for lightning authentication.

Special thanks to https://github.com/theGrape1337/lnurl-auth and https://github.com/Jared-Dahlke/simple-next-express-typescript

## To run locally

- You might have to install `next` so run `npm i next`

- make sure that your `.env` has `BASE_URL=http://localhost:3000` or whatever port you're running it on.

`npm i`

`npm run dev`

## To build and start

`npm run build`
`npm start`

## To deploy

I deployed this to https://render.com/ by doing the following inside render.com:

1. create new web service
2. for the `build command` use `npm i next && npm run build`
3. for the `start command` use `npm start`
4. add the domain that you are deploying to as an environment variable: Go to `environment` in Render, and add `BASE_URL=https://www.YOURDOMAIN.com` . So for example for my site I used `https://lnauth-template.onrender.com`
