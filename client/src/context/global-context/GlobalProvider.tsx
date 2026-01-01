import {
    createContext,
    useReducer,
    type Dispatch,
    type FC,
    type PropsWithChildren,
} from 'react';

export enum LoginStatus {
    LOGGED_IN,
    LOGGED_OUT,
    LOGGED_UNKNOWN,
}

interface State {
    user: {
        id: number;
        email: string;
        loginStatus: LoginStatus;
    };
    csrfToken: string;
}

type Action =
    | {
          type: 'loggedIn';
          data: {
              id: number;
              email: string;
          };
      }
    | {
          type: 'loggedOut';
      }
    | {
          type: 'setCsrf';
          data: string;
      };

const initialContextState: State = {
    user: {
        id: -1,
        email: '',
        loginStatus: LoginStatus.LOGGED_UNKNOWN,
    },
    csrfToken: '',
};

export const GlobalContext = createContext(initialContextState);
export const GlobalContextDispatch = createContext<Dispatch<Action>>(() => {});

function globalReducer(state: State, action: Action) {
    switch (action.type) {
        case 'loggedIn': {
            return {
                ...state,
                user: {
                    id: action.data.id,
                    email: action.data.email,
                    loginStatus: LoginStatus.LOGGED_IN,
                },
            };
        }
        case 'loggedOut': {
            return {
                ...state,
                user: {
                    id: -1,
                    email: '',
                    loginStatus: LoginStatus.LOGGED_OUT,
                },
            };
        }
        case 'setCsrf': {
            return {
                ...state,
                csrfToken: action.data,
            };
        }
        default:
            return state;
    }
}

const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(globalReducer, initialContextState);

    return (
        <GlobalContext.Provider value={state}>
            <GlobalContextDispatch.Provider value={dispatch}>
                {children}
            </GlobalContextDispatch.Provider>
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
