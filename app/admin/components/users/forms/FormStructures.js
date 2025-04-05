export const CustomerRegistrationForm = [
    {
      title: "Name",
      field: "CustomerName",
      type: "text",
      required:true
    },
    {
      title: "Email",
      field: "CustomerEmail",
      type: "email",
      required:true
    },
    { 
        title: "Phone Number", 
        field: "Phone", 
        type: "number", 
        required:true
    },
    { 
        title: "Password", 
        field: "Customer_Password", 
        type: "password", 
        required:true
    }
  ];

  export const CustomerEditingForm =[
    { 
      title: "Name", 
      field: "CustomerName", 
      type: "text"
  },
  { 
    title: "Email", 
    field: "CustomerEmail", 
    type: "text", 
  },
  { 
    title: "Phone", 
    field: "Phone", 
    type: "number", 
  },
  { 
    title: "Address", 
    field: "Address", 
    type: "text", 
  },
  { 
    title: "Loyalty Points", 
    field: "LoyaltyPoints", 
    type: "number", 
  },
  { 
    title: "Wallet Balance", 
    field: "WalletBalance", 
    type: "number", 
  }
  ]

  export const UserRegistrationForm = [
    {
      title:"Name",
      field:"FullName",
      type:"text",
      required:true,
    },
    {
      title:"Email",
      field:"Email",
      type:"text",
      required:true
    },
    {
      title:"Password",
      field:"PasswordHash",
      type:"password",
      required:true
    },
    {
      title:"Role",
      field:"role_id",
      type:"select",
      required:true
    }
  ]

  export const CustomerDetailsUpdateForm = [
    {
      title:"Name",
      field:"CustomerName",
      type:"text",
    },
    {
      title:"Email",
      field:"CustomerEmail",
      type:"email",
    },
    {
      title:"Phone",
      field:"Phone",
      type:"number",
    },
    {
      title:"Password",
      field:"Customer_Password",
      type:"text"
    },
    {
      title:"Address",
      field:"Address",
      type:"text"
    },
  ]
  export const FinanceDetailsUpdateForm = [
    {
      title:"Loyalty points percentage",
      field:"LoyaltyPointsPercentage",
      type:"number",
    },
    {
      title:"Loyalty Redeeming Requirement",
      field:"LoyaltyRedeemingRequirement",
      type:"number",
    },
    {
      title:"Table Reservation Fee",
      field:"TableReservationFee",
      type:"number"
    },
  ]