import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import API from "../../lib/api";
import * as api from "../../lib/api";
import * as USER from "../../lib/user";

interface ILoginDTO {
  email: string;
  password: string;
}

// FIXME: Change this types from any
type IAttendee = any;
type ISopnsor = any;
type IManager = any;

type IUser = IAttendee | ISopnsor | IManager;

interface IAuthContext {
  user: IUser;
  errors?: string;

  // Booleans
  isAuthenticated: boolean;
  isLoading: boolean;

  // Updates user in state
  updateUser: (user: IUser) => void;
  refetchUser: () => void;

  // Api calls
  login: (params: ILoginDTO) => void;
  logout: () => void;
  editUser: (username: string) => void;
  sign_up: (fields: any) => void;
}

export const AuthContext = createContext({} as IAuthContext);

const TOKEN_KEY_NAME = "safira_token";

// Function that consumes the context
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [errors, setErrors] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isFirstLoading, setFirstLoading] = useState(true);
  const [needsRefetch, setRefetch] = useState(true);

  useEffect(() => {
    if (user) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    const jwt = localStorage.getItem(TOKEN_KEY_NAME);

    if (!jwt) {
      // No jwt means it's user's first time
      setFirstLoading(false);
      return;
    }

    API.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
    api
      .getCurrentUser()
      .then((response) => {
        setUser(response);
      })
      .catch((_errors) => {
        // It means the jwt is expired
        localStorage.clear();
        delete API.defaults.headers.common["Authorization"];
      })
      .finally(() => setFirstLoading(false));
  }, [needsRefetch]);

  function sign_up(fields) {
    setLoading(true);

    api
      .sign_up(fields)
      .then(({ jwt }) => {
        localStorage.setItem(TOKEN_KEY_NAME, jwt);
        API.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
        api.getCurrentUser().then((response) => {
          setUser(response);
          switch (response.type) {
            case USER.ROLES.ATTENDEE:
              router.push("/attendee/profile");
              break;
            case USER.ROLES.SPONSOR:
              router.push("/sponsor/scanner");
              break;
            case USER.ROLES.MANAGER:
              router.push("/manager/badges");
              break;
            default:
              throw new Error(`Unknown USER TYPE: ${response.type}`);
          }
        });
      })
      .catch((errors) => {
        setErrors(errors);
        setUser(undefined);
        setLoading(false);
      });
  }

  function login({ email, password }) {
    setLoading(true);

    api
      .sign_in({ email, password })
      .then(({ jwt }) => {
        localStorage.setItem(TOKEN_KEY_NAME, jwt);
        API.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
        api.getCurrentUser().then((response) => {
          setUser(response);
          switch (response.type) {
            case USER.ROLES.ATTENDEE:
              router.push("/attendee/profile");
              break;
            case USER.ROLES.SPONSOR:
              router.push("/sponsor/scanner");
              break;
            case USER.ROLES.MANAGER:
              router.push("/manager/badges");
              break;
            default:
              throw new Error(`Unknown USER TYPE: ${response.type}`);
          }
        });
      })
      .catch((errors) => {
        if (errors.response?.data?.error) {
          setErrors(errors.response.data.error);
        } else {
          setErrors(errors.response.data.error);
        }
        setUser(undefined);
        setLoading(false);
      });
  }

  function logout() {
    setLoading(true);
    localStorage.clear();
    delete API.defaults.headers.common["Authorization"];
    setUser(undefined);
    router.push("/");
  }

  function editUser(nickname) {
    setLoading(true);

    api
      .editUser(user.id, nickname)
      .then((at) => {
        setUser((oldUser) => ({ ...oldUser, ...at }));
      })
      .catch((errors) => {
        setUser(undefined);
        setErrors(errors);
      });
  }

  function refetchUser() {
    setRefetch((needsRefetch) => !needsRefetch);
  }

  function updateUser(updatedUser: IUser) {
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        updateUser: updateUser,
        errors,
        login,
        logout,
        editUser,
        refetchUser,
        sign_up,
      }}
    >
      {!isFirstLoading && children}
    </AuthContext.Provider>
  );
}
