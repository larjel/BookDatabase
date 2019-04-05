# Lab 2 - JavaScript

Ni ska skapa en webbapplikation där man kan spara sina favoritböcker. Laborationen ska utföras två och två. Syftet är att träna på DOM-manipulation och AJAX med JavaScript och React.

### Uppgiften

Ni ska göra en webbapplikation som visar en lista med böcker. Till er hjälp har ni ett API, med dokumentation här: https://www.forverkliga.se/JavaScript/api/crud.php

API:et har funktioner som motsvarar SQL insert, select, update och delete. Varje operation returnerar ett svar i JSON-format, som talar om ifall operationen har lyckats eller inte. Efter att ni har fått svar från API:et ska ni tala om för användaren om operationen misslyckades, eller om den lyckades och efter hur många försök.

Sidan ska vara en Single Page App (SPA) dvs inga länkar till andra HTML-filer, utan alla förändringar på sidan ska göras med JavaScript/React.

Ge användaren möjlighet att begära en ny API-nyckel. Ni kan spara den senaste i koden eller med localStorage.

Det ska finnas ett formulär för att lägga till en ny bok.

Existerande böcker ska visas i en lista med titel och författare.

Minst 3 olika komponenter ska användas

Minst 5 olika komponenter ska användas (VG)

Det ska finnas ett formulär för att ändra en bok i listan. (VG)

Det ska finnas en funktion för att ta bort en bok ur listan. (VG)

Den som vill ha en extra utmaning (inte betygsatt) kan implementera ett filter: en textruta där man skriver text; listan med böcker uppdateras så att bara de böcker som matchar texten visas. Görs bäst med higher order functions.
