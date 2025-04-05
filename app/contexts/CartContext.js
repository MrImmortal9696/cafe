"use client";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getLocalDate } from "@/libs/hourFormat";
// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
    const { data: session } = useSession();
    const [cart, setCart] = useState([]);
    const [walletBalance, setWalletBalance] = useState();
    const [TaxesList, setTaxesList] = useState([]);
    const [pendingOrders,setPendingOrders] = useState()
    const [ongoingReservations,setOngoingReservations] = useState()

    // Load cart from localStorage on component mount
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Fetch tax details and wallet balance
    useEffect(() => {
        async function GetTaxDetails() {
            if (session?.user?.role !== "customer") {
                const pending_res = await HandleUsers(
                    { mode: "get", item_type: "today_pending_orders", 
                      data: { OrderDate: getLocalDate() } 
                    })
                const ongoing_res = await HandleUsers(
                    { mode: "get", item_type: "today_ongoing_reservations", 
                        data: { ReservationDate: getLocalDate() } 
                    })
            if (pending_res?.[0]?.PendingOrders) {
                
                setPendingOrders(pending_res[0]?.PendingOrders);
                
            }
            if ( ongoing_res?.[0]?.OngoingReservations) {
                
                setOngoingReservations(ongoing_res[0]?.OngoingReservations)
            }
            }

            if (session?.user?.role === "customer") {
                const wallet_res = await HandleUsers({
                    mode: "get",
                    item_type: "wallet_balance",
                    data: { CustomerEmail: session?.user?.email }
                });
                
                setWalletBalance(parseFloat(wallet_res[0]?.WalletBalance) || 0); // Ensure it's a float
            }  
        }
    
        if (session && session.user) {
            GetTaxDetails();
        }
    }, [session]);



    useEffect(()=>{
        async function GetTaxesList(){
            const tax_list = await HandleUsers({ mode: "get", item_type: "billing_tax_list", data: {} });
            setTaxesList(tax_list);
        }
        GetTaxesList()
    },[])

    // console.log({session})
    // Function to create a unique item key
    const createItemKey = (item) => {
        const selections = item.selections || [];
        return `${item.id}-${selections.map(option => option.name).join('-')}`;
    };

    // Function to add item to cart
    const addToCart = (item) => {
        // console.log({cart:item})
        setCart((prevCart) => {
            const itemKey = createItemKey(item);
            const itemWithKey = { ...item, itemKey };
            const existingItem = prevCart.find((cartItem) => cartItem.itemKey === itemKey);

            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.itemKey === itemKey
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevCart, { ...itemWithKey, quantity: 1 }];
        });
    };

    // Function to increment item quantity
    const incrementQuantity = (item) => {
        setCart((prevCart) =>
            prevCart.map((cartItem) =>
                cartItem.itemKey === item.itemKey
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            )
        );
    };

    // Function to decrement item quantity
    const decrementQuantity = (item) => {
        setCart((prevCart) =>
            prevCart.map((cartItem) =>
                cartItem.itemKey === item.itemKey
                    ? { ...cartItem, quantity: cartItem.quantity > 1 ? cartItem.quantity - 1 : 1 }
                    : cartItem
            )
        );
    };

    // Function to remove item from cart
    const removeFromCart = (item) => {
        setCart((prevCart) =>
            prevCart.filter((cartItem) => cartItem.itemKey !== item.itemKey)
        );
    };

    // Function to clear the cart
    const clearCart = () => {
        setCart([]);
    };

    // Get unique items count
    const getUniqueItemsCount = () => {
        return cart.length;
    };

    // Get total cost of cart
    const getTotalCost = () => {
        const total = cart.reduce((total, item) => total + (parseFloat(item.totalPrice) || 0) * item.quantity, 0);
        return parseFloat(total.toFixed(2)); // Keep float consistency
    };
    // Function to calculate tax for each active tax in TaxesList
    const getTaxBreakdown = () => {
        const total = getTotalCost(); // Already a float
    
        if (!TaxesList || TaxesList.length === 0) return [];
    
        return TaxesList.filter(tax => tax.Active).map(tax => ({
            TaxID: tax.TaxID,
            TaxName: tax.TaxName,
            TaxPercentage: parseFloat(tax.TaxPercentage) || 0, // Ensure numeric tax percentage
            Active: tax.Active,
            Amount: parseFloat(((total * tax.TaxPercentage) / 100).toFixed(2)) // Ensure numeric tax amount
        }));
    };


    // Function to get total tax amount from tax breakdown
    const getTotalTaxSum = () => {
        const taxBreakdown = getTaxBreakdown();
        return parseFloat(taxBreakdown.reduce((sum, tax) => sum + parseFloat(tax.Amount), 0).toFixed(2)); // Ensure numeric total tax sum
    };

    // Function to get total bill amount including all taxes
    const getTotalBillWithTaxes = () => {
        const total = getTotalCost(); // Already a float
        const totalTax = getTotalTaxSum(); // Already a float
        return parseFloat((total + totalTax).toFixed(2)); // Ensure float consistency
    };

    // Function to update the tax percentage
    

    // Print cart contents (for debugging)
    const printCart = () => {
        console.log(cart);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                incrementQuantity,
                decrementQuantity,
                removeFromCart,
                clearCart,
                getUniqueItemsCount,
                getTotalCost,
                getTaxBreakdown,  // New Function
                getTotalTaxSum,   // New Function
                getTotalBillWithTaxes, // New Function
                TaxesList,
                walletBalance,
                printCart,
                pendingOrders,
                ongoingReservations
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Custom hook for easier usage
export const useCart = () => useContext(CartContext);
