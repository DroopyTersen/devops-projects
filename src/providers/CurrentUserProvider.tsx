import { useState, useEffect, useMemo, useContext, useCallback } from "react";
import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { addMinutes } from "date-fns";

const defaultValue: CurrentUser = {
  // DefaultValues
  accessToken: "",
  expires: null,
  isAuthenticated: false,
  username: "",
};

const CurrentUserContext = React.createContext(null);

export function useCurrentUser() {
  return useContext(CurrentUserContext);
}

function useCurrentUserData(username) {
  let [currentUser, setCurrentUser] = useLocalStorage("devops-current-user", {
    ...defaultValue,
    username,
  });

  useEffect(() => {
    if (username !== currentUser.username) {
      setCurrentUser({
        ...defaultValue,
        username,
      });
    }
  }, [username]);

  let setToken = useCallback(
    function(token) {
      let updatedCurrentUser = {
        ...currentUser,
        isAuthenticated: true,
        accessToken: token,
        expires: addMinutes(new Date(), 58),
      };
      setCurrentUser(updatedCurrentUser);
    },
    [currentUser]
  );

  let getToken = useCallback(
    function() {
      if (currentUser.accessToken && new Date() <= currentUser.expires) {
        return currentUser.accessToken;
      }
      return null;
    },
    [currentUser]
  );

  return {
    user: currentUser,
    setToken,
    token: getToken(),
  };
}

export interface CurrentUser {
  // properties
  accessToken: string;
  expires: Date;
  isAuthenticated: boolean;
  username: string;
}

export default function CurrentUserProvider({ username, children }) {
  let currentUserData = useCurrentUserData(username);
  return (
    <CurrentUserContext.Provider value={currentUserData}>{children}</CurrentUserContext.Provider>
  );
}
// // Wrap your components with the Provider, use the data hook to get a value for the provider
// function ExampleUsage() {
//   let { data } = useCurrentUserData();
//   return (
//     <CurrentUserContext.Provider value={data}>
//       <div>
//         Your app here
//         <ChildComponent />
//       </div>
//     </CurrentUserContext.Provider>
//   );
// }

// // Use the normal hook anywhere in your app (assuming you've wrapped it in a provider)
// function ChildComponent() {
//   let data = useCurrentUser();
//   return <div>{JSON.stringify(data, null, 2)}</div>;
// }
