export default class RegexService {
    public isValidUri(uri: string): boolean {
        const isValidUriRegex = /^(https?|ftp):\/\/[^\s\/$.?#].\S*$/i;
        return isValidUriRegex.test(uri);
    }

    public isValidPassword(password: string): boolean {
        const isValidPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        return isValidPasswordRegex.test(password);
    }

    public isValidEmail(email: string): boolean {
        const isValidEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return isValidEmailRegex.test(email);
    }

    public formatGameNumbers(number: number): string {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
}
