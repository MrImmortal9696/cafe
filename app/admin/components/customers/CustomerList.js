import CustomerListElement from "./CustomerListElement";

export default function CustomerList({handleSort,sortField,filteredCustomers}){
      const CustomerHeaders = [
        { label: "ID", field: "CustomerID", span: 1 },
        { label: "Name", field: "CustomerName", span: 1 },
        { label: "Email", field: "CustomerEmail", span: 2 },
        { label: "Password", field: "Customer_Password", span: 1 },
        { label: "Phone", field: "Phone", span: 1 },
        { label: "Address", field: "Address", span: 2 },
        { label: "Loyalty Points", field: "LoyaltyPoints", span: 1 },
        { label: "Wallet Balance", field: "WalletBalance", span: 1 },
        { label: "Actions", field: "Actions", span: 1 },
      ];

    return (
        <div>

         <div className="grid grid-cols-11 text-center font-bold bg-gray-100 p-2">
                      {CustomerHeaders.map((header, index) => (
                        <span
                          key={index}
                          onClick={() => header.field && handleSort(header.field)}
                          className={`cursor-pointer col-span-${header.span}`}
                        >
                          {header.label}
                          {sortField === header.field && (
                            <span> {sortOrder === "asc" ? "▲" : "▼"}</span>
                          )}
                        </span>
                      ))}
      
        </div>
        <div className="overflow-y-auto no-scrollbar h-full w-full">
             {
              filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <CustomerListElement customer={customer} key={index} />
                ))
              ) : (
                <div className="text-center py-4">No customers found</div>
              )} 
                {/* <pre>{JSON.stringify(filteredCustomers,null,2)}</pre> */}
            </div>
    </div>

    )
}