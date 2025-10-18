### Hey, welcome here. I have built a microservice (an API) that can make the justification of any text defined.

### You can actually try it out !!! There are two different ways to do so.

- Locally on your machine by setting up the environnement
- Locally on your machine with Docker

### Before that, you should make sure you have installed:
- Node JS (mine is 23.1.0)
- Docker (if you will rather perform the environnement set up with it)

### And make sure you:
- Clone this repository with `git clone https://github.com/Joel-Henri-NGOUBE/api-justify.git`

## Locally on your machine by setting up the environnement

- You should change the directory to cloned directory with `cd api-justify`

- You can run the command `npm install` in order to get all the dependencies of the project

- You can then run `npm run dev` to start the microservice

#### They are other commands available if you want to tranpile or build the project in the `script` property of `package.json` file. Run then like the former command.

## Locally on your machine by setting up the environnement

Because the commands docker and docker compose come together when your install docker, there is no need to do the configuration with the docker command. Docker compose eases it all !!!

- Just run `docker-compose up` to build the image, run the network of containers and launch the microservice (you can see at which moment the app is ready). You can therefore go use the microservice at the url `http://localhost:3501`

### Here is the API documentation, very simple, as the service itselt :). They are just 2 endpoints :).

- `POST` **api/justify** *body → {’text’: ‘the_text_to_justify’}* ⇒ *content-type → text/plain* (The justified text)
    - Needs a token generated in the `Authorization` header of the request like the following (example with a JavaScript Object): `Authorization: Bearer {JWT}`
    - The daily rate limit is 80 000 words / day / token

- `POST` **api/token** *body → {’email’: ‘email@gmail.com’}* ⇒ *response → {’token’: ‘JWT’, ...withSomeOtherKeyValueMembers}*
    - The former step before having your step justified
    - Returns a JWT useful for the justification

#### Et voilà... Le périple se termine ici. Bonne continuation dans ce monde de développeurs :)
