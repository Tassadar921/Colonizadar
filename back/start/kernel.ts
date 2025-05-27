/*
|--------------------------------------------------------------------------
| HTTP kernel file
|--------------------------------------------------------------------------
|
| The HTTP kernel file is used to register the middleware with the server
| or the router.
|
*/

import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'
import Language from '#models/language';
import { I18n } from '@adonisjs/i18n';
import User from '#models/user';
import Room from '#models/room';
import Game from '#models/game';
import RoomPlayer from '#models/room_player';
import GameTerritory from '#models/game_territory';

declare module '@adonisjs/core/http' {
    export interface HttpContext {
        language: Language;
        i18n: I18n;
        user: User;
        room: Room;
        game: Game;
        player: RoomPlayer;
        gameTerritory: GameTerritory;
    }
}

/**
 * The error handler is used to convert an exception
 * to a HTTP response.
 */
server.errorHandler(() => import('#exceptions/handler'))

/**
 * The server middleware stack runs middleware on all the HTTP
 * requests, even if there is no route registered for
 * the request URL.
 */
server.use([() => import('#middleware/container_bindings_middleware'), () => import('#middleware/force_json_response_middleware'), () => import('@adonisjs/cors/cors_middleware')])

/**
 * The router middleware stack runs middleware on all the HTTP
 * requests with a registered route.
 */
router.use([() => import('@adonisjs/core/bodyparser_middleware'), () => import('@adonisjs/auth/initialize_auth_middleware')])

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
  isGamePlaying: () => import('#middleware/is_game_playing_middleware'),
  isGamePlayer: () => import('#middleware/is_game_player_middleware'),
  gameTerritory: () => import('#middleware/game_territory_middleware'),
  isOwnedTerritory: () => import('#middleware/is_owned_territory_middleware'),
  isForeignTerritory: () => import('#middleware/is_foreign_territory_middleware'),
  isValidSeason: () => import('#middleware/is_valid_season_middleware'),
  log: () => import('#middleware/log_middleware'),
})
