import axios, { AxiosError, AxiosResponse } from "axios";
import { useSnackbar } from "material-ui-snackbar-provider";
import { useHistory, useLocation } from "react-router-dom";
import { Group, ThingToBring, User } from "types";

interface UserCredentials {
  username: string;
  password: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useApi = () => {
  const snackbar = useSnackbar();
  const { pathname } = useLocation();
  const { push } = useHistory();

  const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
  });

  api.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (pathname === "/login") {
          snackbar.showMessage("There was an error logging in");
        } else if (pathname === "/signup") {
          snackbar.showMessage(`error signing up: ${error.response?.data.err}`);
        } else {
          snackbar.showMessage("You have to be signed in to use this app");
          push({ pathname: "/login", search: `?redirect=${pathname}` });
        }
      } else {
        snackbar.showMessage(`Error: ${error.message}`);
        return error;
      }
    }
  );

  const logIn = (creds: UserCredentials): Promise<AxiosResponse<User>> =>
    api.post("/users/login", creds);

  const getCurrentUser = (): Promise<AxiosResponse<User>> => api.get("/me");

  const getUser = (username: string): Promise<AxiosResponse<User>> =>
    api.get(`/users/${username}`);

  const signUp = (creds: UserCredentials): Promise<AxiosResponse<any>> =>
    api.post("/users/signup", creds);

  const logOut = (): Promise<AxiosResponse> => api.get("/users/logout");

  const getGroup = (groupId: string): Promise<AxiosResponse<Group>> =>
    api.get(`/groups/${groupId}`);

  const saveGroup = (groupId: string): Promise<AxiosResponse<User>> =>
    api.get(`/users/saveGroup/${groupId}`);

  const getSavedGroups = (): Promise<AxiosResponse<Group[]>> =>
    api.get(`/users/savedGroups`);

  const getThingsToBring = (
    groupId?: string
  ): Promise<AxiosResponse<ThingToBring[]>> =>
    api.get(groupId ? `/groups/${groupId}/getThingsToBring` : "/thingsToBring");

  const createGroup = (data: Partial<Group>): Promise<AxiosResponse<Group>> =>
    api.post(`/groups/`, data);

  const addThingToBring = (
    thingToBring: Partial<ThingToBring>,
    groupId?: string
  ): Promise<AxiosResponse<ThingToBring>> =>
    api.post(
      groupId ? `/groups/${groupId}/addThingToBring` : "/thingsToBring",
      thingToBring
    );

  const deleteThingToBring = (id: string): Promise<AxiosResponse> =>
    api.delete(`/thingsToBring/${id}`);

  const deleteGroup = (groupId: string): Promise<AxiosResponse> =>
    api.delete(`/groups/${groupId}`);

  return {
    logIn,
    signUp,
    logOut,
    getCurrentUser,
    getUser,
    getSavedGroups,
    getGroup,
    saveGroup,
    getThingsToBring,
    addThingToBring,
    createGroup,
    deleteGroup,
    deleteThingToBring,
  };
};

export default useApi;
