/*
|--------------------------------------------------------------------------
| HTTP kernel file
|--------------------------------------------------------------------------
|
| The HTTP kernel file is used to register the middleware with the server
| or the router.
|
*/

import router from '@adonisjs/core/services/router';
import server from '@adonisjs/core/services/server';

/**
 * The error handler is used to convert an exception
 * to a HTTP response.
 */
server.errorHandler(() => import('#exceptions/handler'));

/**
 * The server middleware stack runs middleware on all the HTTP
 * requests, even if there is no route registered for
 * the request URL.
 */
server.use([() => import('#middleware/container_bindings_middleware'), () => import('#middleware/force_json_response_middleware'), () => import('@adonisjs/cors/cors_middleware')]);

/**
 * The router middleware stack runs middleware on all the HTTP
 * requests with a registered route.
 */
router.use([() => import('@adonisjs/core/bodyparser_middleware'), () => import('@adonisjs/auth/initialize_auth_middleware')]);

/**
 * Named middleware collection must be explicitly assigned to
 * the routes or the routes group.
 */
export const middleware = router.named({
    auth: () => import('#middleware/auth_middleware'),
    language: () => import('#middleware/language_middleware'),
    queryStringAuth: () => import('#middleware/query_string_auth_middleware'),
    room: () => import('#middleware/room_middleware'),
    isRoomOwner: () => import('#middleware/is_room_owner_middleware'),
    isRoomPlayer: () => import('#middleware/is_room_player_middleware'),
    game: () => import('#middleware/game_middleware'),
    isGamePlayer: () => import('#middleware/is_game_player_middleware'),
    gameTerritory: () => import('#middleware/game_territory_middleware'),
    isOwnedTerritoryPlayer: () => import('#middleware/is_owned_territory_middleware'),
    isForeignTerritoryPlayer: () => import('#middleware/is_foreign_territory_middleware'),
    isValidSeason: () => import('#middleware/is_valid_season_middleware'),
});
