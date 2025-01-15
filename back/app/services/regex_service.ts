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

    public isValidFileTitle(title: string): boolean {
        const isValidTitleRegex = /^[^\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u26FF\u2700-\u27BF]*$/;
        return isValidTitleRegex.test(title);
    }

    public isValidTagName(name: string): boolean {
        const isValidTagNameRegex = /^[^\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u26FF\u2700-\u27BF]*$/;
        return isValidTagNameRegex.test(name);
    }
}
