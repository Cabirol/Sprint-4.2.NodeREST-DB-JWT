# Sprint-4.2.NodeREST-DB-JWT

https://github.com/sequelize/express-example

Construirem una API que doni suport a un joc de daus ;)

Al joc de daus s’hi juga amb dos daus de sis cares:

En cas que el resultat dels dos daus sigui 7 la partida es guanya, si no es perd.
Per poder jugar al joc t’has de registrar com a jugador amb un nom. Un jugador pot veure un llistat de totes les tirades que ha fet i el seu percentatge d’èxit.
Per poder realitzar una tirada, un usuari s’ha de registrar amb un nom no repetit. Al ser creat, se li assigna un identificador únic i una data de registre.
Si l’usuari ho desitja, pot no afegir cap nom i es dirà “ANÒNIM”. Pot haver-hi més d’un jugador “ANÒNIM”.
Cada jugador pot veure un llistat de totes les tirades que ha fet amb el valor de cada dau i si s’ha guanyat o no la partida. A més, pot saber el percentatge d’èxit de les tirades que ha realitzat.
No es pot eliminar una partida en concret, però si que es pot eliminar tot el llistat de tirades d'un jugador. El software ha de permetre llistar tots els jugadors que hi ha al sistema, el percentatge d’èxit de cada jugador i el percentatge d’èxit mig de tots els jugadors en el sistema.
El software ha de respectar els principals patrons de disseny.
Has de tenir en compte els següents detalls de construcció:

## POST /players: crea un jugador

S'ha d'introduïr el camp name. Rebutja altres camps. Es pot no passar res, o un objecte buit. O un objecte amb el camp name buit. En aquests casos l'usuari es diu anon. Si l'usuari té un altre nom, no es pot repetir.

## PUT /players: modifica el nom del jugador

Busca user a la base de dades l'id del jugador, i el nou nom. Dona error si se li donen altres camps, o si falta algun d'aquests dos. No permet un nom buit, o anònim. Tampoc permet  un nom que estigui en us per un altre jugador, però no passa res si et canvies el nom a tu mateix pel que ja tenies.

## POST /players/{id}/games: un jugador específic realitza una tirada

Guarda dos daus amb un camp owner (l'id del jugador). S'ha d'introduïr l'id d'un jugador. Si l'id no correspon a cap jugador, dona error.

## DELETE /players/{id}/games: elimina les tirades del jugador

S'ha de proporcionar l'id d'un jugador. Si el jugador no existeix, salta error. Si el jugador existeix, esborra les seves jugades, i et retorna el nombre de jugades esborrades.

## GET /players: retorna el llistat de tots els jugadors del sistema amb el seu percentatge mig d’èxits

Retorna un array d'objectes amb l'id del jugador, el nom, i la ratio. Si el jugador no ha fet cap partida, en comptes de la ratio retorna un missatge explicatiu.

## GET /players/{id}/games: retorna el llistat de jugades per un jugador.

S'ha de proporcionar l'id d'un jugador. Si el jugador no existeix, salta error. Si el jugador existeix, et torna les seves jugades.

## GET /players/ranking: retorna el percentatge mig d’èxits del conjunt de tots els jugadors

Calcula el percentatge d'exits respecte totes les partides jugades, sense tenir en compte qui les ha jugat. (No la mitjana d'exit d'entre tots els jugadors)

## GET /players/ranking/loser: retorna el jugador amb pitjor percentatge d’èxit

Torna el jugador amb el pitjor ratio. Si no hi ha jugadors, o no hi ha partides, ho diu. Si hi ha un empat, torna a tots els empatats.
## GET /players/ranking/winner: retorna el jugador amb millor percentatge d’èxit

Torna el jugador amb el millor ratio. Si no hi ha jugadors, o no hi ha partides, ho diu. Si hi ha un empat, torna a tots els empatats.

Nivell 1
Persistència: utilitza com a base de dades Mysql (amb Sequelize com a ORM).

Nivell 2
Persistència: utilitza MongoDB (amb Mongoose) com a base de dades.

Nivell 3
Afegix un endpoint /login que permeti accedir a un administrador amb usuari i contrasenya i retorni un token i fes obligatòria l'autentificació per JWT en tots els accessos a les URL del microservei, utilitzant middlewares per validar al token.

