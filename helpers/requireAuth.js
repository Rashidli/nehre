import { getSession } from "next-auth/react";
import { httpRequest } from "./utils";

const requireAuth = async (context, callback) => {
   const session = await getSession(
     context
   );
   
   httpRequest.defaults.headers[
    'Authorization'
  ] = `Bearer ${session?.user?.accessToken}`;
    if (!session) {
        return {
            redirect: {
                destination: "/?login=true",
                permanent: false,
            },
        };
    }
    return callback ?  callback({session}) : {props: {session}};
};

export default requireAuth;

