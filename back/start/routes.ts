import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';

const EventStreamController = () => import('@adonisjs/transmit/controllers/event_stream_controller');
const SubscribeController = () => import('@adonisjs/transmit/controllers/subscribe_controller');
const UnsubscribeController = () => import('@adonisjs/transmit/controllers/unsubscribe_controller');

const AuthController = () => import('#controllers/auth_controller');
const ProfileController = () => import('#controllers/profile_controller');
const FileController = () => import('#controllers/file_controller');
const BlockedUserController = () => import('#controllers/blocked_user_controller');
const FriendController = () => import('#controllers/friend_controller');
const NotificationController = () => import('#controllers/notification_controller');
const PendingFriendController = () => import('#controllers/pending_friend_controller');
const UserController = () => import('#controllers/user_controller');
const RoomController = () => import('#controllers/room_controller');
const PlayableCountryController = () => import('#controllers/playable_country_controller');
const MapController = () => import('#controllers/map_controller');
const GameController = () => import('#controllers/game_controller');

// API requests
router
    .group((): void => {
        router.post('/login', [AuthController, 'login']);

        router
            .group((): void => {
                router.post('/send-mail', [AuthController, 'sendAccountCreationEmail']);
                router.get('/confirm/:token', [AuthController, 'confirmAccountCreation']);
            })
            .prefix('account-creation');

        router
            .group((): void => {
                router.post('/send-mail', [ProfileController, 'sendResetPasswordEmail']);
                router.post('/confirm/:token', [ProfileController, 'resetPassword']);
            })
            .prefix('reset-password');

        router
            .group((): void => {
                router.get('/', (): { sessionTokenIsValid: boolean } => {
                    return { sessionTokenIsValid: true };
                });

                router.get('/logout', [AuthController, 'logout']);

                router
                    .group((): void => {
                        router.get('/', [ProfileController, 'getProfile']);
                        router.post('/update', [ProfileController, 'updateProfile']);
                    })
                    .prefix('profile');

                router
                    .group((): void => {
                        router.get('/', [FriendController, 'search']);
                        router.get('/add', [UserController, 'searchNotFriends']);

                        router.post('/ask', [PendingFriendController, 'add']);
                        router.post('/accept', [FriendController, 'accept']);
                        router.post('/refuse', [FriendController, 'refuse']);
                        router
                            .group((): void => {
                                router.get('/', [PendingFriendController, 'search']);
                                router.delete('/cancel/:userId', [PendingFriendController, 'cancel']);
                            })
                            .prefix('pending');
                        router.delete('/remove/:userId', [FriendController, 'remove']);
                    })
                    .prefix('friends');

                router
                    .group((): void => {
                        router.get('/', [BlockedUserController, 'search']);
                        router.get('/add/:userId', [BlockedUserController, 'block']);
                        router.delete('/cancel/:userId', [BlockedUserController, 'cancel']);
                    })
                    .prefix('blocked');

                router
                    .group((): void => {
                        router.get('/pending-friends', [NotificationController, 'getPendingFriends']);
                    })
                    .prefix('notifications');

                router
                    .group((): void => {
                        router.post('/create', [RoomController, 'create']);
                        router.get('/bot-difficulties', [RoomController, 'getBotDifficulties']);
                        router.get('/:mapId/playable-countries', [PlayableCountryController, 'getAll']);
                        router.get('/maps', [MapController, 'getAll']);
                        router.post('/join', [RoomController, 'checkWithToken']).use([middleware.room()]);
                        router
                            .group((): void => {
                                router.post('/invite', [RoomController, 'invite']);
                                router.put('/join', [RoomController, 'join']);
                                router.delete('/leave', [RoomController, 'leave']);
                                router.patch('/heartbeat', [RoomController, 'heartbeat']);
                                router.post('add-bot', [RoomController, 'addBot']);
                                router.delete('kick/:playerId', [RoomController, 'kick']);
                                router.patch('/player/:playerId/select-country', [RoomController, 'selectCountry']);
                                router.patch('/player/:playerId/select-difficulty', [RoomController, 'selectBotDifficulty']);
                                router.patch('/player/:playerId/ready', [RoomController, 'ready']);
                            })
                            .prefix(':roomId')
                            .use([middleware.room()]);
                    })
                    .prefix('room');

                router
                    .group((): void => {
                        router.get('/', [GameController, 'get']);
                    })
                    .prefix('game/:gameId')
                    .use([middleware.game()]);
            })
            .use([middleware.auth({ guards: ['api'] })]);

        router
            .group((): void => {
                router.get('/profile-picture/:userId', [FileController, 'serveStaticProfilePictureFile']);
                router.get('/bot-picture/:botId', [FileController, 'serveStaticBotPictureFile']);
                router
                    .group((): void => {
                        router.get('/:countryId', [FileController, 'serveStaticCountryFlagFile']);
                        router.get('/:mapId/neutral', [FileController, 'serveStaticNeutralCountryFlagFile']);
                    })
                    .prefix('country-flag');
            })
            .prefix('static')
            .use([middleware.queryStringAuth()]);
    })
    .prefix('api')
    .use([middleware.language()]);

router.get('/__transmit/events', [EventStreamController]);
router.post('/__transmit/subscribe', [SubscribeController]);
router.post('/__transmit/unsubscribe', [UnsubscribeController]);
