import { LOGIN } from './login.actions'

const initialState = {
    idUser: '',
    email: '',
    password: '',
    username: 'Test',
    isLogin: false,
}

const LoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state, isLogin: true, username: 'Test User'
            }
        default:
            return state;
    }

}

export default LoginReducer;