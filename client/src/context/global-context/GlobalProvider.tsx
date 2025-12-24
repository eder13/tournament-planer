import {
    createContext,
    useReducer,
    type Dispatch,
    type FC,
    type PropsWithChildren,
} from 'react';

interface State {
    isMounted: boolean;
    user: {
        id: number;
        email: string;
        isLoggedIn: boolean;
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
          type: 'mounted';
      }
    | {
          type: 'setCsrf';
          data: string;
      };

const initialContextState: State = {
    isMounted: false,
    user: {
        id: -1,
        email: '',
        isLoggedIn: false,
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
                    isLoggedIn: true,
                },
            };
        }
        case 'loggedOut': {
            return {
                ...state,
                user: {
                    id: -1,
                    email: '',
                    isLoggedIn: false,
                },
            };
        }
        case 'mounted': {
            return {
                ...state,
                isMounted: true,
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
