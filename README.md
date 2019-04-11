# Bokdatabas byggd med JavaScript, React och AJAX
En webbapplikation som visar en lista med böcker. Den sparar och läser in böckerna i en databas via ett Rest API.
API:et har funktioner som motsvarar SQL insert, select, update och delete.

Varje operation returnerar ett svar i JSON-format, som talar om ifall operationen har lyckats eller inte.
(API:et simulerar fel och därför finns en räknare för antalet återförsök som måste göras.)

Sidan är en Single Page App (SPA) dvs inga länkar till andra HTML-filer finns, utan alla förändringar på sidan görs med JavaScript/React.

Testa här: [https://larjel.github.io/library-js-react-ajax/](https://larjel.github.io/library-js-react-ajax/) 