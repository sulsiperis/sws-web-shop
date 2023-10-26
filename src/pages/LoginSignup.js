export default function LoginSignup() {
    return (
        <div>
            <form>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <input type="submit" value="Login" />
            </form>
            <span className="link">Sign-up</span>
        </div>
    )
}