# nextjs-lightning-passport-lnurl-auth

A simple Next.js template that comes with Lightning login

## Why did I make this?

I spent about a week trying to figure out how to do Lightning authentication with React. There are a bunch of example repos but most of them did not use React and the ones that did were too complicated for me and came with a lot of bloat.

It uses https://github.com/chill117/passport-lnurl-auth.

Special thanks to https://github.com/theGrape1337/lnurl-auth and https://github.com/Jared-Dahlke/simple-next-express-typescript

If you're looking for a more robust and "built out" template for lightning auth checkout https://github.com/zerealschlauskwab/lnapp-starter

## To run locally

You might have to install `next` so run `npm i next`

`npm i`

`npm start`

## To build

`npm run build`
`npm start`

## To deploy

I deployed this to https://render.com/

at render.com do the following:
-create new web service
-for the `build command` use `npm i next && npm run build`
-for the start commans use `npm start`
