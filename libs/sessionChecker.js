import { HandleUsers } from "./apifunctions/handleUsers";

export async function SessionChecker(session, path) {
    const checking_body = {
        mode: "find",
        item_type: "access_permissions",
        data: {
            Email: session?.user?.email,
            role: session?.user?.role,
            path
        }
    };

    // Check if session and user are valid before proceeding
    if (session && session?.user) {
        try {
            let data = await HandleUsers(checking_body);
            // console.log ({data} );
            
            // Ensure data exists and has the expected structure before accessing
            if (data && data[0].can_access  && typeof data[0].can_access !== "undefined") {
                // console.log({ data });
                data = data[0].can_access === 1;
                // console.log({ data });
                return data;
            } else {
                // console.log("Invalid data format or missing can_access field");
                return false; // Return false if data is in an unexpected format
            }
        } catch (error) {
            // console.error("Error in SessionChecker:", error);
            return false; // Return false in case of an error
        }
    }

    return false; // Return false if session or user is not valid
}
