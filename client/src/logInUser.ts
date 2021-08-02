import api from "./api";
import { User } from "./types";

interface Values {
  username: string;
  password: string;
}

const logInUser = async ({ username, password }: Values): Promise<void> => {
  const res = await api.post<Partial<User>>("/users/login", {
    username,
    password,
  });
  if (res.data) {
    localStorage.setItem("user", JSON.stringify(res.data));
    console.log(res.headers.cookies);
  }
};

export default logInUser;
