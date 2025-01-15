import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';

const HomeController = () => import('#controllers/home_controller');
const AuthController = () => import('#controllers/auth_controller');
const ProfileController = () => import('#controllers/profile_controller');

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

        router.get('/terms-and-conditions', [ProfileController, 'acceptTermsAndConditions']);

        router
            .group((): void => {
                router.get('/logout', [AuthController, 'logout']);

                router
                    .group((): void => {
                        router.get('/', [ProfileController, 'getProfile']);
                        router.post('/update', [ProfileController, 'updateProfile']);
                    })
                    .prefix('profile');
            })
            .use([middleware.auth({ guards: ['web'] })]);
    })
    .use([middleware.language()]);

router.get('/', [HomeController, 'renderHome']);
