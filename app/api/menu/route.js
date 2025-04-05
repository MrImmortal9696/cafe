import { NextResponse } from "next/server";
import {connect_mysql} from "@/libs/mysql";

export async function GET(req) {
    try {
        const [menuItems] = await connect_mysql.query("SELECT * FROM MenuItems ");

        const [menu_categories] = await connect_mysql.query("SELECT * FROM MenuCategories");

        const [menu_types] = await connect_mysql.query("SELECT * from MenuTypes")

        // Create array structure to match the desired response format
        const menuArray = menu_types.map((type) => ({
            menu_type: type.MenuTypeName,
            categories: menu_categories
                .filter((category) => category.MenuTypeID === type.MenuTypeID) // Filter categories by MenuTypeID
                .map((category) => ({
                    category: category.CategoryName, // Category name
                    dishes: menuItems
                        .filter((item) => item.CategoryID === category.CategoryID) // Filter items by CategoryID
                        .map((item) => ({
                            id:item.ItemID,
                            name: item.ItemName, // Dish name
                            description: item.Description, // Dish description
                            vegetarian: item.vegetarian || false, // Default to false if undefined
                            price: item.Price, 
                            SpiceLevel : item.SpiceLevel,
                            ShortCode: item.ShortCode,
                            image: item.ImageURL, // Dish image URL
                            ImagePublicID:item.ImagePublicID,
                            options: parseJson(item.Options), // Parse optional field
                            extras: parseJson(item.Extras), // Parse optional field

                        })),
                })),
        }));
        

        // Return the JSON response with the array of categories and dishes
        return NextResponse.json({menu_types,menu_categories,menuItems,menuArray});
    } catch (error) {
        console.error(error);

        // Return error response if something fails
        return NextResponse.json(
            {
                error: error.message,
                message: "Data fetch failed",
            },
            { status: 500 }
        );
    }
}

// Helper function to parse JSON safely
function parseJson(value) {
    try {
        // If value is a string, try to parse it as JSON
        if (typeof value === "string") {
            return JSON.parse(value);
        }
        // If it's already an object (or undefined), return it as-is
        return value || [];
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return [];
    }
}
