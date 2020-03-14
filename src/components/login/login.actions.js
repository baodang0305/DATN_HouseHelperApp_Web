export const LOGIN = "LOGIN";


export const login = (res) => ({
    type: LOGIN,
    data: { res }
});